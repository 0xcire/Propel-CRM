import { test, expect, describe } from "@jest/globals";

import { randomUUID } from "crypto";
import dayjs from "dayjs";

import { sendGetRequestToPath } from "../utils/requests";

import { createRequestAndDeleteRedundancy, deleteTemporaryRequest, queryClient } from "@propel/drizzle";

afterAll(async () => {
  // await disconnectFromDb() not working here??
  await queryClient.end();
});

describe("GET /auth/recovery/:id", () => {
  test("return 404 for no found temp_request", async () => {
    const FAKE_REQUEST_ID = "347458c6-e7b9-4ad7-b71b-1e8e3e365a86";

    const { statusCode } = await sendGetRequestToPath({
      path: `/auth/recovery/${FAKE_REQUEST_ID}`,
    });

    expect(statusCode).toBe(404);
  });

  test("return 401 for expired temp_request", async () => {
    const requestID = randomUUID();
    const tempRequest = await createRequestAndDeleteRedundancy({
      id: requestID,
      expiry: dayjs().subtract(1, "hour").toDate(),
      userEmail: "test@gmail.com",
      userID: 10,
    });

    const { statusCode } = await sendGetRequestToPath({
      path: `/auth/recovery/${tempRequest.id}`,
    });

    expect(statusCode).toBe(401);

    // clean up handled in getValidRecoveryRequest controller
  });

  test("return 200 for valid temp_request", async () => {
    const requestID = randomUUID();
    const tempRequest = await createRequestAndDeleteRedundancy({
      id: requestID,
      expiry: dayjs().add(1, "hour").toDate(),
      userEmail: "test@gmail.com",
      userID: 10,
    });

    const { statusCode } = await sendGetRequestToPath({
      path: `/auth/recovery/${tempRequest.id}`,
    });

    expect(statusCode).toBe(200);

    await deleteTemporaryRequest({ id: tempRequest.id });
  });
});
