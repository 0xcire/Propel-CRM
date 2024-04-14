import { test, expect, describe } from "@jest/globals";

import { logIn, sendGetRequestToPath } from "../utils/requests";
import { cleanUpSession, disconnectFromDb, disconnectFromRedis } from "../utils/session";

import type { Header } from "../types";

let authHeaders: Header;

beforeAll(async () => {
  authHeaders = await logIn();
});

afterAll(async () => {
  await cleanUpSession(authHeaders);

  await disconnectFromDb();
  disconnectFromRedis();
});

describe("GET /dashboard/listings", () => {
  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/dashboard/listings`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /listings", () => {
  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/listings`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /listings/search", () => {
  test("returns 400 for no name search param", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/listings/search`,
      header: authHeaders,
    });
    expect(statusCode).toBe(400);
  });

  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/listings/search?address=apple`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

// using default test account, and fresh seeded data will have id:1 associated
// obviously should change this out if changing id from int to uuid

describe("GET /listings/contacts/:contactID", () => {
  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/listings/contacts/1`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /listings/:listingID", () => {
  test("returns 200 for valid request", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/listings/1`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});
