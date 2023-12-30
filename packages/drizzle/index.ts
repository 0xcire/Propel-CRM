import { drizzle } from "drizzle-orm/postgres-js";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import * as schema from "./schema";

import { PG_URL } from "./config";

const queryClient = postgres(`${PG_URL}`);
export const db = drizzle(queryClient, { schema: schema });

// import {
//   //   createFakeActiveListing,
//   //   createFakeContact,
//   //   seedContacts,
//   seedListings,
//   seedListingsAndSoldListings,
//   seedTasks,
// } from "../lib/faker";

// // : PostgresJsDatabase
// // migrate(db, { migrationsFolder: "drizzle" });

// // seedListingsAndSoldListings();
// // seedListings();
// // seedContacts();
// // seedTasks();