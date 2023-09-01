import { faker, fakerEN_US } from "@faker-js/faker";

import type { NewListing } from "../db/types";
import { db } from "../db";
import { listings, soldListings } from "../db/schema";

// from a random listing on zillow
const exampleListingDescription =
  "Light & bright, casually elegant, 2013 5-bed/4 bath colonial offers ease of living, an open plan, & lots of flexibility of use. This home was architect designed & built by a well-respected developer. The open plan K/FR is truly the heart of the home, offering a large island w/lots of storage, dining area, gas fireplace, custom built-ins, & sliders to a paver patio overlooking an easy care, private back yard. Additionally, the 1st fl offers a bedroom/office & bath, formal DR w/coffered ceiling, & mudroom to 2 car garage. The 2nd floor features a master suite w/walk-in closet & bath including shower area, tub, double sinks, & private toilet rm. A guest suite w/bath, two add'l beds w/Jack & Jill bath, & an impressive laundry room complete the 2nd floor. The third floor provides a large bonus rm that can be used as a bedrm, office, playroom, art studio or gym. Easy access to Lincoln Fields, Hayden Ctr, HS, Hastings Elem, and the Old Res. Commuter's dream. Ready for you to move right in!";

export const createFakeListing = (): NewListing => {
  const stateAbbr = fakerEN_US.location.state({ abbreviated: true });
  const zipcode = fakerEN_US.location.zipCode({ format: "#####", state: stateAbbr });
  const address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${stateAbbr} ${zipcode}`;
  return {
    address: address,
    propertyType: "single family",
    baths: faker.number.int({ min: 2, max: 5 }),
    bedrooms: faker.number.int({ min: 3, max: 8 }),
    description: exampleListingDescription,
    price: faker.number.int({ min: 250000, max: 6000000 }).toString(),
    squareFeet: faker.number.int({ min: 1250, max: 20000 }),
    createdAt: faker.date.between({ from: "2022-01-01T00:00:00.000Z", to: "2023-08-15T00:00:00.000Z" }),
    userID: 10,
  };
};

export const seedListingsTable = async () => {
  for (let i = 0; i < 200; i++) {
    await db.transaction(async (tx) => {
      const newListing = await tx.insert(listings).values(createFakeListing()).returning({
        id: listings.id,
        createdAt: listings.createdAt,
      });
      const newListingDate = newListing[0].createdAt && new Date(newListing[0].createdAt);
      const daysOnMarket = faker.number.int({ min: 25, max: 75 });
      newListingDate?.setDate(newListingDate.getDate() + daysOnMarket);
      await tx.insert(soldListings).values({
        listingID: newListing[0].id,
        soldAt: newListingDate,
        userID: 10,
      });
    });
  }
};
