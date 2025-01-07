import { and, asc, between, eq, isNotNull, sql } from "drizzle-orm";
import { listings, listingsToContacts, soldListings } from "../schema";
import { db } from "..";

const LISTING_SALE_MONTH = sql<string>`TO_CHAR(${soldListings.soldAt} AT TIME ZONE 'UTC', 'Mon')`;
const LISTING_SALE_MONTH_AS_NUMBER = sql`EXTRACT(MONTH FROM ${soldListings.soldAt})`;

export const getSalesVolumeByYearQuery = async (userID: number, year: number) => {
  const usersSalesVolume = await db
    .select({
      month: LISTING_SALE_MONTH,
      volume: sql<string>`sum(${soldListings.salePrice})`,
    })
    .from(listings)
    .leftJoin(soldListings, eq(soldListings.listingID, listings.id))
    .where(
      and(
        eq(listings.userID, userID),
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`))
      )
    )
    .groupBy(LISTING_SALE_MONTH, LISTING_SALE_MONTH_AS_NUMBER)
    .orderBy(LISTING_SALE_MONTH_AS_NUMBER)

  return usersSalesVolume;
};

export const getListToSaleRatioByYearQuery = async (userID: number, year: number) => {
  const usersSaleToListRatio = await db
    .select({
      month: LISTING_SALE_MONTH,
      ratio: sql<string>`AVG(CAST(${soldListings.salePrice} AS numeric(11,2)) / CAST(${listings.price} AS numeric(11,2)))`,
    })
    .from(listings)
    .leftJoin(soldListings, eq(soldListings.listingID, listings.id))
    .where(
      and(
        eq(listings.userID, userID),
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`))
      )
    )
    .groupBy(LISTING_SALE_MONTH, LISTING_SALE_MONTH_AS_NUMBER)
    .orderBy(LISTING_SALE_MONTH_AS_NUMBER);

  return usersSaleToListRatio;
};

export const getAvgDaysOnMarketQuery = async (userID: number, year: number) => {
  const average = await db
    .select({
      month: LISTING_SALE_MONTH,
      average: sql<string>`AVG(EXTRACT(DAYS FROM ${soldListings.soldAt} - ${listings.createdAt}))`,
    })
    .from(listings)
    .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
    .where(
      and(
        eq(listings.userID, userID),
        eq(listings.id, soldListings.listingID),
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`))
      )
    )
    .groupBy(LISTING_SALE_MONTH, LISTING_SALE_MONTH_AS_NUMBER)
    .orderBy(LISTING_SALE_MONTH_AS_NUMBER);

  return average;
};

export const getAvgTimeToCloseQuery = async (userID: number, year: number) => {
  const timeToClose = await db
    .select({
      month: LISTING_SALE_MONTH,
      days: sql<string>`AVG(EXTRACT(DAYS FROM ${soldListings.soldAt} - ${listingsToContacts.createdAt}))`,
    })
    .from(listings)
    .leftJoin(soldListings, eq(soldListings.listingID, listings.id))
    .leftJoin(listingsToContacts, eq(listingsToContacts.contactID, soldListings.contactID))
    .where(
      and(
        eq(listings.userID, userID),
        eq(listingsToContacts.listingID, soldListings.listingID),
        isNotNull(soldListings.listingID),
        between(soldListings.soldAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`)),
        between(listingsToContacts.createdAt, new Date(`1-1-${year}`), new Date(`12-31-${year}`))
      )
    )
    .groupBy(LISTING_SALE_MONTH, LISTING_SALE_MONTH_AS_NUMBER)
    .orderBy(LISTING_SALE_MONTH_AS_NUMBER);

  return timeToClose;
};

export const getExistingYearsQuery = async (userID: number) => {
  const year = sql<string>`EXTRACT(YEAR FROM ${soldListings.soldAt})`;
  const years = await db
    .selectDistinct({ year: year })
    .from(soldListings)
    .where(eq(soldListings.userID, userID))
    .orderBy(asc(year))

  return years;
};
