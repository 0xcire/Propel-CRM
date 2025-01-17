import { findUsersByID } from "@propel/drizzle";
import {
  consumeRateLimitPoint,
  getRateLimiter,
  limiterByEmailForAccountRecovery,
  limiterByEmailForSignIn,
  limiterByUserIDForAccountVerification,
  RateLimiterRes,
} from "@propel/redis";
import { handleError } from "../common/utils";
import { PropelHTTPError } from "../lib/http-error"; 

import type { Request, Response, NextFunction } from "express";
import type { IRateLimitMiddleware } from './auth.interface'
import type { MiddlewareResponse } from "../common/middleware/types"; 

export class RateLimitMiddleware implements IRateLimitMiddleware {
  public async accountRecoveryRl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse> {
    try {
      const { email } = req.body;

      await consumeRateLimitPoint(limiterByEmailForAccountRecovery, email);
      const rateLimiter = await getRateLimiter(
        limiterByEmailForAccountRecovery,
        email
      );

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
  }

  public async accountVerificationRl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse> {
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
      await consumeRateLimitPoint(
        limiterByUserIDForAccountVerification,
        userID.toString()
      );
      const rateLimiter = await getRateLimiter(
        limiterByUserIDForAccountVerification,
        userID.toString()
      );

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
  }

  public async signInRl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse> {
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
  }
}
