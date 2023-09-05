import { and, between, eq, isNotNull, sql } from "drizzle-orm";
import { listings, soldListings } from "../schema";
import { db } from "..";

export const getSalesDataByYear = async (userID: number) => {
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

  return usersSalesVolume;
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
