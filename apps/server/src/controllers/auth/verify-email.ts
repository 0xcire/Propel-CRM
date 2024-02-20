import dayjs from "dayjs";

import { deleteTemporaryRequest, getTempRequestFromToken, updateUserByID } from "@propel/drizzle";
import { deleteRateLimit, limiterByUserIDForAccountVerification } from "@propel/redis";

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

export const requestNewEmailVerification = async (req: Request, res: Response) => {
  try {
    const { id: userID, email } = req.user;

    if (!email) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "There was a problem processing your request. Please try again.",
      });
    }

    await deleteRateLimit(limiterByUserIDForAccountVerification, userID.toString());
    await createVerifyEmailRequestAndSendEmail(userID, email);

    return res.status(200).json({
      message: "New verification email is on it's way",
    });
  } catch (error) {
    return handleError(error, res);
  }
};
