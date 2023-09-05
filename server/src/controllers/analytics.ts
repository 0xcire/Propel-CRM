import type { Request, Response } from "express";
import { db } from "../db";
import { listings, soldListings } from "../db/schema";
import { and, between, eq, isNotNull, sql } from "drizzle-orm";

export const getPeriodicSalesVolume = async (req: Request, res: Response) => {
  const userID = req.user.id;
  // const {range} = req.query
  // range = 1-1-2023
  console.log("GET PERIODIC SALES VOLUME", req.query);

  // TODO: need to update schema to allow user ( agent ) to update sale price
  // also attach contact id to soldListings table to include additional info

  const month = sql`TO_CHAR(${soldListings.soldAt} AT TIME ZONE 'UTC', 'Mon')`;
  const monthNumberFromName = sql`EXTRACT(MONTH FROM ${soldListings.soldAt})`;

  const usersSalesVolume = await db
    .select({
      month: month,
      volume: sql<number>`sum(${listings.price})`,
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
    .groupBy(month, monthNumberFromName)
    .orderBy(monthNumberFromName);

  return res.status(200).json({
    message: "",
    analytics: usersSalesVolume,
  });
};

export const getExistingSalesYears = async (req: Request, res: Response) => {
  const years = (
    await db.selectDistinct({ year: sql`EXTRACT(YEAR FROM ${soldListings.soldAt})` }).from(soldListings)
  ).map((data) => data.year);

  return res.status(200).json({
    message: "",
    years: years,
  });
};

// GCI - Gross Commission Income
export const getGCIData = async () => {
  return 0;
};
