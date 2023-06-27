import dotenv from "dotenv";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// TODO: add https://github.com/t3-oss/t3-env
dotenv.config();

const queryClient = postgres(`${process.env.PG_URL}`);
export const db: PostgresJsDatabase = drizzle(queryClient);
