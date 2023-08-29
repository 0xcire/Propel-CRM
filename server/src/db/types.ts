import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, contacts, usersToContacts, tasks, listings, listingsToContacts } from "./schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Contact = InferSelectModel<typeof contacts>;
export type NewContact = InferInsertModel<typeof contacts>;

export type UserContactRelation = InferSelectModel<typeof usersToContacts>;
export type NewUserContactRelation = InferInsertModel<typeof usersToContacts>;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export type Listing = InferSelectModel<typeof listings>;
export type NewListing = InferInsertModel<typeof listings>;

export type ListingContactRelation = InferSelectModel<typeof listingsToContacts>;
export type NewListingContactRelation = InferInsertModel<typeof listingsToContacts>;
