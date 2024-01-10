import dotenv from "dotenv";
// { path: `../../../apps/server/.env.${process.env.NODE_ENV}` }
dotenv.config();

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PW = process.env.REDIS_PW ?? undefined;
export const REDIS_USERNAME = process.env.REDIS_USERNAME ?? undefined;
export const REDIS_PORT = process.env.REDIS_PORT;
export const ENV = process.env.NODE_ENV;
