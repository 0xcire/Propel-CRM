import { test, expect, describe } from "@jest/globals";

import { logIn, sendMutationRequestToPath } from "../utils/requests";
import { disconnectFromDb, disconnectFromRedis } from "../utils/session";
import { insertTestUser, removeTestUserAndSession } from "../utils/test-entities";

import type { Header } from "../types";
import type { User } from "@propel/drizzle";

let authHeaders: Header, testUser: Partial<User>;

beforeAll(async () => {
  testUser = await insertTestUser();
  authHeaders = await logIn(testUser.email, "supertest");
});

afterAll(async () => {
  await removeTestUserAndSession(testUser, authHeaders);

  await disconnectFromDb();
  disconnectFromRedis();
});

describe("PATCH /user/:id", () => {
  test("return 409 for wrong password", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "patch",
      path: `/user/${testUser.id}`,
      data: {
        verifyPassword: "notsupertest",
        username: "KFC",
      },
      header: authHeaders,
    });
    expect(statusCode).toBe(409);
  });

  test("return 409 for taken username", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "patch",
      path: `/user/${testUser.id}`,
      data: {
        verifyPassword: "supertest",
        username: "test123",
      },
      header: authHeaders,
    });
    expect(statusCode).toBe(409);
  });

  test("return 409 for taken email", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "patch",
      path: `/user/${testUser.id}`,
      data: {
        verifyPassword: "supertest",
        email: "test@gmail.com",
      },
      header: authHeaders,
    });
    expect(statusCode).toBe(409);
  });

  test("return 409 for same password", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "patch",
      path: `/user/${testUser.id}`,
      data: {
        verifyPassword: "supertest",
        password: "supertest",
      },
      header: authHeaders,
    });
    expect(statusCode).toBe(409);
  });

  test("return 200 for updated user", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "patch",
      path: `/user/${testUser.id}`,
      data: {
        verifyPassword: "supertest",
        username: "KFC123",
      },
      header: authHeaders,
    });
    expect(statusCode).toBe(200);
  });
});
