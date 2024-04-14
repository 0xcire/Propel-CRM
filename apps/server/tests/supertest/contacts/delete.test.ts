import { test, expect, describe } from "@jest/globals";

import { insertTestContactAndUserRelation, insertTestUser, removeTestUserAndSession } from "../utils/test-entities";
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
    email: "siliconefifller@gmail.com",
    address: "110 N Carpenter St, Chicago, IL 60007",
    phoneNumber: "555-555-5555",
  });
});

afterAll(async () => {
  await removeTestUserAndSession(testUser, authHeaders);

  await disconnectFromDb();
  disconnectFromRedis();
});

// 400 more of type narrow
describe("DELETE /contacts/:contactID", () => {
  test("return 200 for deleted contact", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "delete",
      path: `/contacts/${contact.id as number}`,
      data: {},
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});
