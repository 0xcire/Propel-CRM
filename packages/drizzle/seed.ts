// import { db } from "../db";

import { faker } from "@faker-js/faker";

import {
  insertNewContact,
  insertNewRelation,
  insertNewLead,
  insertNewListing,
  insertSoldListingData,
  insertNewTask,
  insertNewUser,
} from "@propel/drizzle";

import {
  createFakeContact,
  createFakeActiveListing,
  createFakeSoldListing,
  createFakeTask,
  getDemoAccountID,
} from "@propel/faker";
import { hashPassword } from "@propel/lib";
import { PG_URL } from "./config";

import type { Contact } from "./types";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { listingsToContacts } from "./schema";
import { and, eq } from "drizzle-orm";

const queryClient = postgres(`${PG_URL}`);
const db = drizzle(queryClient, { logger: true });

export const propelFaker: {
  contacts: Array<Contact>;
  seedContacts: (count: number) => Promise<void>;
  seedListings: (count: number) => Promise<void>;
  seedListingsAndSoldListings: (count: number) => Promise<void>;
  seedTasks: (count: number) => Promise<void>;
  seedDatabase: () => Promise<void>;
} = {
  contacts: [],
  seedContacts: async function (count: number) {
    for (let i = 0; i <= count; ++i) {
      await db.transaction(async () => {
        const newContact = await insertNewContact(createFakeContact() as Contact);
        await insertNewRelation({ currentUserID: getDemoAccountID(), newContactID: newContact?.id as number });
        this.contacts.push(newContact as Contact);
      });
    }
  },
  seedListings: async function (count: number) {
    const contacts = this.contacts;
    for (let i = 0; i < count; i++) {
      await db.transaction(async () => {
        const newListing = await insertNewListing(createFakeActiveListing());
        console.log("----- \n LISTING ID \n -----", newListing?.id);

        for (let j = 0; j < Math.round(Math.random() * 3); j++) {
          const randomContactIdx = Math.floor(Math.random() * contacts.length);
          const randomContact = contacts[randomContactIdx];

          const leadEstablished = (newListing?.createdAt && new Date(newListing.createdAt)) ?? undefined;
          leadEstablished?.setDate(leadEstablished.getDate() + faker.number.int({ min: 1, max: 20 }));

          let listingLead;
          if (newListing && randomContact) {
            listingLead = await insertNewLead(newListing?.id, randomContact?.id, leadEstablished);
          }

          console.log("----- \n LEAD ID \n -----", listingLead?.contactID);
        }
      });
      console.log(`completed ${i + 1} iterations`);
    }
  },
  seedListingsAndSoldListings: async function (count: number) {
    console.log("seeding (sold) listings");
    const contacts = this.contacts;

    for (let i = 0; i < count; i++) {
      const listingLeadsIDArray: Array<number> = [];

      console.log("inserting into listings");
      const newListing = await insertNewListing(createFakeSoldListing());

      console.log("----- \n LISTING \n -----", newListing);

      for (let j = 0; j < Math.round(Math.random() * 2) + 1; j++) {
        const randomContactIdx = Math.floor(Math.random() * contacts.length);
        const randomContact = contacts[randomContactIdx];

        console.log("ADDING LEAD");
        const leadEstablished = (newListing?.createdAt && new Date(newListing.createdAt)) ?? undefined;
        const daysAfter = faker.number.int({ min: 1, max: 20 });
        leadEstablished?.setDate(leadEstablished.getDate() + daysAfter);

        let listingLead;
        if (newListing && randomContact) {
          const existingLeadForListing = await db
            .select()
            .from(listingsToContacts)
            .where(
              and(
                eq(listingsToContacts.listingID, newListing.id),
                eq(listingsToContacts.contactID, randomContact.id)
                //
              )
            );
          if (existingLeadForListing[0]) return;

          listingLead = await insertNewLead(newListing.id, randomContact.id, leadEstablished);
        }

        console.log("lead", listingLead);

        listingLeadsIDArray.push(listingLead?.contactID as number);

        console.log("----- \n LEAD ID \n -----", listingLead?.contactID);
      }

      const newListingDate = newListing?.createdAt && new Date(newListing.createdAt);
      const daysOnMarket = faker.number.int({ min: 25, max: 65 });
      newListingDate?.setDate(newListingDate.getDate() + daysOnMarket);
      const salePrice = (+(newListing?.price as string) * faker.number.float({ min: 0.88, max: 1 })).toString();

      console.log(listingLeadsIDArray, Math.floor(Math.random() * listingLeadsIDArray.length));

      console.log("inserting into sold_listings");
      const soldListing = await insertSoldListingData({
        listingID: newListing?.id,
        soldAt: newListingDate,
        userID: getDemoAccountID(),
        salePrice: salePrice,
        contactID: listingLeadsIDArray[Math.floor(Math.random() * listingLeadsIDArray.length)],
      });

      console.log("sold_listing", soldListing);

      console.log(`completed ${i + 1} iterations`);
    }
  },
  seedTasks: async function (count: number) {
    for (let i = 0; i < count; i++) {
      await insertNewTask(createFakeTask({ complete: true }));
    }
    for (let i = 0; i < count; i++) {
      await insertNewTask(createFakeTask({ complete: false }));
    }
  },

  seedDatabase: async function () {
    console.log("seeding");
    await insertNewUser({
      id: 10,
      name: "Test Test",
      username: "test123",
      email: "test@gmail.com",
      hashedPassword: await hashPassword("testtest", 10),
    });
    await propelFaker.seedContacts(50);
    await propelFaker.seedListings(30);
    await propelFaker.seedListingsAndSoldListings(55);
    await propelFaker.seedTasks(25);
  },
};

(() => {
  propelFaker
    .seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      console.log("Seeding done!");
      process.exit(0);
    });
})();
