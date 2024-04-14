import { and, desc, eq, ilike, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "..";
import { contacts, listings, listingsToContacts, soldListings } from "../schema";

import type { NewListing, NewSoldListing } from "../types";
import type { ListingStatus, PaginationParams } from "@propel/types";

// listingID, userID common type

type updateListingByIDParams = {
  listing: Partial<NewListing>;
  listingID: number;
  userID: number;
};

interface UserListingQuery {
  userID: number;
  status: ListingStatus;
}

type getAllUserListingsParams = PaginationParams & UserListingQuery;
interface SearchForListingsParams extends PaginationParams, UserListingQuery {
  address: string;
}

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

const activeListingSelect = {
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
};

const soldListingSelect = {
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
};

export const getUserDashboardListings = async (userID: number) => {
  const userListings = await db
    .select(activeListingSelect)
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

export const getAllUserListings = async ({
  userID,
  page,
  status = "active",
  limit = "10",
}: getAllUserListingsParams) => {
  let userListings;

  if (status === "active") {
    userListings = await db
      .select(activeListingSelect)
      .from(listings)
      .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
      .leftJoin(listingsToContacts, eq(listings.id, listingsToContacts.listingID))
      .leftJoin(contacts, eq(listingsToContacts.contactID, contacts.id))
      .where(
        and(
          eq(listings.userID, userID),
          isNull(soldListings.listingID)
          //
        )
      )
      .orderBy(desc(listings.createdAt))
      .groupBy(listings.id)
      .limit(+limit)
      .offset((page - 1) * +limit);
  } else {
    userListings = await db
      .select(soldListingSelect)
      .from(listings)
      .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
      .leftJoin(listingsToContacts, eq(soldListings.contactID, listingsToContacts.contactID))
      .leftJoin(contacts, eq(soldListings.contactID, contacts.id))
      .where(
        and(
          eq(listings.userID, userID),
          isNotNull(soldListings.listingID),
          eq(soldListings.listingID, listingsToContacts.listingID)
        )
      )
      .orderBy(desc(listings.createdAt))
      .groupBy(listings.id, contacts.id, soldListings.salePrice)
      .limit(+limit)
      .offset((page - 1) * +limit);
  }

  return userListings;
};

type GetListingByIDParams = {
  listingID: number;
  userID: number;
};
export const getListingByID = async ({ listingID, userID }: GetListingByIDParams) => {
  const listing = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, +listingID), eq(listings.userID, userID)));

  return listing[0];
};

// TODO: commmon type
type FindContactsRelatedListingsParams = {
  userID: number;
  contactID: number;
};
export const findContactsRelatedListings = async ({ userID, contactID }: FindContactsRelatedListingsParams) => {
  const contactListings = await db
    .select({
      id: listings.id,
      address: listings.address,
    })
    .from(listings)
    .leftJoin(soldListings, eq(soldListings.listingID, listings.id))
    .leftJoin(listingsToContacts, eq(listingsToContacts.listingID, listings.id))
    .leftJoin(contacts, eq(contacts.id, listingsToContacts.contactID))
    .where(
      and(
        eq(listings.userID, userID),
        eq(listingsToContacts.contactID, contactID),
        isNull(soldListings.listingID)
        //
      )
    )
    .orderBy(desc(listings.createdAt));

  return contactListings;
};

export const searchForListings = async ({
  userID,
  address,
  status = "active",
  page,
  limit = "10",
}: SearchForListingsParams) => {
  let userListings;

  if (status === "active") {
    userListings = await db
      .select(activeListingSelect)
      .from(listings)
      .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
      .leftJoin(listingsToContacts, eq(listings.id, listingsToContacts.listingID))
      .leftJoin(contacts, eq(listingsToContacts.contactID, contacts.id))
      .where(
        and(
          eq(listings.userID, userID),
          isNull(soldListings.listingID),
          ilike(listings.address, `%${address}%`)
          //
        )
      )
      .orderBy(desc(listings.createdAt))
      .groupBy(listings.id)
      .limit(+limit)
      .offset((page - 1) * +limit);
  } else {
    userListings = await db
      .select(soldListingSelect)
      .from(listings)
      .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
      .leftJoin(listingsToContacts, eq(soldListings.contactID, listingsToContacts.contactID))
      .leftJoin(contacts, eq(soldListings.contactID, contacts.id))
      .where(
        and(
          eq(listings.userID, userID),
          isNotNull(soldListings.listingID),
          ilike(listings.address, `%${address}%`),
          eq(soldListings.listingID, listingsToContacts.listingID)
        )
      )
      .orderBy(desc(listings.createdAt))
      .groupBy(listings.id, contacts.id, soldListings.salePrice)
      .limit(+limit)
      .offset((page - 1) * +limit);
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
    createdAt: listings.createdAt,
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
  const deletedListing = await db
    .delete(listings)
    .where(and(eq(listings.id, listingID), eq(listings.userID, userID)))
    .returning({
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

export const isListingSold = async (listingID: number): Promise<boolean> => {
  const rows = await db
    .select()
    .from(listings)
    .leftJoin(soldListings, eq(listings.id, soldListings.listingID))
    .where(eq(listings.id, listingID));

  return rows.length === 1;
};

export const insertSoldListingData = async (values: NewSoldListing) => {
  const soldListing = await db.insert(soldListings).values(values).onConflictDoNothing().returning({
    listingID: soldListings.listingID,
    userID: soldListings.userID,
    salePrice: soldListings.salePrice,
    contactID: soldListings.contactID,
    soldAt: soldListings.soldAt,
  });

  return soldListing[0];
};

export const removeSoldListingData = async (listingID: number) => {
  await db.delete(soldListings).where(eq(soldListings.listingID, listingID));
};

export const insertNewLead = async (listingID: number, contactID: number, createdAt?: Date) => {
  const newLead = await db
    .insert(listingsToContacts)
    .values({
      listingID: listingID,
      contactID: contactID,
      ...(createdAt && { createdAt: createdAt }),
    })
    .returning({
      listingID: listingsToContacts.listingID,
      contactID: listingsToContacts.contactID,
    })
    .onConflictDoNothing();

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
