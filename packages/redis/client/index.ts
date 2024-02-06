import Redis from "ioredis";

import { REDIS_HOST, REDIS_PW, REDIS_USERNAME, REDIS_PORT, ENV } from "../config";

export const redisClient = new Redis({
  host: REDIS_HOST,
  username: REDIS_USERNAME,
  password: REDIS_PW,
  port: +(REDIS_PORT as string),
  ...(REDIS_USERNAME && { tls: {} }), // causes timeout locally, only need host/port

  enableOfflineQueue: false,
  showFriendlyErrorStack: ENV === "development",
  autoResubscribe: false,
  maxRetriesPerRequest: 1,
  connectTimeout: 10000,
});

export const setRedisKV = async (key: string, value: string, expires: number) => {
  await redisClient.set(key, value);
  await redisClient.pexpire(key, expires);
};
export const getValueFromRedisKey = async (key: string) => {
  const value = await redisClient.get(key);
  return value;
};
export const deleteRedisKV = async (key: string) => {
  await redisClient.del(key);
};
