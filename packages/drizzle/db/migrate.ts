import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, queryClient } from ".";

(async () => {
  await migrate(db, { migrationsFolder: "migrations" });
  await queryClient.end();
})();
