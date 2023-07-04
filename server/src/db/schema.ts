// users
// listings
// contacts
// tasks
// analytics

import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { InferModel, eq } from "drizzle-orm";
import { db } from ".";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  username: varchar("username", { length: 30 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  isAdmin: boolean("isAdmin").default(false),
  createdAt: timestamp("createdAt", { withTimezone: true }),
});
export type User = InferModel<typeof users>;
// const user: Array<User> = await db.select().from(users).where(eq(users.id, 42));
