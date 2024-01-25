import { findUsersByEmail, updateUserByID } from "@propel/drizzle";
import {
  RateLimiterRes,
  consumeRateLimitPoint,
  deleteRedisKV,
  getRateLimiter,
  getValueFromRedisKey,
} from "@propel/redis";
import { hashPassword } from "@propel/lib";

import { handleRateLimitErrorResponse, validateRateLimitAndSetResponse } from "../../lib";
import { createRecoverPasswordSessionAndSendEmail } from "../../utils";

import { SALT_ROUNDS } from "../../config";

import type { Request, Response } from "express";

export const requestPasswordRecovery = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const recoveryIdentifier = `${email}-recovery`;

    const rateLimiter = await getRateLimiter(recoveryIdentifier);
    validateRateLimitAndSetResponse(rateLimiter, res);

    const userByEmail = await findUsersByEmail({ email: email });
    await consumeRateLimitPoint(recoveryIdentifier);

    if (!userByEmail) {
      return res.status(200).json({
        message: "Incoming! Password reset email heading your way.",
      });
    }

    await createRecoverPasswordSessionAndSendEmail(userByEmail.id, userByEmail.email);

    return res.status(200).json({
      message: "Incoming! Password reset email heading your way.",
    });
  } catch (error) {
    console.log(error);

    if (error instanceof RateLimiterRes) {
      return handleRateLimitErrorResponse(error, res);
    }
    return res.status(500).json({
      message: "There was an error processing your request. Please try again.",
    });
  }
};

export const getValidRecoveryRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Recovery request ID needed." });
    }

    const value = await getValueFromRedisKey(id);

    if (!value) {
      return res.status(404).json({
        message: "Request expired.",
      });
    }

    res.setHeader("Referrer-Policy", "no-referrer");
    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "" });
  }
};

export const updateUserFromAccountRecovery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Request ID needed." });
    }

    const userID = await getValueFromRedisKey(id);

    if (!userID) {
      return res.status(404).json({
        message: "Request expired.",
      });
    }

    const hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));

    const updatedUser = await updateUserByID({
      id: +userID,
      newPassword: hashedPassword,
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: "There was an error updating your account. Please try again.",
      });
    }

    await deleteRedisKV(id);

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "" });
  }
};
