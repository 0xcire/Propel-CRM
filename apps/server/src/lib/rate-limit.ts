import { RateLimiterRes, maxConsecutiveFailsByEmail } from "@propel/redis";

import type { Response } from "express";

export const validateRateLimitAndSetResponse = (rateLimiter: RateLimiterRes | null, res: Response) => {
  if (rateLimiter !== null && rateLimiter.consumedPoints > maxConsecutiveFailsByEmail) {
    console.log("CLIENT IS BLOCKED BY EXCEEDING MAX TRIES");
    const retrySecs = Math.round(rateLimiter.msBeforeNext / 1000) || 1;
    res.set("Retry-After", String(retrySecs));
    return res.status(429).json({
      message: `Too many requests. Try again in ${String(Math.round(+retrySecs / 60))} minutes`,
    });
  }
};

export const handleRateLimitErrorResponse = (error: InstanceType<typeof RateLimiterRes>, res: Response) => {
  res.set("Retry-After", String(Math.round(error.msBeforeNext / 1000)) || "1");
  return res.status(429).json({
    message: `Too many requests. try again in ${String(Math.round(error.msBeforeNext / 1000 / 60))} minutes.`,
  });
};
