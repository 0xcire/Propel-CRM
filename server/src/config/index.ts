import dotenv from "dotenv";
import type { Request } from "express";
dotenv.config();

export const PG_URL = process.env.PG_URL;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME;
export const SESSION_COOKIE_LENGTH = process.env.SESSION_COOKIE_LENGTH;

export const getRequestBodies = (req: Request) => {
  return [
    {
      source: "body",
      data: req.body,
    },
    {
      source: "cookies",
      data: req.cookies,
    },
    {
      source: "query",
      data: req.query,
    },
    {
      source: "params",
      data: req.params,
    },
  ];
};
