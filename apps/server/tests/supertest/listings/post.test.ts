import { test, expect, describe } from "@jest/globals";

import { logIn, sendMutationRequestToPath } from "../utils/requests";
import {
  deleteContact,
  deleteListing,
  insertTestContactAndUserRelation,
  insertTestListing,
  insertTestUser,
  removeTestUserAndSession,
} from "../utils/test-entities";
import { disconnectFromDb, disconnectFromRedis } from "../utils/session";

import type { Header } from "../types";
import {
  insertNewLead,
  removeLead,
  type Listing,
  type NewContact,
  type NewListing,
  type User,
  NewSoldListing,
  insertSoldListingData,
  removeSoldListingData,
} from "@propel/drizzle";

// [ ]: Partial<User> -> TestUser = { id: number; email: string; password: string; }
let authHeaders: Header, testUser: Partial<User>;

beforeAll(async () => {
  testUser = await insertTestUser();
  authHeaders = await logIn(testUser.email as string, "supertest");
});

afterAll(async () => {
  // deleteContact
  // deleteListing
  await removeTestUserAndSession(testUser, authHeaders);

  await disconnectFromDb();
  disconnectFromRedis();
});

describe("POST /listings", () => {
  let listing: Listing;

  afterAll(async () => {
    await deleteListing(listing, testUser);
  });

  test("return 200 for valid req", async () => {
    const { statusCode, body } = await sendMutationRequestToPath<NewListing>({
      method: "post",
      path: "/listings",
      data: {
        address: "913 Wyoming Ave, Wyoming, PA 18644",
        description: "Definitely not a McDonald's",
        propertyType: "single family",
        price: "250000",
        baths: 1,
        bedrooms: 2,
        squareFeet: 1500,
      },
      header: authHeaders,
    });

    listing = body.listings;

    expect(statusCode).toBe(201);
  });
});

describe("POST /listings/:listingID/sold/:contactID", () => {
  let listing: Omit<Listing, "userID">, contact: NewContact;

  beforeAll(async () => {
    listing = await insertTestListing({
      address: "9505 S 144th St, Omaha, NE 68138",
      description: "Definitely not a McDonald's",
      propertyType: "single family",
      price: "250000",
      baths: 1,
      bedrooms: 2,
      squareFeet: 1500,
      userID: testUser.id,
    });

    contact = await insertTestContactAndUserRelation(testUser, {
      name: "Kyrie Irving",
      address: "2500 Victory Ave, Dallas, TX 75219",
      email: "mavericks@gmail.com",
      phoneNumber: "555-555-5555",
    });
  });

  afterAll(async () => {
    deleteListing(listing, testUser);
    deleteContact(contact);
  });

  test("return 409 for marking a sold listing as sold", async () => {
    // await insertNewLead(listing.id, contact.id as number);
    await insertSoldListingData({
      salePrice: "250000",
      contactID: contact.id,
      listingID: listing.id,
      userID: testUser.id,
    });

    const { statusCode, body } = await sendMutationRequestToPath<NewSoldListing>({
      method: "post",
      path: `/listings/${listing.id}/sold/${contact.id}`,
      data: {
        salePrice: "250000",
        contactID: contact.id,
        listingID: listing.id,
        userID: testUser.id,
      },
      header: authHeaders,
    });

    // await removeSoldListingData(listing.id);

    // await removeLead(listing.id, contact.id as number);

    expect(statusCode).toBe(409);
  });

  //   test("return 200 for valid req", async () => {
  //     expect(1).toBe(1);
  //   });
});

// describe("POST /listings/:listingID/lead/:contactID", () => {
//   test("return 409 for adding an existing lead", async () => {
//     expect(1).toBe(1);
//   });
// });
