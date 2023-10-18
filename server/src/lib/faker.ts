// just used to seed demo account with fake data
// probably better ways of doing this

import { faker, fakerEN_US } from "@faker-js/faker";

import { db } from "../db";
import { contacts, listings, listingsToContacts, soldListings, users, usersToContacts } from "../db/schema";
import { getUsersContacts, insertNewContact, insertNewRelation } from "../db/queries/contacts";
import { getAllUserListings } from "../db/queries/listings";
import { insertNewTask } from "../db/queries/tasks";
import { eq, sql } from "drizzle-orm";

import type { Contact, NewContact, NewListing, NewTask } from "../db/types";

const DEMO_ACCOUNT_ID = 10;

export const getAllDemoContacts = async (userID: number) => {
  const userContactJoin = await db
    .select()
    .from(usersToContacts)
    .leftJoin(contacts, eq(usersToContacts.contactID, contacts.id))
    .leftJoin(users, eq(usersToContacts.userID, users.id))
    .where(eq(users.id, userID))
    .orderBy(sql`${usersToContacts.createdAt} asc`);

  const userContacts = userContactJoin.map((result) => result.contacts);
  return userContacts;
};

// from a random listing on zillow
const exampleListingDescription =
  "Light & bright, casually elegant, 2013 5-bed/4 bath colonial offers ease of living, an open plan, & lots of flexibility of use. This home was architect designed & built by a well-respected developer. The open plan K/FR is truly the heart of the home, offering a large island w/lots of storage, dining area, gas fireplace, custom built-ins, & sliders to a paver patio overlooking an easy care, private back yard. Additionally, the 1st fl offers a bedroom/office & bath, formal DR w/coffered ceiling, & mudroom to 2 car garage. The 2nd floor features a master suite w/walk-in closet & bath including shower area, tub, double sinks, & private toilet rm. A guest suite w/bath, two add'l beds w/Jack & Jill bath, & an impressive laundry room complete the 2nd floor. The third floor provides a large bonus rm that can be used as a bedrm, office, playroom, art studio or gym. Easy access to Lincoln Fields, Hayden Ctr, HS, Hastings Elem, and the Old Res. Commuter's dream. Ready for you to move right in!";

// TODO: could refactor to ensure more normal values
// more beds than baths
// probably wont have 15000 sqft house with 3 ba, 3 bed
// etc

