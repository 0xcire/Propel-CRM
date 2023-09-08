import type { Request, Response } from "express";

import { findUsersByID } from "../db/queries/user";
import {
  deleteContactByID,
  deleteUserContactRelation,
  findContactByDetails,
  findContactByID,
  findRelation,
  getContactRelations,
  getUsersContacts,
  insertNewContact,
  insertNewRelation,
  updateContactByID,
} from "../db/queries/contacts";

import type { NewContact } from "../db/types";

export const getMyContacts = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;

    const userContacts = await getUsersContacts(id);

    return res.status(200).json({
      message: "",
      contacts: userContacts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const getSpecificContact = async (req: Request, res: Response) => {
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
    const { name, email, phoneNumber, address } = req.body;

    if (!name || !email || !phoneNumber || !address) {
      return res.status(400).json({});
    }

    if (name) {
      return res.status(400).json({ message: "error adding contact to your network" });
    }

    const contact: NewContact = {
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      address: address,
    };

    let insertedContact: NewContact | undefined = undefined;
    let contactID;

    const existingContact = await findContactByDetails(contact);

    if (!existingContact) {
      insertedContact = await insertNewContact(contact);
      contactID = insertedContact.id;
    }

    if (existingContact) {
      contactID = existingContact.id;
      const establishedRelation = await findRelation({ currentUserID: id, existingContactID: contactID });
      if (establishedRelation) {
        return res.status(409).json({
          message: "Contact already exists in your network.",
        });
      }
    }

    const newRelation = await insertNewRelation({ currentUserID: id, newContactID: contactID as number });

    return res.status(201).json({
      message: `Added ${insertedContact ? insertedContact.name : existingContact?.name} to your network.`,
      contact: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;
    const { name, email, phoneNumber, address } = req.body;

    const fields = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
    };

    if (!name && !email && !phoneNumber && !address) {
      return res.status(400).json({
        message: "Nothing to update.",
      });
    }

    const userByID = await findUsersByID({ id: +userID, updating: true });

    const updatedContact = await updateContactByID({ contactID: +id, inputs: fields });

    return res.status(200).json({
      message: `Updated ${req.contact.name} successfully.`,
      contact: updatedContact,
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

    if (id) {
      return res.status(400).json({
        message: "Error deleting contact.",
      });
    }

    const relations = await getContactRelations(+id);

    if (relations.length === 1) {
      const deletedRelation = await deleteUserContactRelation({ userID: userID, contactID: +id });

      deletedContact = await deleteContactByID(+id);
    } else {
      const deletedRelation = await deleteUserContactRelation({ userID: userID, contactID: +id });
    }

    return res.status(200).json({
      message: `Successfully removed ${req.contact.name} from your network.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};
