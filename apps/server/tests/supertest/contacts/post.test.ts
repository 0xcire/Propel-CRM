import { test, expect, describe } from "@jest/globals";

import {
  deleteContact,
  insertTestContactAndUserRelation,
  insertTestUser,
  removeTestUserAndSession,
} from "../utils/test-entities";
import { logIn, sendMutationRequestToPath } from "../utils/requests";
import { disconnectFromDb, disconnectFromRedis } from "../utils/session";

import { findContactByDetails } from "@propel/drizzle";

import type { Header } from "../types";
import type { User, NewContact } from "@propel/drizzle";

let authHeaders: Header, testUser: Partial<User>, contact: NewContact;

beforeAll(async () => {
  testUser = await insertTestUser();
  authHeaders = await logIn(testUser.email, "supertest");

  contact = await insertTestContactAndUserRelation(testUser, {
    name: "Ronald Donald",
    email: "mcdee@gmail.com",
    address: "110 N French Fry Ln, Chicago, MA 98765",
    phoneNumber: "555-555-5555",
  });
});

afterAll(async () => {
  await deleteContact(contact);
  await removeTestUserAndSession(testUser, authHeaders);

  await disconnectFromDb();
  disconnectFromRedis();
});

// 400 is technically handled via validateRequest and is more of a type narrow
describe("POST /contacts", () => {
  let contact: NewContact | undefined;

  afterAll(async () => {
    if (contact) {
      deleteContact(contact);
    }
  });

  test("return 409 for conflict: adding contact which already exists in network", async () => {
    const { statusCode } = await sendMutationRequestToPath<NewContact>({
      method: "post",
      path: `/contacts`,
      data: {
        name: "Ronald Donald",
        email: "mcdee@gmail.com",
        address: "110 N French Fry Ln, Chicago, MA 98765",
        phoneNumber: "555-555-5555",
      },
      header: authHeaders,
    });

    expect(statusCode).toBe(409);
  });

  test("return 201 for created contact", async () => {
    const { statusCode } = await sendMutationRequestToPath<Partial<NewContact>>({
      method: "post",
      path: `/contacts`,
      data: {
        name: "Billert Bobert",
        email: "billerybob@gmail.com",
        address: "1234 N Carpenter Ln, Boston, MA 12345",
        phoneNumber: "555-555-5555",
      },
      header: authHeaders,
    });

    contact = await findContactByDetails({
      name: "Billert Bobert",
      email: "billerybob@gmail.com",
      address: "1234 N Carpenter Ln, Boston, MA 12345",
      phoneNumber: "555-555-5555",
    });

    expect(statusCode).toBe(201);
  });
});
