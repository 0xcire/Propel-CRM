// rate limit ref: https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#minimal-protection-against-password-brute-force

import { sendRecoverPasswordEmail } from "../lib/resend";
import {
  RateLimiterRes,
  setRedisSession,
  deleteRedisSession,
  consumeRateLimitPoint,
  getRateLimiter,
  deleteRateLimit,
} from "@propel/redis";
import { findUsersByEmail, findUsersByUsername, insertNewUser } from "@propel/drizzle";
import {
  checkPassword,
  createAToken,
  // createAToken,
  createSecureCookie,
  createToken,
  deriveSessionCSRFToken,
  isDeployed,
} from "../utils";
import { handleRateLimitErrorResponse, validateRateLimitAndSetResponse } from "../lib/rate-limit";
import { hashPassword } from "@propel/lib";
import {
  IDLE_SESSION_COOKIE,
  ABSOLUTE_SESSION_COOKIE,
  IDLE_SESSION_LENGTH,
  ABSOLUTE_SESSION_LENGTH,
  CSRF_COOKIE,
  sessionRelatedCookies,
  PRE_AUTH_SESSION_COOKIE,
  CSRF_SECRET,
  SALT_ROUNDS,
} from "../config/index";

import type { Request, Response } from "express";
import type { NewUser } from "@propel/drizzle";
import type { UserInput } from "./types";

// TODO: signin = async(req,res): Promise<PropelResponse>

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserInput = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const rateLimiter = await getRateLimiter(email);
    let userByEmail, passwordMatches;

    validateRateLimitAndSetResponse(rateLimiter, res);

    try {
      userByEmail = await findUsersByEmail({ email: email, signingIn: true });
      const tries = rateLimiter?.remainingPoints;

      if (!userByEmail) {
        await consumeRateLimitPoint(email);
        return res.status(401).json({
          message: `Incorrect email or password. ${tries ?? "5"} tries remaining.`,
        });
      }

      if (userByEmail) {
        passwordMatches = await checkPassword(password, userByEmail?.hashedPassword as string);
        if (!passwordMatches) {
          await consumeRateLimitPoint(email);
          return res.status(401).json({
            message: `Incorrect email or password. ${tries ?? "5"} tries remaining.`,
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({});
      } else if (error instanceof RateLimiterRes) {
        handleRateLimitErrorResponse(error, res);
      }
    }
    // }

    const sessionID = createToken(16);

    createSecureCookie(req, {
      res: res,
      name: ABSOLUTE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    createSecureCookie(req, {
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
      domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
      maxAge: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
      sameSite: "lax",
    });

    await deleteRateLimit(email);

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

    const hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));
    const sessionID = createToken(16);

    const newUser: NewUser = {
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
    };

    const insertedUser = await insertNewUser(newUser);

    await setRedisSession(sessionID, insertedUser?.id as number, +(ABSOLUTE_SESSION_LENGTH as string));

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
      sameSite: "lax",
    });

    req.session = {
      id: sessionID,
    };

    createSecureCookie(req, {
      res: res,
      name: ABSOLUTE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    createSecureCookie(req, {
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
      domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
      maxAge: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
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
        domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
        sameSite: "lax",
      });
    });

    res.clearCookie("idle", {
      path: "/",
      domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
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

// one request per 30 minutes
export const recoverPassword = async (req: Request, res: Response) => {
  try {
    // const ONE_HOUR = 3600000;
    const { email } = req.body;

    const recoveryIdentifier = `${email}-recovery`;

    const rateLimiter = await getRateLimiter(recoveryIdentifier);
    validateRateLimitAndSetResponse(rateLimiter, res);

    const userByEmail = await findUsersByEmail({ email: email });

    if (!userByEmail) {
      consumeRateLimitPoint(recoveryIdentifier);
      return res.status(200).json({
        message: "Incoming! Password reset email heading your way.",
      });
    }

    if (userByEmail) {
      const token = createToken(64);
      consumeRateLimitPoint(recoveryIdentifier);
    }

    // generate token store in redis ( w/ TTL ) with userID
    // 'this link will expire after 1 hour' or etc...
    // use ID on frontend? /auth/recovery/${id}
    // as a way to authenticate this route
    // if !id -> display this request has expired ?

    // when user visits url, send delete request to delete token from redis ?
    // token should default to last only 30 or 60 min

    // const sessionID = createAToken(64);
    // setRedisSession(sessionID, userByEmail?.id as number, ONE_HOUR);
    const data = await sendRecoverPasswordEmail(email);
    console.log(data);

    return res.status(200).json({
      message: "Incoming! Password reset email heading your way.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was an error processing your request. Please try again.",
    });
  }
};
