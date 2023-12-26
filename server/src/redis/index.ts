import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { REDIS_HOST, REDIS_PW, REDIS_USERNAME, REDIS_PORT, ENV } from "../config";

export const maxConsecutiveFailsByEmail = 5;
const TWO_HOURS = 60 * 60 * 2;
const _15_MINUTES = 60 * 15;

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
  duration: TWO_HOURS,
  blockDuration: _15_MINUTES,
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
