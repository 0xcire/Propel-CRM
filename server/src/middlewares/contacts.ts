import type { Request, Response, NextFunction } from "express";
import { findContactByID, findRelation } from "../db/queries/contacts";

export const isContactOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user.id;
  const { id } = req.params;

  const method = req.method;

  const contactByID = await findContactByID(+id);

  const contactToUserRelation = await findRelation({ currentUserID: userID, existingContactID: +id });

  if (!contactByID) {
    return res.status(404).json({
      message: `Contact by id: ${id} does not exist`,
    });
  }

  if (!contactToUserRelation) {
    return res.status(403).json({
      message: "Cannot perform operations on this contact.",
    });
  }

  // need name to return helpful message for POST, DELETE
  if (contactByID.name && (req.method === "POST" || req.method === "DELETE")) {
    req.contact = {
      name: contactByID.name,
    };
  }

  // only applies to get('/contacts/:id')
  if (method === "GET") {
    req.contact = contactByID;
  }

  return next();
};
