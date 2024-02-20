import { RateLimiterRes } from "@propel/redis";

import type { Response } from "express";

export const handleRateLimitErrorResponse = (error: InstanceType<typeof RateLimiterRes>, res: Response) => {
  res.set("Retry-After", String(Math.round(error.msBeforeNext / 1000)) || "1");
  return res.status(429).json({
    message: `Too many requests. try again in ${String(Math.round(error.msBeforeNext / 1000 / 60))} minutes.`,
  });
};
