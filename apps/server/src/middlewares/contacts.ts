import { findContactByID, findRelation } from "../db/queries/contacts";

import type { Request, Response, NextFunction } from "express";
import { Contact } from "../db/types";

export const isContactOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user.id;
  const { contactID } = req.params;
  const method = req.method;

  const contactByID = await findContactByID(+contactID, userID);

  const contactToUserRelation = await findRelation({ currentUserID: userID, existingContactID: +contactID });

  if (!contactID) {
    return res.status(400).json({
      message: "Please provide a contact ID",
    });
  }

  // TODO: should just make one query that joins on usersToContacts, and checks, instead of making these two queries
  if (!contactByID) {
    return res.status(404).json({
      message: `Contact by id: ${contactID} does not exist`,
    });
  }

  if (!contactToUserRelation) {
    return res.status(403).json({
      message: "Cannot perform operations on this contact.",
    });
  }

  // need name to return helpful message for POST / PATCH, DELETE
  if (contactByID.name && method !== "GET") {
    req.contact = {
      name: contactByID.name,
    };
  }

  // only applies to get('/contacts/:id')
  if (method === "GET") {
    req.contact = contactByID as Contact;
  }

  return next();
};
