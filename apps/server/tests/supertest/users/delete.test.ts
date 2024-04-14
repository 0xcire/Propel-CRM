import { test, expect, describe } from "@jest/globals";

import { logIn, sendMutationRequestToPath } from "../utils/requests";
import { disconnectFromDb, disconnectFromRedis } from "../utils/session";
import { insertTestUser } from "../utils/test-entities";

import type { Header } from "../types";
import type { User } from "@propel/drizzle";

let authHeaders: Header, testUser: Partial<User>;

beforeAll(async () => {
  testUser = await insertTestUser();

  authHeaders = await logIn(testUser.email, "supertest");
});

afterAll(async () => {
  await disconnectFromDb();
  disconnectFromRedis();
});

describe("DELETE /user/:id", () => {
  test("return 200 for deleted user", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "delete",
      path: `/user/${testUser.id}`,
      header: authHeaders,
    });

    expect(statusCode).toBe(200);
  });
});
