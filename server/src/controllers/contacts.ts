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
import { checkPassword } from "../utils";

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

// TODO: check for changed fields happpens client side.
// form can't be submitted unless fields change so not checking here for now
// imagine will need to write checks here when writing unit tests, however...
export const updateContact = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { id } = req.params;
    const { verifyPassword, name, email, phoneNumber, address } = req.body;

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

    if (!verifyPassword) {
      return res.status(401).json({
        message: "Verify password to confirm changes.",
      });
    }

    const userByID = await findUsersByID({ id: +userID, updating: true });

    const passwordVerified = await checkPassword(verifyPassword, userByID?.hashedPassword as string);

    if (!passwordVerified) {
      return res.status(409).json({
        message: "Enter your password correctly to confirm changes.",
      });
    }

    const contact = await findContactByID(+id);

    if (!contact) {
      return res.status(404).json({
        message: "Could not find contact",
      });
    }

    const updatedContact = await updateContactByID({ contactID: +id, inputs: fields, contact: contact });

    return res.status(200).json({
      message: "Updated successfully.",
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

    const contact = await findContactByID(+id);

    const relations = await getContactRelations(+id);

    if (relations.length === 1) {
      const deletedRelation = await deleteUserContactRelation({ userID: userID, contactID: +id });

      deletedContact = await deleteContactByID(+id);
    } else {
      const deletedRelation = await deleteUserContactRelation({ userID: userID, contactID: +id });
    }

    return res.status(200).json({
      message: `Successfully removed ${contact?.name} from your network.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};
