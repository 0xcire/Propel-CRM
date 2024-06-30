import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../client";

const maxPoints = 5;
const _15_MINUTES = 60 * 15;

// this should just be some wrapper class i init with params

export const limiterByUserIDForAccountVerification = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "user_id_verification",
  points: maxPoints,
  duration: _15_MINUTES,
});

export const limiterByEmailForAccountRecovery = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "email_recovery",
  points: maxPoints,
  duration: _15_MINUTES,
});

export const limiterByEmailForSignIn = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "email_signin",
  points: maxPoints,
  duration: _15_MINUTES,
});

export const getRateLimiter = async (limiter: RateLimiterRedis, identifier: string) => {
  return await limiter.get(identifier);
};

export const consumeRateLimitPoint = async (limiter: RateLimiterRedis, identifier: string) => {
  await limiter.consume(identifier);
};

export const deleteRateLimit = async (limiter: RateLimiterRedis, identifier: string) => {
  await limiter.delete(identifier);
};
