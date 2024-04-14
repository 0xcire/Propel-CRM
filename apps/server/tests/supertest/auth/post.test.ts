import { test, expect, describe } from "@jest/globals";

import { sendMutationRequestToPath } from "../utils/requests";
import { cleanUpSession, disconnectFromDb, disconnectFromRedis } from "../utils/session";
import { removeTestUserAndSession } from "../utils/test-entities";

import { findUsersByUsername, deleteTemporaryRequestByEmail } from "@propel/drizzle";
import { deleteRateLimit, limiterByEmailForAccountRecovery, limiterByEmailForSignIn } from "@propel/redis";

afterAll(async () => {
  await disconnectFromDb();
  disconnectFromRedis();
});

describe("POST /auth/signup", () => {
  test("returns 409 for taken username", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signup",
      data: {
        name: "Bill Bob",
        username: `test123`,
        email: "definitelynotfake@email.com",
        password: "YouCantGuessThis123!",
      },
    });
    expect(statusCode).toBe(409);
  });

  test("returns 409 for taken email", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signup",
      data: {
        name: "Bill Bob",
        username: `st${Date.now()}`,
        email: "test@gmail.com",
        password: "YouCantGuessThis123!",
      },
    });
    expect(statusCode).toBe(409);
  });

  test("returns 201 for created (new) user", async () => {
    const now = `st${Date.now()}`;
    const { statusCode, headers } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signup",
      data: {
        name: "Bill Bob",
        username: now,
        email: `${now}@gmail.com`,
        password: "YouCantGuessThis123!",
      },
    });
    expect(statusCode).toBe(201);

    const user = await findUsersByUsername(now);

    if (user) {
      await removeTestUserAndSession(user, headers);
      await deleteTemporaryRequestByEmail({ userEmail: `${now}@gmail.com` });
    }
  });
});

describe("POST /auth/signin", () => {
  test("returns 401 for incorrect email", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signin",

      data: {
        email: "definitelynotfake@email.com",
        password: "YouCantGuessThis123!",
      },
    });
    expect(statusCode).toBe(401);

    await deleteRateLimit(limiterByEmailForSignIn, "definitelynotfake@email.com");
  });

  test("returns 401 for incorrect password", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signin",

      data: {
        email: "test@gmail.com",
        password: "YouCantGuessThis123!",
      },
    });
    expect(statusCode).toBe(401);
  });

  test("returns 200 for success", async () => {
    const { statusCode, headers } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signin",

      data: {
        email: "test@gmail.com",
        password: "testtest",
      },
    });
    expect(statusCode).toBe(200);

    await cleanUpSession(headers);
  });
});

describe("POST /auth/signout", () => {
  test("returns 200 when user signs out", async () => {
    const { headers } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signin",
      data: {
        email: "test@gmail.com",
        password: "testtest",
      },
    });

    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signout",
      header: headers,
    });
    expect(statusCode).toBe(200);
  });
});

describe("POST /auth/recovery", () => {
  test("return 200 for non existing email", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/recovery",
      data: {
        email: "fugazi@email.com",
      },
    });
    expect(statusCode).toBe(200);

    await deleteRateLimit(limiterByEmailForAccountRecovery, "fugazi@email.com");
  });

  test("return 200 for existing email", async () => {
    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/recovery",
      data: {
        email: "test@email.com",
      },
    });
    expect(statusCode).toBe(200);

    await deleteRateLimit(limiterByEmailForAccountRecovery, "test@email.com");
  });
});

// methods tested in e2e

// POST /auth/verify-email/:id
// PATCH /auth/recovery/:id
// PATCH /auth/verify-email
