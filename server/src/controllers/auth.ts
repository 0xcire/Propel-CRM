// rate limit ref: https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#minimal-protection-against-password-brute-force

import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import { deleteRedisSession, redis, setRedisSession } from "../redis";
import { findUsersByEmail, findUsersByUsername, insertNewUser } from "../db/queries/user";
import { checkPassword, createSecureCookie, createToken, deriveSessionCSRFToken, hashPassword } from "../utils";
import {
  IDLE_SESSION_COOKIE,
  ABSOLUTE_SESSION_COOKIE,
  IDLE_SESSION_LENGTH,
  ABSOLUTE_SESSION_LENGTH,
  CSRF_COOKIE,
  sessionRelatedCookies,
  PRE_AUTH_SESSION_COOKIE,
  CSRF_SECRET,
  ENV,
} from "../config/index";

import type { Request, Response } from "express";
import type { NewUser } from "../db/types";
import type { UserInput } from "./types";

// TODO: add email verification later
// TODO: add account recovery later

// TODO: signin = async(req,res): Promise<PropelResponse>

const maxConsecutiveFailsByEmail = 5;

const limiterConsecutiveFailsByEmail = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "login_fail_consecutive_username",
  points: maxConsecutiveFailsByEmail,
  duration: 60 * 60 * 2, // Store number for two hours since first fail
  blockDuration: 60 * 15, // Block for 15 minutes
});

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserInput = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const rlResEmail = await limiterConsecutiveFailsByEmail.get(email);

    let userByEmail, passwordMatches;

    if (rlResEmail !== null && rlResEmail.consumedPoints > maxConsecutiveFailsByEmail) {
      console.log("CLIENT IS BLOCKED BY EXCEEDING MAX TRIES");
      const retrySecs = Math.round(rlResEmail.msBeforeNext / 1000) || 1;
      res.set("Retry-After", String(retrySecs));
      return res.status(429).json({
        message: `Too many requests. Try again in ${String(Math.round(+retrySecs / 60))} minutes`,
      });
    } else {
      userByEmail = await findUsersByEmail({ email: email, signingIn: true });
      passwordMatches = await checkPassword(password, userByEmail?.hashedPassword as string);

      // suggest signing up, redirect to account recovery, send email if email exists, etc
      // notify of how many retries they have
      if (!userByEmail || !passwordMatches) {
        try {
          await limiterConsecutiveFailsByEmail.consume(email);
          const tries = rlResEmail?.remainingPoints;
          return res.status(401).json({
            message: `Incorrect email or password. ${rlResEmail?.remainingPoints ?? "5"} tries remaining.`,
          });
        } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({});
          } else if (error instanceof RateLimiterRes) {
            res.set("Retry-After", String(Math.round(error.msBeforeNext / 1000)) || "1");
            return res.status(429).json({
              message: `Too many requests. try again in ${String(Math.round(error.msBeforeNext / 1000 / 60))} minutes.`,
            });
          }
        }
      }
    }

    const sessionID = createToken();

    createSecureCookie({
      res: res,
      name: ABSOLUTE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    createSecureCookie({
      res: res,
      name: IDLE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(IDLE_SESSION_LENGTH as string),
    });

    res.cookie(CSRF_COOKIE, deriveSessionCSRFToken(CSRF_SECRET, sessionID), {
      httpOnly: false,
      secure: true,
      signed: false,
      sameSite: "lax",
      domain: ENV === "production" ? "propel-crm.xyz" : undefined,
      maxAge: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      domain: ENV === "production" ? "propel-crm.xyz" : undefined,
      sameSite: "lax",
    });

    await limiterConsecutiveFailsByEmail.delete(email);

    req.session = {
      id: sessionID,
    };

    await setRedisSession(sessionID, userByEmail?.id as number, +(ABSOLUTE_SESSION_LENGTH as string));

    return res.status(200).json({
      message: "signing in",
      user: userByEmail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password }: UserInput = req.body;

    if (!name || !username || !email || !password) {
      return res.sendStatus(400);
    }

    const userByEmail = await findUsersByEmail({ email: email });

    const userByUsername = await findUsersByUsername(username);

    if (userByUsername) {
      return res.status(409).json({
        message: "Username not available. Please pick another.",
      });
    }

    if (userByEmail) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    // create email verificaation functionality
    // TODO: this along wth  password reset, would be a good usecase for jwt!

    const hashedPassword = await hashPassword(password);
    const sessionID = createToken();

    const newUser: NewUser = {
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
    };

    const insertedUser = await insertNewUser(newUser);

    await setRedisSession(sessionID, insertedUser.id as number, +(ABSOLUTE_SESSION_LENGTH as string));

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      domain: ENV === "production" ? "propel-crm.xyz" : undefined,
      sameSite: "lax",
    });

    req.session = {
      id: sessionID,
    };

    createSecureCookie({
      res: res,
      name: ABSOLUTE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    createSecureCookie({
      res: res,
      name: IDLE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(IDLE_SESSION_LENGTH as string),
    });

    res.cookie(CSRF_COOKIE, deriveSessionCSRFToken(CSRF_SECRET, sessionID), {
      httpOnly: false,
      secure: true,
      signed: false,
      sameSite: "lax",
      domain: ENV === "production" ? "propel-crm.xyz" : undefined,
      maxAge: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      domain: ENV === "production" ? "propel-crm.xyz" : undefined,
      sameSite: "lax",
    });

    req.session = {
      id: sessionID,
    };

    return res.status(201).json({
      message: "Signing up.",
      user: insertedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];

    await deleteRedisSession(sessionToken);

    sessionRelatedCookies.forEach((cookie) => {
      res.clearCookie(cookie, {
        path: "/",
        domain: ENV === "production" ? "propel-crm.xyz" : undefined,
        sameSite: "lax",
      });
    });

    res.clearCookie("idle", {
      path: "/",
      domain: ENV === "production" ? "propel-crm.xyz" : undefined,
      sameSite: "lax",
    });

    req.session = {
      id: "",
    };

    return res.status(200).json({
      message: "Signing out.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
