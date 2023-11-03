import { and, desc, eq, isNotNull, isNull, not, sql } from "drizzle-orm";
import { db } from "..";
import { contacts, listings, listingsToContacts, soldListings } from "../schema";

import type { NewListing, NewSoldListing } from "../types";

type updateListingByIDParams = {
  listing: Partial<NewListing>;
  listingID: number;
  userID: number;
};

const activeContactsAggregate = sql`JSON_AGG(
  json_build_object(
    'id', ${contacts.id},
    'name', ${contacts.name}, 
    'email', ${contacts.email}, 
    'phone', ${contacts.phoneNumber},
    'days', ${sql`EXTRACT(DAYS FROM CURRENT_DATE - ${listingsToContacts.createdAt})`}
  )
)`;

const soldContactAggregate = sql`JSON_AGG(
  json_build_object(
    'id', ${contacts.id},
    'name', ${contacts.name}, 
    'email', ${contacts.email}, 
    'phone', ${contacts.phoneNumber},
    'days', ${sql`EXTRACT(DAYS FROM ${soldListings.soldAt} - ${listingsToContacts.createdAt})`}
  )
)`;

export const getUserDashboardListings = async (userID: number) => {
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
      contacts: activeContactsAggregate,
    })
    .from(listings)
    .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
    .where(and(eq(listings.userID, userID), isNull(soldListings.listingID)))
    .leftJoin(listingsToContacts, eq(listings.id, listingsToContacts.listingID))
    .leftJoin(contacts, eq(listingsToContacts.contactID, contacts.id))
    .orderBy(desc(listings.createdAt))
    .groupBy(listings.id)
    .limit(6);

  return userListings;
};

// better way?
export const getAllUserListings = async (userID: number, page: number, status: string) => {
  let userListings;

  if (status === "active") {
    userListings = await db
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
        contacts: activeContactsAggregate,
      })
      .from(listings)
      .where(eq(listings.id, userID))
      .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
      .where(and(eq(listings.userID, userID), isNull(soldListings.listingID)))
      .leftJoin(listingsToContacts, eq(listings.id, listingsToContacts.listingID))
      .leftJoin(contacts, eq(listingsToContacts.contactID, contacts.id))
      .orderBy(desc(listings.createdAt))
      .groupBy(listings.id)
      .limit(10)
      .offset((page - 1) * 10);
  } else {
    userListings = await db
      .select({
        id: listings.id,
        address: listings.address,
        propertyType: listings.propertyType,
        price: soldListings.salePrice,
        bedrooms: listings.bedrooms,
        baths: listings.baths,
        squareFeet: listings.squareFeet,
        description: listings.description,
        createdAt: listings.createdAt,
        contacts: soldContactAggregate,
      })
      .from(listings)
      .where(eq(listings.userID, userID))
      .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
      .where(and(eq(listings.userID, userID), isNotNull(soldListings.listingID)))
      .leftJoin(listingsToContacts, eq(soldListings.contactID, listingsToContacts.contactID))
      .where(eq(soldListings.listingID, listingsToContacts.listingID))
      .leftJoin(contacts, eq(soldListings.contactID, contacts.id))
      .orderBy(desc(listings.createdAt))
      .groupBy(listings.id, contacts.id, soldListings.salePrice)
      .limit(10)
      .offset((page - 1) * 10);
  }

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

export const findExistingLead = async (listingID: number, contactID: number) => {
  const existingLead = await db
    .select()
    .from(listingsToContacts)
    .where(and(eq(listingsToContacts.contactID, +contactID), eq(listingsToContacts.listingID, +listingID)));

  if (!existingLead[0]) {
    return undefined;
  }

  return existingLead[0];
};

export const insertSoldListingData = async (values: NewSoldListing) => {
  const soldListing = await db
    .insert(soldListings)
    .values({
      listingID: values.listingID,
      userID: values.userID,
      salePrice: values.salePrice,
      contactID: values.contactID,
    })
    .onConflictDoNothing();
};

export const insertNewLead = async (listingID: number, contactID: number) => {
  const newLead = await db
    .insert(listingsToContacts)
    .values({
      listingID: listingID,
      contactID: contactID,
    })
    .returning({
      listingID: listingsToContacts.listingID,
      contactID: listingsToContacts.contactID,
    });

  return newLead[0];
};

export const removeLead = async (listingID: number, contactID: number) => {
  const removedLead = await db
    .delete(listingsToContacts)
    .where(and(eq(listingsToContacts.contactID, contactID), eq(listingsToContacts.listingID, listingID)))
    .returning({
      listingID: listingsToContacts.listingID,
      contactID: listingsToContacts.contactID,
    });

  return removedLead[0];
};
