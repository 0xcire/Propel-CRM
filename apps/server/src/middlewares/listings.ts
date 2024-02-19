import { getListingByID } from "@propel/drizzle";

import { PropelHTTPError } from "../lib/http-error";
import { handleError } from "../utils/handle-error";

import type { Request, Response, NextFunction } from "express";

export const isListingOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.user.id;
    const { listingID } = req.params;
    const method = req.method;

    if (!listingID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Listing ID required.",
      });
    }

    const listingByID = await getListingByID({
      listingID: +listingID,
      userID: userID,
    });

    if (!listingByID) {
      throw new PropelHTTPError({
        code: "NOT_FOUND",
        message: `Listing by id: ${listingID} does not exist`,
      });
    }

    if (listingByID.userID !== userID) {
      throw new PropelHTTPError({
        code: "FORBIDDEN",
        message: "Cannot operate on this listing.",
      });
    }

    if (method === "GET") {
      req.listing = listingByID;
    }

    return next();
  } catch (error) {
    return handleError(error, res);
  }
};
