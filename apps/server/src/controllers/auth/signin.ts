import { findUsersByEmail } from "@propel/drizzle";
import { RateLimiterRes, consumeRateLimitPoint, deleteRateLimit, getRateLimiter } from "@propel/redis";
import { checkPassword } from "@propel/lib";

import { handleRateLimitErrorResponse, validateRateLimitAndSetResponse } from "../../lib";
import { persistAuthSession, removePreAuthCookies, setAuthSessionCookies, createToken } from "../../utils";

import type { Request, Response } from "express";
import type { UserInput } from "../types";

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserInput = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const rateLimiter = await getRateLimiter(email);
    const tries = rateLimiter?.remainingPoints;
    validateRateLimitAndSetResponse(rateLimiter, res);

    const userByEmail = await findUsersByEmail({ email: email, signingIn: true });
    await consumeRateLimitPoint(email);

    if (!userByEmail) {
      return res.status(401).json({
        message: `Incorrect email or password. ${tries ?? "5"} tries remaining.`,
      });
    }

    if (userByEmail && userByEmail.hashedPassword) {
      const passwordMatches = await checkPassword(password, userByEmail.hashedPassword);

      if (!passwordMatches) {
        return res.status(401).json({
          message: `Incorrect email or password. ${tries ?? "5"} tries remaining.`,
        });
      }
    }

    const sessionID = createToken(16);

    await deleteRateLimit(email);
    await persistAuthSession(req, sessionID, userByEmail.id);

    removePreAuthCookies(req, res);
    setAuthSessionCookies(req, res, sessionID);

    return res.status(200).json({
      message: "signing in",
      user: userByEmail,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof RateLimiterRes) {
      return handleRateLimitErrorResponse(error, res);
    }

    return res.status(500).json({});
  }
};
