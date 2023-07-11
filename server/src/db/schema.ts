// users
// listings
// contacts
// tasks
// analytics

import { InferModel, eq, isNotNull } from "drizzle-orm";
import { boolean, jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  username: varchar("username", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  hashedPassword: varchar("hashed_password", { length: 256 }).notNull(),
  sessionToken: varchar("session_token", { length: 256 }).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
export type User = InferModel<typeof users, "select">;
export type NewUser = InferModel<typeof users, "insert">;
