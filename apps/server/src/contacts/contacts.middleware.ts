import { findContactByID, findRelation } from "@propel/drizzle";
import { handleError } from "../common/utils";
import { PropelHTTPError } from "../lib/http-error";

import type { Request, Response, NextFunction } from "express";
import type { Contact } from "@propel/drizzle";

export const isContactOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.user.id;
    const { contactID } = req.params;
    const method = req.method;

    if (!contactID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Contact ID is required.",
      });
    }

    const contactByID = await findContactByID(+contactID, userID);
    const contactToUserRelation = await findRelation({ currentUserID: userID, existingContactID: +contactID });

    if (!contactByID) {
      throw new PropelHTTPError({
        code: "NOT_FOUND",
        message: `Contact by id: ${contactID} does not exist`,
      });
    }

    if (!contactToUserRelation) {
      throw new PropelHTTPError({
        code: "FORBIDDEN",
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
  } catch (error) {
    return handleError(error, res);
  }
};
