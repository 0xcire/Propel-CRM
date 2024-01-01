import { getListingByID } from "@propel/drizzle";

import type { Request, Response, NextFunction } from "express";

export const isListingOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user.id;
  const { listingID } = req.params;
  const method = req.method;

  const listingByID = await getListingByID({
    listingID: +listingID!,
    userID: userID,
  });

  if (!listingByID) {
    return res.status(404).json({
      message: `Listing by id: ${listingID} does not exist`,
    });
  }

  if (listingByID.userID !== userID) {
    return res.status(403).json({
      message: "Cannot operate on this listing.",
    });
  }

  if (method === "GET") {
    req.listing = listingByID;
  }

  // TODO: need to address certain relations in future

  return next();
};
