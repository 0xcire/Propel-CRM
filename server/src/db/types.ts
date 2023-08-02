import { InferModel } from "drizzle-orm";
import { users, contacts, usersToContacts } from "./schema";

export type User = InferModel<typeof users, "select">;
export type NewUser = InferModel<typeof users, "insert">;

export type Contact = InferModel<typeof contacts, "select">;
export type NewContact = InferModel<typeof contacts, "insert">;

export type UserContactRelation = InferModel<typeof usersToContacts, "select">;
export type NewUserContactRelation = InferModel<typeof usersToContacts, "insert">;
