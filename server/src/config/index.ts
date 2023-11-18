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

export const COOKIE_SECRET = process.env.COOKIE_SECRET;

export const SALT_ROUNDS = process.env.SALT_ROUNDS;

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
