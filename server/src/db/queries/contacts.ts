import { and, eq, sql } from "drizzle-orm";
import { db } from "../";
import { contacts, users, usersToContacts } from "../schema";
import type { Contact, NewContact, NewUserContactRelation, UserContactRelation } from "../types";

type UpdateContactByIDParams = {
  contactID: number;
  inputs: Partial<NewContact>;
  contact: Contact;
};

type FindContactByDetailsParams = NewContact;

type FindRelationParams = {
  currentUserID: number;
  existingContactID: number;
};

type InsertRelationParams = {
  currentUserID: number;
  newContactID: number;
};

type DeleteUserContactRelationParams = {
  userID: number;
  contactID: number;
};

export const getUsersContacts = async (id: number) => {
  const userContactJoin = await db
    .select()
    .from(usersToContacts)
    .leftJoin(contacts, eq(usersToContacts.contactID, contacts.id))
    .leftJoin(users, eq(usersToContacts.userID, users.id))
    .where(eq(users.id, id))
    .orderBy(sql`${usersToContacts.createdAt} asc`);

  const userContacts = userContactJoin.map((result) => result.contacts);
  return userContacts;
};

export const findContactByID = async (id: number) => {
  const contact: Array<Contact> = await db.select().from(contacts).where(eq(contacts.id, +id));

  if (!contact[0]) {
    return undefined;
  }

  return contact[0];
};

export const updateContactByID = async ({ contactID, inputs, contact }: UpdateContactByIDParams) => {
  const updatedContact = await db
    .update(contacts)
    .set({
      ...(inputs.name !== contact.name && inputs.name !== undefined
        ? {
            name: inputs.name,
          }
        : {}),
      ...(inputs.email !== contact.email && inputs.email !== undefined
        ? {
            email: inputs.email,
          }
        : {}),
      ...(inputs.phoneNumber !== contact.phoneNumber && inputs.phoneNumber !== undefined
        ? {
            phoneNumber: inputs.phoneNumber,
          }
        : {}),
      ...(inputs.address !== contact.address && inputs.address !== undefined
        ? {
            address: inputs.address,
          }
        : {}),
    })
    .where(eq(contacts.id, contactID))
    .returning({
      name: contacts.name,
      email: contacts.email,
      phoneNumber: contacts.phoneNumber,
      address: contacts.address,
    });

  return updatedContact[0];
};

export const findContactByDetails = async ({ name, email, phoneNumber, address }: FindContactByDetailsParams) => {
  const existingContact: Array<Contact> = await db
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.name, name),
        eq(contacts.phoneNumber, phoneNumber),
        eq(contacts.email, email),
        eq(contacts.address, address)
      )
    );

  if (!existingContact[0]) {
    return undefined;
  }

  return existingContact[0];
};

export const insertNewContact = async (contact: NewContact) => {
  const insertedContact = await db.insert(contacts).values(contact).returning({
    id: contacts.id,
    name: contacts.name,
    phoneNumber: contacts.phoneNumber,
    email: contacts.email,
    address: contacts.address,
  });

  return insertedContact[0];
};

export const getContactRelations = async (id: number) => {
  const relations = await db.select().from(usersToContacts).where(eq(usersToContacts.contactID, id));
  return relations;
};

export const findRelation = async ({ currentUserID, existingContactID }: FindRelationParams) => {
  const establishedRelation: Array<UserContactRelation> = await db
    .select()
    .from(usersToContacts)
    .where(and(eq(usersToContacts.userID, currentUserID), eq(usersToContacts.contactID, existingContactID)));

  if (!establishedRelation[0]) {
    return undefined;
  }

  return establishedRelation[0];
};

export const insertNewRelation = async ({ currentUserID, newContactID }: InsertRelationParams) => {
  const newRelation: Array<NewUserContactRelation> = await db.insert(usersToContacts).values({
    userID: currentUserID,
    contactID: newContactID,
  });

  return newRelation[0];
};

export const deleteUserContactRelation = async ({ userID, contactID }: DeleteUserContactRelationParams) => {
  const deletedRelation = await db
    .delete(usersToContacts)
    .where(and(eq(usersToContacts.userID, userID), eq(usersToContacts.contactID, contactID)));

  return deletedRelation[0];
};

export const deleteContactByID = async (id: number) => {
  const deletedContact = await db.delete(contacts).where(eq(contacts.id, id)).returning({
    name: contacts.name,
  });

  return deletedContact[0];
};
