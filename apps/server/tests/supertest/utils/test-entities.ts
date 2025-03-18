import { cleanUpSession } from "./session";

import {
  deleteContactByID,
  deleteListingByID,
  deleteUserByID,
  insertNewContact,
  insertNewListing,
  insertNewRelation,
  insertNewUser,
} from "@propel/drizzle";
import { hashPassword } from "@propel/lib";

import type { Header } from "../types";
import type { NewContact, User, NewListing } from "@propel/drizzle";

export const insertTestUser = async () => {
  const password = "supertest";
  const hashedPassword = await hashPassword(password, 8);

  const testUser = await insertNewUser({
    username: `st${Date.now()}`,
    name: "Super Test",
    email: `st${Date.now()}@gmail.com`,
    hashedPassword: hashedPassword,
  });

  return {
    id: testUser.id,
    email: testUser.email,
    password: password,
  };
};

export const removeTestUserAndSession = async (testUser: Partial<User>, authHeaders: Header) => {
  await cleanUpSession(authHeaders);
  await deleteUserByID(testUser.id as number);
};

export const insertTestContactAndUserRelation = async (testUser: Partial<User>, newContact: NewContact) => {
  const contact = await insertNewContact(newContact);

  await insertNewRelation({ currentUserID: testUser.id as number, newContactID: contact.id as number });

  return contact;
};

export const deleteContact = async (contact: NewContact) => {
  await deleteContactByID(contact.id as number);
};

export const insertTestListing = async (newListing: NewListing) => {
  const listing = await insertNewListing(newListing);

  return listing;
};

export const deleteListing = async (listing: NewListing, testUser: Partial<User>) => {
  await deleteListingByID(listing.id as number, testUser.id as number);
};
