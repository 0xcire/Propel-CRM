// users
// listings
// contacts
// tasks
// analytics

import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, primaryKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  username: varchar("username", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  hashedPassword: varchar("hashed_password", { length: 256 }).notNull(),
  sessionToken: varchar("session_token", { length: 256 }).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToContacts: many(usersToContacts),
}));

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phonenumber: varchar("phone_number", { length: 20 }).notNull(),
  address: varchar("address", { length: 20 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const contactsRelations = relations(contacts, ({ many }) => ({
  usersToContacts: many(usersToContacts),
}));

export const usersToContacts = pgTable(
  "user_to_contacts",
  {
    userID: integer("user_id")
      .notNull()
      .references(() => users.id),
    contactID: integer("contact_id")
      .notNull()
      .references(() => contacts.id),
  },
  (t) => ({
    pk: primaryKey(t.userID, t.contactID),
  })
);

export const usersToContactsRelations = relations(usersToContacts, ({ one }) => ({
  contact: one(contacts, {
    fields: [usersToContacts.contactID],
    references: [contacts.id],
  }),
  user: one(users, {
    fields: [usersToContacts.userID],
    references: [users.id],
  }),
}));
