import { drizzle } from "drizzle-orm/postgres-js";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// import { propelFaker } from "@propel/faker";

import * as schema from "../schema";

import { PG_URL } from "../config";

const queryClient = postgres(`${PG_URL}`);
export const db = drizzle(queryClient, { schema: schema });
// export const runMigration = () => migrate(db, { migrationsFolder: "logs" });

// migrate(db, { migrationsFolder: "logs" });
// propelFaker.seedDatabase()
