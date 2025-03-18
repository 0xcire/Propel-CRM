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

describe("GET /analytics/sales/:id", () => {
  test("return 200 for valid user", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/analytics/sales/10`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /analytics/years/:id", () => {
  test("return 200 for valid user", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/analytics/years/10`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /analytics/days-on-market/:id", () => {
  test("return 200 for valid user", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/analytics/days-on-market/10`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /analytics/list-sale-ratio/:id", () => {
  test("return 200 for valid user", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/analytics/list-sale-ratio/10`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});

describe("GET /analytics/time-to-close/:id", () => {
  test("return 200 for valid user", async () => {
    const { statusCode } = await sendGetRequestToPath({
      path: `/analytics/time-to-close/10`,
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});
