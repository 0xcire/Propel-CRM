import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { REDIS_HOST, REDIS_PW, REDIS_USERNAME, REDIS_PORT, ENV } from "./config";

export { RateLimiterRes } from "rate-limiter-flexible";

export const maxConsecutiveFailsByEmail = 5;
const TWO_HOURS = 60 * 60 * 2;
const _15_MINUTES = 60 * 15;

const redisInstance = new Redis({
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
  storeClient: redisInstance,
  keyPrefix: "login_fail_consecutive_email",
  points: maxConsecutiveFailsByEmail,
  duration: TWO_HOURS,
  blockDuration: _15_MINUTES,
});

export const setRedisSession = async (sessionID: string, userID: number, expires: number) => {
  await redisInstance.set(sessionID, userID);
  await redisInstance.pexpire(sessionID, expires);
};

export const getUserFromSession = async (sessionID: string) => {
  const userID = await redisInstance.get(sessionID);

  return userID;
};

export const deleteRedisSession = async (sessionID: string) => {
  await redisInstance.del(sessionID);
};
