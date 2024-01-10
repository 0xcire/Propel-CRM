import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schema";
import { PG_URL } from "../config";

export const queryClient = postgres(`${PG_URL}`);
export const db = drizzle(queryClient, { schema: schema });
