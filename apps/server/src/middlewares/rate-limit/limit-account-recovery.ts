import { RateLimiterRes, consumeRateLimitPoint, getRateLimiter, limiterByEmailForAccountRecovery } from "@propel/redis";

import { handleError } from "../../utils";

import type { Request, Response, NextFunction } from "express";

export const rateLimitAccountRecovery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    await consumeRateLimitPoint(limiterByEmailForAccountRecovery, email);
    const rateLimiter = await getRateLimiter(limiterByEmailForAccountRecovery, email);

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
