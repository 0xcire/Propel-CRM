import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import * as schema from "./schema";

import { PG_URL } from "../config";

// TODO: close connection after each query

const queryClient = postgres(`${PG_URL}`);
// : PostgresJsDatabase
export const db = drizzle(queryClient, { schema: schema });
// migrate(db, { migrationsFolder: "drizzle" });
