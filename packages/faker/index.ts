import { db } from "@propel/drizzle";

import { faker } from "@faker-js/faker";

import { insertNewContact, insertNewRelation } from "@propel/drizzle/queries/contacts";
import { insertNewLead, insertNewListing, insertSoldListingData } from "@propel/drizzle/queries/listings";
import { insertNewTask } from "@propel/drizzle/queries/tasks";

import { createFakeContact } from "./contacts";
import { createFakeActiveListing, createFakeSoldListing } from "./listings";
import { createFakeTask } from "./tasks";

import { getDemoAccountID } from "./utils";

export const propelFaker = {
  contacts: [],
  seedContacts: async function (count: number) {
    for (let i = 0; i <= count; ++i) {
      await db.transaction(async (tx) => {
        const newContact = await insertNewContact(createFakeContact());
        await insertNewRelation({ currentUserID: getDemoAccountID(), newContactID: newContact.id });
        this.contacts.push(newContact);
      });
    }
  },
  seedListings: async function (count: number) {
    const contacts = this.contacts;
    for (let i = 0; i < count; i++) {
      await db.transaction(async (tx) => {
        const newListing = await insertNewListing(createFakeActiveListing());
        console.log("----- \n LISTING ID \n -----", newListing.id);

        for (let j = 0; j < Math.round(Math.random() * 3); j++) {
          const randomContactIdx = Math.floor(Math.random() * contacts.length);
          const randomContact = contacts[randomContactIdx];

          const leadEstablished = (newListing.createdAt && new Date(newListing.createdAt)) ?? undefined;
          leadEstablished?.setDate(leadEstablished.getDate() + faker.number.int({ min: 1, max: 20 }));

          const listingLead = await insertNewLead(newListing.id, randomContact, leadEstablished);
          console.log("----- \n LEAD ID \n -----", listingLead.contactID);
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
        const leadEstablished = (newListing.createdAt && new Date(newListing.createdAt)) ?? undefined;
        const daysAfter = faker.number.int({ min: 1, max: 20 });
        leadEstablished?.setDate(leadEstablished.getDate() + daysAfter);

        const listingLead = await insertNewLead(newListing.id, randomContact.id, leadEstablished);

        console.log("lead", listingLead);

        listingLeadsIDArray.push(listingLead.contactID as number);

        console.log("----- \n LEAD ID \n -----", listingLead.contactID);
      }

      const newListingDate = newListing.createdAt && new Date(newListing.createdAt);
      const daysOnMarket = faker.number.int({ min: 25, max: 65 });
      newListingDate?.setDate(newListingDate.getDate() + daysOnMarket);
      const salePrice = (+newListing.price * faker.number.float({ min: 0.88, max: 1 })).toString();

      console.log(listingLeadsIDArray, Math.floor(Math.random() * listingLeadsIDArray.length));

      console.log("inserting into sold_listings");
      const soldListing = insertSoldListingData({
        listingID: newListing.id,
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
      const newTask = await insertNewTask(createFakeTask({ complete: true }));
    }
    for (let i = 0; i < count; i++) {
      const newTask = await insertNewTask(createFakeTask({ complete: false }));
    }
  },

  seedDatabase: async function () {
    await this.seedContacts(75);
    await this.seedListings(30);
    await this.seedListingsAndSoldListings(55);
    await this.seedTasks(25);
  },
};
