import dotenv from "dotenv";
import type { Request } from "express";

dotenv.config();

export const ENV = process.env.NODE_ENV;

export const PG_URL = process.env.PG_URL;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PW = process.env.REDIS_PW;
export const REDIS_USERNAME = process.env.REDIS_USERNAME;
export const REDIS_PORT = process.env.REDIS_PORT;

export const IDLE_SESSION_COOKIE = "idle-propel-session";
export const IDLE_SESSION_LENGTH = process.env.IDLE_SESSION_LENGTH;

export const ABSOLUTE_SESSION_COOKIE = "absolute-propel-session";
export const ABSOLUTE_SESSION_LENGTH = process.env.ABSOLUTE_SESSION_LENGTH;

export const PRE_AUTH_SESSION_COOKIE = "pre-auth-session";
export const PRE_AUTH_SESSION_LENGTH = process.env.PRE_AUTH_SESSION_LENGTH;

// for quick testing
// export const IDLE_SESSION_LENGTH = "1000";
// export const ABSOLUTE_SESSION_LENGTH = "5000";
// export const PRE_AUTH_SESSION_LENGTH = "5000";

export const CSRF_COOKIE = "csrf-token";

export const CSRF_SECRET = process.env.CSRF_SECRET as string;
export const PRE_AUTH_CSRF_SECRET = process.env.PRE_AUTH_CSRF_SECRET as string;

export const COOKIE_SECRET = process.env.COOKIE_SECRET;

export const SALT_ROUNDS = process.env.SALT_ROUNDS;

export const sessionRelatedCookies = [ABSOLUTE_SESSION_COOKIE, IDLE_SESSION_COOKIE, CSRF_COOKIE];

export const getRequestBodies = (req: Request) => {
  return [
    {
      context: "body",
      data: req.body,
    },
    {
      context: "cookies",
      data: req.signedCookies,
    },
    {
      context: "query",
      data: req.query,
    },
    {
      context: "params",
      data: req.params,
    },
  ];
};
