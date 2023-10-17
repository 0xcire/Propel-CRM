import { db } from "../db";
import { listings } from "../db/schema";
import { and, eq } from "drizzle-orm";

import type { Listing } from "../db/types";
import type { Request, Response, NextFunction } from "express";

export const isListingOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user.id;
  const { id } = req.params;
  const method = req.method;

  const listingByID: Array<Listing> = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, +id), eq(listings.userID, userID)));

  if (!listingByID[0]) {
    return res.status(404).json({
      message: `Listing by id: ${id} does not exist`,
    });
  }

  if (listingByID[0].userID !== userID) {
    return res.status(403).json({
      message: "Cannot operate on this listing.",
    });
  }

  if (method === "GET") {
    req.listing = listingByID[0];
  }

  // TODO: need to address certain relations in future

  return next();
};