const generateAddress = () => {
  const stateAbbr = fakerEN_US.location.state({ abbreviated: true });
  const zipcode = fakerEN_US.location.zipCode({ format: "#####", state: stateAbbr });
  const address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${stateAbbr} ${zipcode}`;

  return address;
};

export const createFakeSoldListing = (): NewListing => {
  const address = generateAddress();
  return {
    address: address,
    propertyType: "single family",
    baths: faker.number.int({ min: 2, max: 5 }),
    bedrooms: faker.number.int({ min: 3, max: 8 }),
    description: exampleListingDescription,
    price: faker.number.int({ min: 250000, max: 6000000 }).toString(),
    squareFeet: faker.number.int({ min: 1250, max: 20000 }),
    createdAt: faker.date.between({ from: "2022-01-01T00:00:00.000Z", to: "2023-08-15T00:00:00.000Z" }),
    userID: DEMO_ACCOUNT_ID,
  };
};

export const seedListingsAndSoldListings = async () => {
  console.log("seeding (sold) listings");
  const usersContacts = await getAllDemoContacts(DEMO_ACCOUNT_ID);

  for (let i = 0; i < 74; i++) {
    const listingLeadsIDArray: Array<number> = [];

    console.log("inserting into listings");
    const newListing = await db
      .insert(listings)
      .values(createFakeSoldListing())
      .returning({
        id: listings.id,
        price: listings.price,
        createdAt: listings.createdAt,
      })
      .onConflictDoNothing();

    console.log("----- \n LISTING \n -----", newListing[0]);

    for (let j = 0; j < Math.round(Math.random() * 2) + 1; j++) {
      const randomContactIdx = Math.floor(Math.random() * usersContacts.length);
      const randomContact = usersContacts[randomContactIdx];

      console.log("ADDING LEAD");
      const leadEstablished = newListing[0].createdAt && new Date(newListing[0].createdAt);
      const daysAfter = faker.number.int({ min: 1, max: 20 });
      leadEstablished?.setDate(leadEstablished.getDate() + daysAfter);

      const listingLeads = await db
        .insert(listingsToContacts)
        .values({
          contactID: randomContact?.id as number,
          listingID: newListing[0].id,
          createdAt: leadEstablished,
        })
        .returning({
          contactID: listingsToContacts.contactID,
          createdAt: listingsToContacts.createdAt,
        })
        .onConflictDoNothing();

      console.log("lead", listingLeads[0]);

      listingLeadsIDArray.push(listingLeads[0].contactID as number);

      console.log("----- \n LEAD ID \n -----", listingLeads[0].contactID);
    }

    const newListingDate = newListing[0].createdAt && new Date(newListing[0].createdAt);
    const daysOnMarket = faker.number.int({ min: 25, max: 65 });
    newListingDate?.setDate(newListingDate.getDate() + daysOnMarket);
    const salePrice = (+newListing[0].price * faker.number.float({ min: 0.88, max: 1 })).toString();

    console.log(listingLeadsIDArray, Math.floor(Math.random() * listingLeadsIDArray.length));

    console.log("inserting into sold_listings");
    const soldListing = await db
      .insert(soldListings)
      .values({
        listingID: newListing[0].id,
        soldAt: newListingDate,
        userID: DEMO_ACCOUNT_ID,
        salePrice: salePrice,
        contactID: listingLeadsIDArray[Math.floor(Math.random() * listingLeadsIDArray.length)],
      })
      .returning({
        soldAt: soldListings.soldAt,
      })
      .onConflictDoNothing();
    console.log("sold_listing", soldListing[0]);

    console.log(`completed ${i + 1} iterations`);
  }
};

export const createFakeActiveListing = () => {
  return {
    address: generateAddress(),
    propertyType: "single family",
    baths: faker.number.int({ min: 2, max: 5 }),
    bedrooms: faker.number.int({ min: 3, max: 8 }),
    description: exampleListingDescription,
    price: faker.number.int({ min: 250000, max: 3000000 }).toString(),
    squareFeet: faker.number.int({ min: 1250, max: 20000 }),
    createdAt: faker.date.between({ from: "2023-04-01T00:00:00.000Z", to: "2023-09-15T00:00:00.000Z" }),
    userID: DEMO_ACCOUNT_ID,
  };
};

export const seedListings = async () => {
  // if i reseed listings need to address below function call
  const usersContacts = await getAllDemoContacts(DEMO_ACCOUNT_ID);
  for (let i = 0; i < 1; i++) {
    await db.transaction(async (tx) => {
      const newListing = await db.insert(listings).values(createFakeActiveListing()).returning({
        id: listings.id,
        createdAt: listings.createdAt,
      });
      console.log("----- \n LISTING ID \n -----", newListing[0].id);

      for (let j = 0; j < Math.round(Math.random() * 3); j++) {
        const randomContactIdx = Math.floor(Math.random() * usersContacts.length);
        const randomContact = usersContacts[randomContactIdx];

        const leadEstablished = newListing[0].createdAt && new Date(newListing[0].createdAt);
        leadEstablished?.setDate(leadEstablished.getDate() + faker.number.int({ min: 1, max: 20 }));

        const listingLeads = await db
          .insert(listingsToContacts)
          .values({
            contactID: randomContact?.id as number,
            listingID: newListing[0].id,
            createdAt: leadEstablished,
          })
          .returning({
            contactID: listingsToContacts.contactID,
          });
        console.log("----- \n LEAD ID \n -----", listingLeads[0].contactID);
      }
    });
    console.log(`completed ${i + 1} iterations`);
  }
};

export const createFakeContact = () => {
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

export const seedContacts = async () => {
  for (let i = 0; i <= 50; i++) {
    await db.transaction(async (tx) => {
      const newContact = await insertNewContact(createFakeContact());
      const relation = await insertNewRelation({ currentUserID: DEMO_ACCOUNT_ID, newContactID: newContact.id });
    });
  }
};

const setPriority = () => {
  const priorities = ["low", "medium", "high"] as const;
  const randomIndex = Math.floor(Math.random() * priorities.length);
  return priorities[randomIndex];
};

// all uniform, but at least it wont be lorem ipsum or just complete word salad.
export const createFakeTask = (): NewTask => {
  const date = fakerEN_US.date.between({ from: "2023-10-01T00:00:00.000Z", to: "2024-01-01T00:00:00.000Z" });
  return {
    userID: DEMO_ACCOUNT_ID,
    // title: "This is an incomplete task.",
    title: "This is a complete task.",
    description: "Here's an opportunity to add a couple sentences to furthur describe a task.",
    notes: "- Bullet points \n- To provide additional details \n- About the task at hand",
    dueDate: date.toISOString(),
    priority: setPriority(),
    completed: true,
  };
};

export const seedTasks = async () => {
  for (let i = 0; i < 25; i++) {
    const newTask = await insertNewTask(createFakeTask());
  }
};

// export const seedListingTasks = async () => {
//   const demoListings = await getAllUserListings(10, 1, );
// };

// export const seedContactTasks = async () => {};
