// rate limit ref: https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#minimal-protection-against-password-brute-force

import { sendRecoverPasswordEmail, sendVerifyAccountEmail } from "../lib/resend";
import {
  RateLimiterRes,
  setRedisKV,
  deleteRedisKV,
  consumeRateLimitPoint,
  getRateLimiter,
  deleteRateLimit,
  getValueFromRedisKey,
} from "@propel/redis";
import { findUsersByEmail, findUsersByID, findUsersByUsername, insertNewUser, updateUserByID } from "@propel/drizzle";
import { checkPassword, createSecureCookie, createToken, deriveSessionCSRFToken, isDeployed } from "../utils";
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
  ONE_HOUR,
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

    await setRedisKV(sessionID, String(userByEmail?.id as number), +(ABSOLUTE_SESSION_LENGTH as string));

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

    const hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));

    const newUser: NewUser = {
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
    };

    const insertedUser = await insertNewUser(newUser);

    if (!insertedUser) {
      return res.status(400).json({
        message: "There was an error creating your account. Please try again.",
      });
    }

    const sessionID = createToken(16);

    await setRedisKV(sessionID, String(insertedUser?.id as number), +(ABSOLUTE_SESSION_LENGTH as string));

    // removePreAuthSession()
    // createAuthSession()

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

    const token = createToken(64, true);
    await setRedisKV(token, String(insertedUser.id), ONE_HOUR);
    await sendVerifyAccountEmail(insertedUser.email, token);

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

    await deleteRedisKV(sessionToken);

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

// when user completes change password form, delete ratelimiter by recoveryID
// unrelated: need to add is_verified column for account verification
// but also add last_recovery_request column,
// if difference between that and "today" is, X days, return error
export const recoverPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const recoveryIdentifier = `${email}-recovery`;

    const rateLimiter = await getRateLimiter(recoveryIdentifier);
    validateRateLimitAndSetResponse(rateLimiter, res);

    const userByEmail = await findUsersByEmail({ email: email });

    try {
      if (!userByEmail) {
        await consumeRateLimitPoint(recoveryIdentifier);
        return res.status(200).json({
          message: "Incoming! Password reset email heading your way.",
        });
      }

      if (userByEmail) {
        await consumeRateLimitPoint(recoveryIdentifier);

        const token = createToken(64, true);
        await setRedisKV(token, String(userByEmail.id as number), ONE_HOUR);

        await sendRecoverPasswordEmail(email, token);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      if (error instanceof RateLimiterRes) {
        handleRateLimitErrorResponse(error, res);
      }
    }

    // if(last_password_reset_request_exceeds_threshold()) {
    // return res.status(400).json({message: 'nonono' })
    // }

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

export const getValidRecoveryRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Recovery request ID needed." });
    }

    const value = await getValueFromRedisKey(id);

    if (!value) {
      return res.status(404).json({
        message: "Request expired.",
      });
    }

    res.setHeader("Referrer-Policy", "no-referrer");
    return res.status(200).json({
      message: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "" });
  }
};

export const updateUserFromAccountRecovery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Request ID needed." });
    }

    const userID = await getValueFromRedisKey(id);

    if (!userID) {
      return res.status(404).json({
        message: "Request expired.",
      });
    }

    const hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));

    const updatedUser = await updateUserByID({
      id: +userID,
      newPassword: hashedPassword,
    });

    if (!updatedUser) {
      return res.status(400).json({
        message: "There was an error updating your account. Please try again.",
      });
    }

    // await deleteRedisKV(`${updatedUser?.email}-recovery`);
    await deleteRedisKV(id);

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Request token required.",
      });
    }
    const userID = await getValueFromRedisKey(token as string);

    if (!userID) {
      return res.status(400).json({
        message: "Verify email request expired.",
      });
    }

    await updateUserByID({
      id: +userID,
      verified: true,
    });

    await deleteRedisKV(token as string);

    return res.status(200).json({
      message: "Email verified.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const requestNewEmailVerification = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;

    const userByID = await findUsersByID({ id: userID, verification: true });

    if (!userByID) {
      return res.status(404).json({
        message: "Can't find user.",
      });
    }
    if (userByID.isVerified) {
      return res.status(400).json({
        message: "User is already verified.",
      });
    }
    // can be extracted to fn()
    const token = createToken(64, true);
    await setRedisKV(token, String(userID), ONE_HOUR);
    await sendVerifyAccountEmail(userByID.email, token);

    return res.status(200).json({
      message: "New verification email is on it's way",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
