import { test, expect, describe } from "@jest/globals";
import { sendMutationRequestToPath } from "../utils/requests";
import { findCookieByName, getHeaderFromResponse, parseCookieForValue } from "../utils/headers";

import { deleteRateLimit, deleteRedisKV, limiterByEmailForSignIn, redisClient } from "@propel/redis";

describe("POST /auth/signin", () => {
  // [x]: 401 for no user by email
  // [x]: 401 for incorrect password
  // [ ]: 200
  // [ ]: test the rate limit?

  afterAll(async () => {
    redisClient.disconnect();
  });
  test("returns 401 for incorrect email", async () => {
    const header = await getHeaderFromResponse();
    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signin",
      header: header,
      data: {
        email: "definitelynotfake@email.com",
        password: "YouCantGuessThis123!",
      },
    });
    expect(statusCode).toBe(401);

    await deleteRateLimit(limiterByEmailForSignIn, "definitelynotfake@email.com");
  });

  test("returns 401 for incorrect password", async () => {
    const header = await getHeaderFromResponse();
    const { statusCode } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signin",
      header: header,
      data: {
        email: "test@gmail.com",
        password: "YouCantGuessThis123!",
      },
    });
    expect(statusCode).toBe(401);
  });

  test("returns 200 for success", async () => {
    const header = await getHeaderFromResponse();
    const { statusCode, headers } = await sendMutationRequestToPath({
      method: "post",
      path: "/auth/signin",
      header: header,
      data: {
        email: "test@gmail.com",
        password: "testtest",
      },
    });
    expect(statusCode).toBe(200);

    const sessionCookie = findCookieByName(
      headers["set-cookie"] as unknown as Array<string>,
      "absolute-propel-session"
    );
    const signedSessionID = parseCookieForValue(sessionCookie);

    const sessionID = decodeURIComponent(signedSessionID.slice(0, signedSessionID.lastIndexOf("."))).slice(2);

    await deleteRedisKV(sessionID);
  });
});

// describe("POST /auth/signout", () => {
//   // [ ]: 200

//   beforeAll(async () => {
//     console.log("hey");
//   });
//   test("hey", async () => {
//     expect(1).toBe(1);
//   });
// });

// describe("POST /auth/recovery", () => {
//   // [ ]: 200 success
//   // [ ]: 200 fail
//   // should purposely be ambiguous
//   test("hey", async () => {
//     expect(1).toBe(1);
//   });
// });

// describe("POST /auth/verify-email/:id", () => {
//   // [ ]: 400 no email -> technically should not be possible...?
//   // [ ]: 200
//   test("hey", async () => {
//     expect(1).toBe(1);
//   });
// });
