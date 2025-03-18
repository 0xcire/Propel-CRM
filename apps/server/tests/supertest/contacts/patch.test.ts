import { test, expect, describe } from "@jest/globals";

import {
  deleteContact,
  insertTestContactAndUserRelation,
  insertTestUser,
  removeTestUserAndSession,
} from "../utils/test-entities";
import { logIn, sendMutationRequestToPath } from "../utils/requests";
import { disconnectFromDb, disconnectFromRedis } from "../utils/session";

import type { Header } from "../types";
import type { User, NewContact } from "@propel/drizzle";

let authHeaders: Header, testUser: Partial<User>, contact: NewContact;

beforeAll(async () => {
  testUser = await insertTestUser();

  authHeaders = await logIn(testUser.email, "supertest");

  contact = await insertTestContactAndUserRelation(testUser, {
    name: "Mac Donald",
    email: "siliconefiller@gmail.com",
    address: "110 N Carpenter St, Chicago, IL 60007",
    phoneNumber: "555-555-5555",
  });
});

afterAll(async () => {
  await deleteContact(contact);
  await removeTestUserAndSession(testUser, authHeaders);

  await disconnectFromDb();
  disconnectFromRedis();
});

describe("PATCH /contacts/:contactID", () => {
  test("return 400 for empty data", async () => {
    const { statusCode } = await sendMutationRequestToPath<Partial<NewContact>>({
      method: "patch",
      path: `/contacts/${contact.id as number}`,
      data: {},
      header: authHeaders,
    });
    expect(statusCode).toBe(400);
  });

  test("return 200 for updated contact", async () => {
    const { statusCode } = await sendMutationRequestToPath<NewContact>({
      method: "patch",
      path: `/contacts/${contact.id as number}`,
      data: {
        name: "Bill Bob",
        email: "billbob@gmail.com",
        address: "11340 N Blacksmith Ct, Los Angeles, MA 12345",
        phoneNumber: "555-555-5555",
      },
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});
