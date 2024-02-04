import { deleteTemporaryRequest, findUsersByID, getTempRequestFromToken, updateUserByID } from "@propel/drizzle";
import dayjs from "@propel/dayjs";

import { createVerifyEmailRequestAndSendEmail } from "../../utils";

import type { Request, Response } from "express";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (typeof token !== "string") {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    if (!token) {
      return res.status(400).json({
        message: "Request token required.",
      });
    }

    const tempRequest = await getTempRequestFromToken(token);

    await deleteTemporaryRequest({ id: token });

    if (!tempRequest || !tempRequest.userID) {
      return res.status(400).json({
        message: "Request expired.",
      });
    }

    if (!dayjs().isBefore(dayjs(tempRequest.expiry))) {
      // [ ]: throw new PropelHTTPError({})
      // [ ]: throw new PropelDBError({status: 500, message: })

      return res.status(400).json({
        message: "Request expired.",
      });
    }

    const updatedUser = await updateUserByID({
      id: +tempRequest.userID,
      verified: true,
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "There was an issue verifying your email. Please try again.",
      });
    }

    return res.status(200).json({
      message: "Email verified.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

// rate limit this?
export const requestNewEmailVerification = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;

    const userByID = await findUsersByID({ id: userID, verification: true });

    if (!userByID) {
      return res.status(404).json({
        message: "Can't find user.",
      });
    }
    if (userByID.isVerified) {
      return res.status(400).json({
        message: "User is already verified.",
      });
    }

    await createVerifyEmailRequestAndSendEmail(userID, userByID.email);

    return res.status(200).json({
      message: "New verification email is on it's way",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
