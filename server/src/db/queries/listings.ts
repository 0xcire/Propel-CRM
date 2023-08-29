import { and, desc, eq } from "drizzle-orm";
import { db } from "..";
import { listings } from "../schema";
import type { NewListing } from "../types";

type updateListingByIDParams = {
  listing: Partial<NewListing>;
  listingID: number;
  userID: number;
};

export const findAllListings = async (userID: number) => {
  const userListings = await db.query.listings.findMany({
    where: eq(listings.userID, userID),
    orderBy: [desc(listings.createdAt)],
  });
  return userListings;
};

export const insertNewListing = async (listing: NewListing) => {
  const newListing = await db.insert(listings).values(listing).returning({
    id: listings.id,
    description: listings.description,
    address: listings.address,
    propertyType: listings.propertyType,
    price: listings.price,
    bedrooms: listings.bedrooms,
    baths: listings.baths,
    squareFeet: listings.squareFeet,
  });

  return newListing[0];
};

export const updateListingByID = async ({ listing, listingID, userID }: updateListingByIDParams) => {
  const updatedListing = await db
    .update(listings)
    .set({
      ...(listing.address
        ? {
            address: listing.address,
          }
        : {}),
      ...(listing.baths
        ? {
            baths: listing.baths,
          }
        : {}),
      ...(listing.bedrooms
        ? {
            bedrooms: listing.bedrooms,
          }
        : {}),
      ...(listing.description
        ? {
            description: listing.description,
          }
        : {}),
      ...(listing.price
        ? {
            price: listing.price,
          }
        : {}),
      ...(listing.propertyType
        ? {
            propertyType: listing.propertyType,
          }
        : {}),
      ...(listing.squareFeet
        ? {
            squareFeet: listing.squareFeet,
          }
        : {}),
    })
    .where(and(eq(listings.id, listingID), eq(listings.userID, userID)))
    .returning({
      id: listings.id,
      address: listings.address,
      baths: listings.baths,
      bedrooms: listings.bedrooms,
      description: listings.description,
      price: listings.price,
      propertyType: listings.propertyType,
      squareFeet: listings.squareFeet,
    });

  return updatedListing[0];
};

export const deleteListingByID = async (listingID: number, userID: number) => {
  const deletedListing = await db.delete(listings).where(eq(listings.id, listingID)).returning({
    id: listings.id,
  });

  return deletedListing[0];
};
