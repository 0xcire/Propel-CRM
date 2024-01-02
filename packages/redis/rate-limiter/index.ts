import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../client";

export const maxConsecutiveFailsByEmail = 5;
const TWO_HOURS = 60 * 60 * 2;
const _15_MINUTES = 60 * 15;

export const limiterConsecutiveFailsByEmail = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "login_fail_consecutive_email",
  points: maxConsecutiveFailsByEmail,
  duration: TWO_HOURS,
  blockDuration: _15_MINUTES,
});
