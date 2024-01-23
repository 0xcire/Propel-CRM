import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  username: varchar("username", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  hashedPassword: varchar("hashed_password", { length: 256 }).notNull(),
  isAdmin: boolean("is_admin").default(false),
  isVerified: boolean("is_verified").default(false),
  lastLogin: timestamp("last_login", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToContacts: many(usersToContacts),
  tasks: many(tasks),
  listings: many(listings),
  soldListings: many(soldListings),
}));

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  usersToContacts: many(usersToContacts),
  listingsToContacts: many(listingsToContacts),
  tasks: many(tasks),
  soldListings: one(soldListings, {
    fields: [contacts.id],
    references: [soldListings.contactID],
  }),
}));

export const usersToContacts = pgTable(
  "user_to_contacts",
  {
    userID: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contactID: integer("contact_id")
      .notNull()
      .references(() => contacts.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userID, table.contactID] }),
    };
  }
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

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userID: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  listingID: integer("listing_id").references(() => listings.id),
  contactID: integer("contact_id").references(() => contacts.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  notes: varchar("notes", { length: 255 }),
  dueDate: date("due_date", { mode: "string" }),
  priority: text("priority", { enum: ["low", "medium", "high"] }),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userID],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [tasks.listingID],
    references: [listings.id],
  }),
  contacts: one(contacts, {
    fields: [tasks.contactID],
    references: [contacts.id],
  }),
}));

// TODO: propertyType
// single family, apartment, townhome, condo, duplex, etc..
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  userID: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  address: varchar("address", { length: 255 }).notNull(),
  propertyType: varchar("property_type", { length: 255 }).notNull(),
  price: numeric("price", { precision: 11, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  baths: integer("baths").notNull(),
  squareFeet: integer("sq_ft").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const listingsRelations = relations(listings, ({ one, many }) => ({
  user: one(users, {
    fields: [listings.userID],
    references: [users.id],
  }),
  tasks: many(tasks),
  listingsToContacts: many(listingsToContacts),
  soldListings: one(soldListings, {
    fields: [listings.id],
    references: [soldListings.listingID],
  }),
}));

export const listingsToContacts = pgTable(
  "listings_to_contacts",
  {
    listingID: integer("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    contactID: integer("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.listingID, table.contactID] }),
    };
  }
);

export const listingsToContactsRelations = relations(listingsToContacts, ({ one }) => ({
  listing: one(listings, {
    fields: [listingsToContacts.listingID],
    references: [listings.id],
  }),
  contact: one(contacts, {
    fields: [listingsToContacts.contactID],
    references: [contacts.id],
  }),
}));

// pgTable: leadsOnListing??
// for interested contacts on listing

// sold_to
// sale_price
export const soldListings = pgTable("sold_listings", {
  id: serial("id").primaryKey(),
  userID: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  listingID: integer("listing_id").references(() => listings.id, { onDelete: "cascade" }),
  contactID: integer("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
  salePrice: numeric("sale_price", { precision: 11, scale: 2 }).notNull(),
  soldAt: timestamp("sold_at", { withTimezone: true }).defaultNow(),
});

export const soldListingsRelations = relations(soldListings, ({ one }) => ({
  user: one(users, {
    fields: [soldListings.userID],
    references: [users.id],
  }),
}));
