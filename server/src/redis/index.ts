import Redis from "ioredis";
import { REDIS_HOST, REDIS_PW, REDIS_USERNAME, REDIS_PORT, ENV } from "../config";
import { RateLimiterRedis } from "rate-limiter-flexible";

export const maxConsecutiveFailsByEmail = 5;

export const redis = new Redis({
  host: REDIS_HOST,
  username: REDIS_USERNAME,
  password: REDIS_PW,
  port: +(REDIS_PORT as string),
  tls: {},

  enableOfflineQueue: false,
  showFriendlyErrorStack: ENV === "development",
  autoResubscribe: false,
  maxRetriesPerRequest: 1,
});

export const limiterConsecutiveFailsByEmail = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "login_fail_consecutive_email",
  points: maxConsecutiveFailsByEmail,
  duration: 60 * 60 * 2, // two hours
  blockDuration: 60 * 15, // 15 minutes
});

export const setRedisSession = async (sessionID: string, userID: number, expires: number) => {
  await redis.set(sessionID, userID);
  await redis.pexpire(sessionID, expires);
};

export const getUserFromSession = async (sessionID: string) => {
  const userID = await redis.get(sessionID);

  return userID;
};

export const deleteRedisSession = async (sessionID: string) => {
  await redis.del(sessionID);
};
