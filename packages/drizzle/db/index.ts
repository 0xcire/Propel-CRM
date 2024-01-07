import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// import { propelFaker } from "@propel/faker";

import * as schema from "../schema";
import { PG_URL } from "../config";

export const queryClient = postgres(`${PG_URL}`);
export const db = drizzle(queryClient, { schema: schema });
// propelFaker.seedDatabase()
