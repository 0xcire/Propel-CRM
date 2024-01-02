import type { Request, Response } from "express";

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

import { objectNotEmpty } from "../utils";

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
    console.log(error);
    res.status(500).json({});
  }
};

export const searchUsersContacts = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { name, page, limit } = req.query;

    if (!name) {
      return res.status(400).json({
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
        limit: limit as Limit,
        page: +page!,
      });
    }

    return res.status(200).json({
      message: "",
      contacts: usersSearchedContacts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
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
    console.log(error);
    res.status(500).json({});
  }
};

export const getSpecificContact = async (req: Request, res: Response) => {
  try {
    const contactByID = req.contact;

    // TODO:
    // on get, message unnecessary
    // getByID should just return that one element, ex.) contact vs contacts
    // mainly just typing issue on client
    return res.status(200).json({
      message: "",
      contacts: [contactByID],
    });
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
      contactID = insertedContact?.id;
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

    await insertNewRelation({ currentUserID: id, newContactID: contactID as number });

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
    const { contactID } = req.params;

    if (!objectNotEmpty(req.body)) {
      return res.status(400).json({
        message: "Nothing to update.",
      });
    }

    const fields = { ...req.body };

    const updatedContact = await updateContactByID({ contactID: +contactID!, inputs: fields });

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
    const { contactID } = req.params;

    const relations = await getContactRelations(+contactID!);

    if (relations.length === 1) {
      await deleteUserContactRelation({ userID: userID, contactID: +contactID! });

      await deleteContactByID(+contactID!);
    } else {
      await deleteUserContactRelation({ userID: userID, contactID: +contactID! });
    }

    return res.status(200).json({
      message: `Successfully removed ${req.contact.name} from your network.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};
