import { deleteRedisKV, redisClient } from "@propel/redis";
import { decodeSignedCookie, findCookieByName, parseCookieForValue } from "./headers";
import { queryClient } from "@propel/drizzle";

import type { Header } from "../types";

export const cleanUpSession = async (headers: Header) => {
  const sessionCookie = findCookieByName(headers["set-cookie"] as unknown as Array<string>, "absolute-propel-session");
  const signedSessionID = parseCookieForValue(sessionCookie);

  const sessionID = decodeSignedCookie(signedSessionID);

  await deleteRedisKV(sessionID);
};

export const disconnectFromRedis = () => {
  redisClient.disconnect();
};

export const disconnectFromDb = async () => await queryClient.end();
