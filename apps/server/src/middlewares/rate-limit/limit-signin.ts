import { RateLimiterRes, consumeRateLimitPoint, getRateLimiter, limiterByEmailForSignIn } from "@propel/redis";

import { handleError } from "../../utils";

import type { Request, Response, NextFunction } from "express";

export const rateLimitSignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    await consumeRateLimitPoint(limiterByEmailForSignIn, email);

    const rateLimiter = await getRateLimiter(limiterByEmailForSignIn, email);

    if (rateLimiter?.remainingPoints === 0) {
      throw new RateLimiterRes(
        rateLimiter?.remainingPoints,
        rateLimiter.msBeforeNext,
        rateLimiter?.consumedPoints,
        rateLimiter?.isFirstInDuration
      );
    }

    return next();
  } catch (error) {
    return handleError(error, res);
  }
};
