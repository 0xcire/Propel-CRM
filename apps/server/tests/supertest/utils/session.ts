import { deleteRedisKV, redisClient } from "@propel/redis";
import { decodeSignedCookie, findCookieByName, parseCookieForValue } from "./headers";
import { queryClient } from "@propel/drizzle";

import type { Header } from "../types";

export const cleanUpSession = async (headers: Header) => {
  const cookies = headers["set-cookie"] as unknown as Array<string>;
  // const sessionCookie = findCookieByName(cookies, COOKIES.ABSOLUTE_SESSION);
  const sessionCookie = findCookieByName(cookies, "absolute-propel-session");
  const signedSessionID = parseCookieForValue(sessionCookie);

  const sessionID = decodeSignedCookie(signedSessionID);

  await deleteRedisKV(sessionID);
};

export const disconnectFromRedis = async () => {
  await redisClient.quit();
};

export const disconnectFromDb = async () => await queryClient.end();
