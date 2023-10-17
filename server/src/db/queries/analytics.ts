import { and, between, eq, isNotNull, sql } from "drizzle-orm";
import { listings, listingsToContacts, soldListings } from "../schema";
import { db } from "..";

const month = sql`TO_CHAR(${soldListings.soldAt} AT TIME ZONE 'UTC', 'Mon')`;
const monthNumberFromName = sql`EXTRACT(MONTH FROM ${soldListings.soldAt})`;

export const getSalesDataByYear = async (userID: number, year: number) => {
  const usersSalesVolume = await db
    .select({
      month: month,
      volume: sql<number>`sum(${soldListings.salePrice})`,
    })
    .from(listings)
    .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
    .where(
      and(
        eq(listings.userID, userID),
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`))
      )
    )
    .groupBy(month, monthNumberFromName)
    .orderBy(monthNumberFromName);

  return usersSalesVolume;
};

export const getListToSaleRatioByYear = async (userID: number, year: number) => {
  const usersSaleToListRatio = await db
    .select({
      month: month,
      ratio: sql`AVG(CAST(${soldListings.salePrice} AS numeric(11,2)) / CAST(${listings.price} AS numeric(11,2)))`,
    })
    .from(listings)
    .where(eq(listings.userID, userID))
    .leftJoin(soldListings, eq(soldListings.listingID, listings.id))
    .where(
      and(
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`))
      )
    )
    .groupBy(month, monthNumberFromName)
    .orderBy(monthNumberFromName);

  return usersSaleToListRatio;
};

export const getAvgDays = async (userID: number, year: number) => {
  const average = await db
    .select({
      month: month,
      average: sql`AVG(${soldListings.soldAt} - ${listings.createdAt})`,
    })
    .from(listings)
    .where(eq(listings.userID, userID))
    .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
    .where(
      and(
        eq(listings.id, soldListings.listingID),
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`))
      )
    )
    .groupBy(month, monthNumberFromName)
    .orderBy(monthNumberFromName);

  return average;
};

// address. does not seem accurate
export const getAvgTimeToClose = async (userID: number, year: number) => {
  const timeToClose = await db
    .select({
      month: month,
      days: sql`AVG(${soldListings.soldAt} - ${listingsToContacts.createdAt})`,
    })
    .from(listings)
    .where(eq(listings.userID, userID))
    .leftJoin(soldListings, eq(soldListings.listingID, listings.id))
    .where(
      and(
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`))
      )
    )
    .leftJoin(listingsToContacts, eq(listingsToContacts.contactID, soldListings.contactID))
    .groupBy(month, monthNumberFromName)
    .orderBy(monthNumberFromName);

  return timeToClose;
};

export const getExistingYears = async (userID: number) => {
  const years = (
    await db
      .selectDistinct({ year: sql`EXTRACT(YEAR FROM ${soldListings.soldAt})` })
      .from(soldListings)
      .where(eq(soldListings.userID, userID))
  ).map((data) => data.year);

  return years;
};
