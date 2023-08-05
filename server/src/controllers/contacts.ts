import type { Request, Response } from "express";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { contacts, users, usersToContacts } from "../db/schema";
import type { Contact, NewContact, NewUserContactRelation, UserContactRelation } from "../db/types";
import { findUsersByID } from "../db/user-queries";
import { checkPassword } from "../utils";

export const getMyContacts = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;

    const myContacts = await db
      .select()
      .from(usersToContacts)
      .leftJoin(contacts, eq(usersToContacts.contactID, contacts.id))
      .leftJoin(users, eq(usersToContacts.userID, users.id))
      .where(eq(users.id, id))
      .orderBy(sql`${usersToContacts.createdAt} asc`);

    return res.status(200).json({
      message: "",
      contacts: myContacts.map((result) => result.contacts),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

// export const getOneContact = async (req: Request, res: Response) => {
//   try {
//     return 0;
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({});
//   }
// };

export const createContact = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { name, email, phoneNumber, address } = req.body;

    if (!name || !email || !phoneNumber || !address) {
      return res.status(400).json({});
    }

    const contact: NewContact = {
      name: name,
      phoneNumber: phoneNumber,
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
          eq(contacts.phoneNumber, phoneNumber),
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
      message: `Added ${insertedContact ? insertedContact[0].name : existingContact[0].name} to your network.`,
      contact: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

// TODO: check for changed fields happpens client side.
// form can't be submitted unless fields change so not checking here for now
// imagine will need to write checks here when writing unit tests, however...
export const updateContact = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;
    const { verifyPassword, name, email, phone, address } = req.body;

    if (!name && !email && !phone && !address) {
      return res.status(400).json({
        message: "Nothing to update.",
      });
    }

    if (!verifyPassword) {
      return res.status(401).json({
        message: "Verify password to confirm changes.",
      });
    }

    const userByID = await findUsersByID({ id: Number(userID), updating: true });

    const passwordVerified = await checkPassword(verifyPassword, userByID?.hashedPassword as string);

    if (!passwordVerified) {
      return res.status(409).json({
        message: "Enter your password correctly to confirm changes.",
      });
    }

    const contact: Array<Contact> = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, Number(id)));

    if (!contact[0]) {
      return res.status(404).json({
        message: "Could not find contact",
      });
    }

    const updatedContact = await db
      .update(contacts)
      .set({
        ...(name !== contact[0].name && name !== undefined
          ? {
              name: name,
            }
          : {}),
        ...(email !== contact[0].email && email !== undefined
          ? {
              email: email,
            }
          : {}),
        ...(phone !== contact[0].phoneNumber && phone !== undefined
          ? {
              phoneNumber: phone,
            }
          : {}),
        ...(address !== contact[0].address && address !== undefined
          ? {
              address: address,
            }
          : {}),
      })
      .where(eq(contacts.id, Number(id)))
      .returning({
        name: contacts.name,
        email: contacts.email,
        phone: contacts.phoneNumber,
        address: contacts.address,
      });

    return res.status(200).json({
      message: "Updated successfully.",
      contact: updatedContact[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;
    let deletedContact;

    const contact = await db
      .select({ name: contacts.name })
      .from(contacts)
      .where(eq(contacts.id, Number(id)));

    const relations = await db
      .select()
      .from(usersToContacts)
      .where(eq(usersToContacts.contactID, Number(id)));
    console.log(relations);

    if (relations.length === 1) {
      const deletedRelation = await db
        .delete(usersToContacts)
        .where(and(eq(usersToContacts.userID, userID), eq(usersToContacts.contactID, Number(id))));

      deletedContact = await db
        .delete(contacts)
        .where(eq(contacts.id, Number(id)))
        .returning({
          name: contacts.name,
        });
    } else {
      const deletedRelation = await db
        .delete(usersToContacts)
        .where(and(eq(usersToContacts.userID, userID), eq(usersToContacts.contactID, Number(id))));
    }

    return res.status(200).json({
      message: `Successfully removed ${contact[0].name} from your network.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};
