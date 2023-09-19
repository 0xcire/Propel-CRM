import { and, desc, eq, isNotNull, isNull, not, sql } from "drizzle-orm";
import { db } from "..";
import { contacts, listings, listingsToContacts, soldListings } from "../schema";
import type { NewListing } from "../types";

type updateListingByIDParams = {
  listing: Partial<NewListing>;
  listingID: number;
  userID: number;
};

// findUsersListingsOnMarket
// findUsersSoldListings

export const getUserDashboardListings = async (userID: number) => {
  // TODO: can see issues with performance if larger amt of data?
  // change this to dashboard/listings endpoint?
  // normal /listings endpoint should return all, with pagination support etc

  const userListings = (
    await db
      .select()
      .from(listings)
      .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
      .where(and(eq(listings.userID, userID), isNull(soldListings.listingID)))
      .orderBy(desc(listings.createdAt))
      .limit(6)
  ).map((listingJoin) => listingJoin.listings);

  return userListings;
};

export const getAllUserListings = async (userID: number, page: number, status: string) => {
  const contactsArr = sql`ARRAY_AGG(${contacts.name})`;

  const contactsAggregate = sql`JSON_AGG(json_build_object('name', ${contacts.name}, 'email', ${contacts.email}, 'phone', ${contacts.phoneNumber}))`;

  const userListings = await db
    .select({
      id: listings.id,
      address: listings.address,
      propertyType: listings.propertyType,
      price: listings.price,
      bedrooms: listings.bedrooms,
      baths: listings.baths,
      squareFeet: listings.squareFeet,
      description: listings.description,
      createdAt: listings.createdAt,
      contacts: contactsAggregate,
    })
    .from(listings)
    .where(eq(listings.id, userID))
    .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
    .where(
      status === "active"
        ? isNull(soldListings.listingID)
        : and(eq(listings.id, soldListings.listingID), isNotNull(soldListings.listingID))
    )
    .leftJoin(listingsToContacts, eq(listings.id, listingsToContacts.listingID))
    .leftJoin(contacts, eq(listingsToContacts.contactID, contacts.id))
    .orderBy(desc(listings.createdAt))
    .groupBy(listings.id)
    .limit(10)
    .offset((page - 1) * 10);

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
