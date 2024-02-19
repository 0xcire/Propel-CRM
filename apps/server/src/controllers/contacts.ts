import {
  deleteContactByID,
  deleteUserContactRelation,
  findContactByDetails,
  findRelation,
  getContactRelations,
  getUserDashboardContacts,
  getUsersContacts,
  insertNewContact,
  insertNewRelation,
  searchForContacts,
  updateContactByID,
} from "@propel/drizzle";

import { PropelHTTPError } from "../lib/http-error";

import { objectNotEmpty, handleError } from "../utils";

import type { Request, Response } from "express";
import type { NewContact } from "@propel/drizzle";
import type { Limit } from "@propel/types";

export const getDashboardContacts = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;

    const userDashboardContacts = await getUserDashboardContacts(id);

    return res.status(200).json({
      message: "",
      contacts: userDashboardContacts,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const searchUsersContacts = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { name, page, limit } = req.query;

    if (!name) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Please enter a name to search.",
      });
    }

    let usersSearchedContacts;

    // react query query does not run if name is ''
    if (name && name === "") {
      usersSearchedContacts = [];
    }

    if (name) {
      usersSearchedContacts = await searchForContacts({
        userID: userID,
        name: name as string,
        limit: limit ? (limit as Limit) : "10",
        // page: page ? +page : 1,
        page: +(page ?? "1"),
      });
    }

    return res.status(200).json({
      message: "",
      contacts: usersSearchedContacts,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getMyContacts = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { page, limit } = req.query;

    const userContacts = await getUsersContacts(userID, +(page ?? "1"), limit as Limit);

    return res.status(200).json({
      message: "",
      contacts: userContacts,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getSpecificContact = async (req: Request, res: Response) => {
  try {
    const contactByID = req.contact;

    // [ ]: on get, message unnecessary
    return res.status(200).json({
      message: "",
      contacts: [contactByID],
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { name, email, phoneNumber, address } = req.body;

    if (!name || !email || !phoneNumber || !address) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "All fields required.",
      });
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
      contactID = insertedContact?.id;
    }

    if (existingContact) {
      contactID = existingContact.id;
      const establishedRelation = await findRelation({ currentUserID: id, existingContactID: contactID });
      if (establishedRelation) {
        throw new PropelHTTPError({
          code: "CONFLICT",
          message: "Contact already exists in your network.",
        });
      }
    }

    await insertNewRelation({ currentUserID: id, newContactID: contactID as number });

    return res.status(201).json({
      message: `Added ${insertedContact ? insertedContact.name : existingContact?.name} to your network.`,
      contact: contact,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const { contactID } = req.params;

    if (!objectNotEmpty(req.body)) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Nothing to update.",
      });
    }

    if (!contactID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Contact ID required.",
      });
    }

    const fields = { ...req.body };

    const updatedContact = await updateContactByID({ contactID: +contactID, inputs: fields });

    return res.status(200).json({
      message: `Updated ${req.contact.name} successfully.`,
      contact: updatedContact,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { contactID } = req.params;

    if (!contactID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Contact ID required.",
      });
    }

    const relations = await getContactRelations(+contactID);

    if (relations.length === 1) {
      await deleteUserContactRelation({ userID: userID, contactID: +contactID });

      await deleteContactByID(+contactID);
    } else {
      await deleteUserContactRelation({ userID: userID, contactID: +contactID });
    }

    return res.status(200).json({
      message: `Successfully removed ${req.contact.name} from your network.`,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
