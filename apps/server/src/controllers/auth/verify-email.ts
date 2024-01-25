import { findUsersByID, updateUserByID } from "@propel/drizzle";
import { deleteRedisKV, getValueFromRedisKey } from "@propel/redis";

import { createVerifyEmailSessionAndSendEmail } from "../../utils";

import type { Request, Response } from "express";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Request token required.",
      });
    }

    const userID = await getValueFromRedisKey(token as string);

    if (!userID) {
      return res.status(400).json({
        message: "Verify email request expired.",
      });
    }

    const updatedUser = await updateUserByID({
      id: +userID,
      verified: true,
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "There was an issue verifying your email. Please try again.",
      });
    }

    await deleteRedisKV(token as string);

    return res.status(200).json({
      message: "Email verified.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

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

    await createVerifyEmailSessionAndSendEmail(userID, userByID.email);

    return res.status(200).json({
      message: "New verification email is on it's way",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
