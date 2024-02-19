import dayjs from "dayjs";

import {
  deleteTemporaryRequest,
  findUsersByID,
  getAllTempRequestsForUserID,
  getTempRequestFromToken,
  updateUserByID,
} from "@propel/drizzle";

import { PropelHTTPError } from "../../lib/http-error";

import { createVerifyEmailRequestAndSendEmail, handleError } from "../../utils";

import type { Request, Response } from "express";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (typeof token !== "string") {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      });
    }

    if (!token) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Request token required.",
      });
    }

    const tempRequest = await getTempRequestFromToken(token);
    await deleteTemporaryRequest({ id: token });

    if (!tempRequest || !tempRequest.userID) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Request required.",
      });
    }

    if (!dayjs().isBefore(dayjs(tempRequest.expiry))) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Request required.",
      });
    }

    const updatedUser = await updateUserByID({
      id: +tempRequest.userID,
      verified: true,
    });

    if (!updatedUser) {
      throw new PropelHTTPError({
        code: "INTERNAL_SERVER_ERROR",
        message: "There was an issue verifying your email. Please try again.",
      });
    }

    return res.status(200).json({
      message: "Email verified.",
    });
  } catch (error) {
    return handleError(error, res);
  }
};

// rate limit this?
export const requestNewEmailVerification = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const MAX_REQUESTS_AT_A_TIME = 5;

    const userByID = await findUsersByID({ id: userID, verification: true });

    if (!userByID) {
      throw new PropelHTTPError({
        code: "NOT_FOUND",
        message: "Can't find user.",
      });
    }

    if (userByID.isVerified) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "User is already verified.",
      });
    }

    const requests = await getAllTempRequestsForUserID(userID);

    if (requests.length > MAX_REQUESTS_AT_A_TIME) {
      throw new PropelHTTPError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests. Please try again later.",
      });
    }

    await createVerifyEmailRequestAndSendEmail(userID, userByID.email);

    return res.status(200).json({
      message: "New verification email is on it's way",
    });
  } catch (error) {
    return handleError(error, res);
  }
};
