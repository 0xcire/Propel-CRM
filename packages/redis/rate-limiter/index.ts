import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../client";

export const maxConsecutiveFailsByEmail = 5;
const TWO_HOURS = 60 * 60 * 2;
const _15_MINUTES = 60 * 15;

export const limiterConsecutiveFailsByEmail = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "limit_by_email",
  points: maxConsecutiveFailsByEmail,
  duration: TWO_HOURS,
  blockDuration: _15_MINUTES,
});

export const getRateLimiter = async (email: string) => {
  return await limiterConsecutiveFailsByEmail.get(email);
};

export const consumeRateLimitPoint = async (email: string) => {
  await limiterConsecutiveFailsByEmail.consume(email);
};

export const deleteRateLimit = async (email: string) => {
  await limiterConsecutiveFailsByEmail.delete(email);
};
