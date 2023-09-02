import type { Request, Response } from "express";
import { db } from "../db";
import { listings, soldListings } from "../db/schema";
import { and, asc, between, eq, gt, isNotNull, sql } from "drizzle-orm";

// format:
// [
//   {
//     month: 'month-name',
//     volume: 34525
//   },
//   {
//     month: 'month-name',
//     volume: 34525
//   },
//   ...
// ]

export const getPeriodicSalesVolume = async (req: Request, res: Response) => {
  const userID = req.user.id;
  // const {range} = req.query
  // range = 1-1-2023

  // TODO: need to update schema to allow user ( agent ) to update sale price
  // also attach contact id to soldListings table to include additional info

  const month = sql`DATE_TRUNC('month', ${soldListings.soldAt})`;

  const usersListingsSalesVolume = await db
    .select({
      month: month,
      monthVolume: sql<number>`sum(${listings.price})`,
    })
    .from(listings)
    .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
    .where(
      and(
        eq(listings.userID, userID),
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date("1-1-2023"), new Date("12-31-2023"))
      )
    )
    .groupBy(month)
    .orderBy(month);

  return res.status(200).json({
    message: "",
    analytics: usersListingsSalesVolume,
  });
};

// GCI - Gross Commission Income
export const getGCIData = async () => {
  return 0;
};
