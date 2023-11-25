import Redis from "ioredis";
import { REDIS_HOST, REDIS_PW, REDIS_USERNAME, REDIS_PORT, ENV } from "../config";

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
