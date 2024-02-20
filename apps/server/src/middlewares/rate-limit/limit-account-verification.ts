import { findUsersByID } from "@propel/drizzle";
import {
  RateLimiterRes,
  consumeRateLimitPoint,
  getRateLimiter,
  limiterByUserIDForAccountVerification,
} from "@propel/redis";

import { PropelHTTPError } from "../../lib/http-error";
import { handleError } from "../../utils";

import type { Request, Response, NextFunction } from "express";

export const rateLimitAccountVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.user.id;

    const userByID = await findUsersByID({ id: userID, verification: true });

    if (!userByID) {
      throw new PropelHTTPError({
        code: "NOT_FOUND",
        message: "Can't find user.",
      });
    }

    if (userByID.isVerified) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "User is already verified.",
      });
    }
    await consumeRateLimitPoint(limiterByUserIDForAccountVerification, userID.toString());
    const rateLimiter = await getRateLimiter(limiterByUserIDForAccountVerification, userID.toString());

    if (rateLimiter?.remainingPoints === 0) {
      throw new RateLimiterRes(
        rateLimiter?.remainingPoints,
        rateLimiter.msBeforeNext,
        rateLimiter?.consumedPoints,
        rateLimiter?.isFirstInDuration
      );
    }

    req.user.email = userByID.email;

    return next();
  } catch (error) {
    return handleError(error, res);
  }
};
