import { randomUUID } from "crypto";
import { test, expect, describe } from "@jest/globals";
import dayjs from "dayjs";

import { createRequestAndDeleteRedundancy, deleteTemporaryRequest, queryClient } from "@propel/drizzle";
import { sendGetRequestToPath } from "../utils/requests";
import { getHeaderFromResponse } from "../utils/headers";

const FAKE_REQUEST_ID = "347458c6-e7b9-4ad7-b71b-1e8e3e365a86";

afterAll(async () => {
  await queryClient.end();
});

describe("GET /auth/recovery/:id", () => {
  test("return 404 for no found temp_request", async () => {
    const header = await getHeaderFromResponse();

    const { statusCode, body } = await sendGetRequestToPath({
      path: `/auth/recovery/${FAKE_REQUEST_ID}`,
      header: header,
    });

    expect(statusCode).toBe(404);
    expect(body.message).toBe("Request expired.");
  });

  test("return 401 for expired temp_request", async () => {
    const requestID = randomUUID();

    await createRequestAndDeleteRedundancy({
      id: requestID,
      expiry: dayjs().subtract(1, "hour").toDate(),
      userEmail: "test@gmail.com",
      userID: 10,
    });

    const header = await getHeaderFromResponse();

    const { statusCode, body } = await sendGetRequestToPath({
      path: `/auth/recovery/${requestID}`,
      header: header,
    });

    expect(statusCode).toBe(401);
    expect(body.message).toBe("Request expired.");

    // delete clean up handled in getValidRecoveryRequest controller
  });

  test("return 200 for valid temp_request", async () => {
    const requestID = randomUUID();

    await createRequestAndDeleteRedundancy({
      id: requestID,
      expiry: dayjs().add(1, "hour").toDate(),
      userEmail: "test@gmail.com",
      userID: 10,
    });

    const header = await getHeaderFromResponse();

    const { statusCode } = await sendGetRequestToPath({
      path: `/auth/recovery/${requestID}`,
      header: header,
    });

    expect(statusCode).toBe(200);

    deleteTemporaryRequest({ id: requestID });
  });
});
