import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { listings } from "../db/schema";
import { eq } from "drizzle-orm";
import { Listing } from "../db/types";

export const isListingOwner = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user.id;
  const { id } = req.params;

  const listingByID: Array<Listing> = await db.select().from(listings).where(eq(listings.id, +id));

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

  // TODO: need to address certain relations in future

  return next();
};
