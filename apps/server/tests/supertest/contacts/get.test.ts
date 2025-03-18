import { test, expect, describe } from "@jest/globals";

import { logIn, sendGetRequestToPath } from "../utils/requests";
import { disconnectFromDb, disconnectFromRedis } from "../utils/session";
import {
  deleteContact,
  insertTestContactAndUserRelation,
  insertTestUser,
  removeTestUserAndSession,
} from "../utils/test-entities";

import type { Header } from "../types";
import type { NewContact, User } from "@propel/drizzle";

let authHeaders: Header, testUser: Partial<User>, contact: NewContact;

beforeAll(async () => {
  testUser = await insertTestUser();
  authHeaders = await logIn(testUser.email, "supertest");

  contact = await insertTestContactAndUserRelation(testUser, {
    name: "Mac Donald",
    email: "miliconefiller@gmail.com",
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

describe("GET /dashboard/contacts", () => {
  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/dashboard/contacts`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /contacts", () => {
  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/contacts`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /contacts/search", () => {
  test("returns 400 for no name search param", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/contacts/search`,
      header: authHeaders,
    });
    expect(statusCode).toBe(400);
  });

  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/contacts/search?name=apple`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /contacts/:contactID", () => {
  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/contacts/${contact.id}`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});
