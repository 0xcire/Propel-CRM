import { db } from "@propel/drizzle";

import { faker, fakerEN_US } from "@faker-js/faker";

import { contacts, listings, listingsToContacts, soldListings, users, usersToContacts } from "@propel/drizzle/schema";
import { getUsersContacts, insertNewContact, insertNewRelation } from "@propel/drizzle/queries/contacts";
import { getAllUserListings } from "@propel/drizzle/queries/listings";
import { insertNewTask } from "@propel/drizzle/queries/tasks";

import type { Contact, NewContact, NewListing, NewTask } from "@propel/drizzle/types";

const DEMO_ACCOUNT_ID = 10;

const generateAddress = () => {
  const stateAbbr = fakerEN_US.location.state({ abbreviated: true });
  const zipcode = fakerEN_US.location.zipCode({ format: "#####", state: stateAbbr });
  const address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${stateAbbr} ${zipcode}`;

  return address;
};

export const propelFaker = {
  seedContacts: async (count: number) => {
    const createFakeContact = () => {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const name = `${first} ${last}`;
      const email = faker.internet.email({
        firstName: first,
        lastName: last,
      });
      const address = generateAddress();

      return {
        name: name,
        email: email,
        phoneNumber: fakerEN_US.phone.number().split("x")[0].trim(),
        address: address,
        createdAt: faker.date.between({ from: "2022-01-01T00:00:00.000Z", to: "2023-08-15T00:00:00.000Z" }),
      };
    };
    for (let i = 0; i <= count; ++i) {
      await db.transaction(async (tx) => {
        const newContact = await insertNewContact(createFakeContact());
        const relation = await insertNewRelation({ currentUserID: DEMO_ACCOUNT_ID, newContactID: newContact.id });
      });
    }
  },
  seedListings: async () => {},
  seedLeadsOnListings: async () => {},
  seedSoldListings: async () => {},
  seedTasks: async () => {},
};
