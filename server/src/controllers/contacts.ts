import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { contacts, usersToContacts } from "../db/schema";
import type { Contact, NewContact, NewUserContactRelation, UserContactRelation } from "../db/types";

export const getMyContacts = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const getOneContact = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({});
    }

    const contact: NewContact = {
      name: name,
      phoneNumber: phone,
      email: email,
      address: address,
    };

    let insertedContact: Array<NewContact> | undefined = undefined;
    let contactID;

    const existingContact: Array<Contact> = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.name, name),
          eq(contacts.phoneNumber, phone),
          eq(contacts.email, email),
          eq(contacts.address, address)
        )
      );

    if (!existingContact[0]) {
      insertedContact = await db.insert(contacts).values(contact).returning({
        id: contacts.id,
        name: contacts.name,
        phoneNumber: contacts.phoneNumber,
        email: contacts.email,
        address: contacts.address,
      });
      contactID = insertedContact[0].id;
    }

    if (existingContact[0]) {
      contactID = existingContact[0].id;
      const establishedRelation: Array<UserContactRelation> = await db
        .select()
        .from(usersToContacts)
        .where(and(eq(usersToContacts.userID, id), eq(usersToContacts.contactID, existingContact[0].id)));
      if (establishedRelation[0]) {
        return res.status(409).json({
          message: "Contact already exists in your network.",
        });
      }
    }

    const newRelation: Array<NewUserContactRelation> = await db.insert(usersToContacts).values({
      userID: id,
      contactID: contactID as number,
    });

    return res.status(201).json({
      contact: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

// if amount of relations is 1 delete actual contact
// otherwise just delete relation
export const deleteContact = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};
