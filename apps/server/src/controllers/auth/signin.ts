import { findUsersByEmail } from "@propel/drizzle";
import { limiterByEmailForSignIn, deleteRateLimit, getRateLimiter } from "@propel/redis";

import { checkPassword } from "@propel/lib";
import { persistAuthSession, removePreAuthCookies, setAuthSessionCookies, createToken, handleError } from "../../utils";

import { PropelHTTPError } from "../../lib/http-error";

import type { Request, Response } from "express";
import type { UserInput } from "../types";

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserInput = req.body;

    if (!email || !password) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Please fill in all fields.",
      });
    }

    const rateLimiter = await getRateLimiter(limiterByEmailForSignIn, email);
    const tries = rateLimiter?.remainingPoints;

    const userByEmail = await findUsersByEmail({ email: email, signingIn: true });

    if (!userByEmail) {
      throw new PropelHTTPError({
        code: "UNAUTHORIZED",
        message: `Incorrect email or password. ${tries ?? "5"} tries remaining.`,
      });
    }

    if (userByEmail && userByEmail.hashedPassword) {
      const passwordMatches = await checkPassword(password, userByEmail.hashedPassword);

      if (!passwordMatches) {
        throw new PropelHTTPError({
          code: "UNAUTHORIZED",
          message: `Incorrect email or password. ${tries ?? "5"} tries remaining.`,
        });
      }
    }

    const sessionID = createToken(16);

    await deleteRateLimit(limiterByEmailForSignIn, email);
    await persistAuthSession(req, sessionID, userByEmail.id);

    removePreAuthCookies(req, res);
    setAuthSessionCookies(req, res, sessionID);

    return res.status(200).json({
      message: "signing in",
      user: userByEmail,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
