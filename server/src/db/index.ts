import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import * as schema from "./schema";

import dotenv from "dotenv";

// TODO: add https://github.com/t3-oss/t3-env
dotenv.config();

const queryClient = postgres(`${process.env.PG_URL}`);
// export const db: PostgresJsDatabase = drizzle(queryClient, { schema: schema });
export const db = drizzle(queryClient, { schema: schema });
// migrate(db, { migrationsFolder: "drizzle" });

// users
// listings
// contacts
// tasks
// analytics
