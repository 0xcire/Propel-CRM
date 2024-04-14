import { test, expect, describe } from "@jest/globals";

import { logIn, sendGetRequestToPath } from "../utils/requests";
import { cleanUpSession, disconnectFromRedis } from "../utils/session";

import type { Header } from "../types";

let authHeaders: Header;

beforeAll(async () => {
  authHeaders = await logIn();
});

afterAll(async () => {
  await cleanUpSession(authHeaders);
  disconnectFromRedis();
});

describe("GET /user/refresh", () => {
  test("return 200 for refresh", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/user/refresh`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

// 404 handling more of a type narrow, validateSession would throw before
describe("GET /user/me", () => {
  test("return 200 for refresh", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/user/me`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});
