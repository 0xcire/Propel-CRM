import dotenv from "dotenv";
dotenv.config();

export const PG_URL = process.env.PG_URL;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME;
export const SESSION_COOKIE_LENGTH = process.env.SESSION_COOKIE_LENGTH;
