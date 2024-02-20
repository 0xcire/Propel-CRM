import dayjs from "dayjs";

import { deleteTemporaryRequest, findUsersByEmail, getTempRequestFromToken, updateUserByID } from "@propel/drizzle";
import { deleteRateLimit, limiterByEmailForAccountRecovery } from "@propel/redis";
import { hashPassword } from "@propel/lib";

import { PropelHTTPError } from "../../lib/http-error";

import { createRecoverPasswordRequestAndSendEmail, handleError } from "../../utils";

import { SALT_ROUNDS } from "../../config";

import type { Request, Response } from "express";

export const requestPasswordRecovery = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const userByEmail = await findUsersByEmail({ email: email });

    if (!userByEmail) {
      return res.status(200).json({
        message: "Incoming! Password reset email heading your way.",
      });
    }

    await deleteRateLimit(limiterByEmailForAccountRecovery, email);
    await createRecoverPasswordRequestAndSendEmail(userByEmail.id, userByEmail.email);

    return res.status(200).json({
      message: "Incoming! Password reset email heading your way.",
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getValidRecoveryRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Recovery request ID required.",
      });
    }

    const tempRequest = await getTempRequestFromToken(id);

    if (!tempRequest) {
      throw new PropelHTTPError({
        code: "NOT_FOUND",
        message: "Request expired.",
      });
    }

    if (!dayjs().isBefore(dayjs(tempRequest.expiry))) {
      await deleteTemporaryRequest({ id: id });

      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Request expired.",
      });
    }

    res.setHeader("Referrer-Policy", "no-referrer");
    return res.status(200).json({});
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateUserFromAccountRecovery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!id) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Request ID required.",
      });
    }

    const tempRequest = await getTempRequestFromToken(id);

    if (!tempRequest || !tempRequest.userID) {
      throw new PropelHTTPError({
        code: "NOT_FOUND",
        message: "Request expired.",
      });
    }

    if (!dayjs().isBefore(dayjs(tempRequest.expiry))) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "Request expired.",
      });
    }

    const hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));

    const updatedUser = await updateUserByID({
      id: +tempRequest.userID,
      newPassword: hashedPassword,
    });

    if (!updatedUser) {
      throw new PropelHTTPError({
        code: "INTERNAL_SERVER_ERROR",
        message: "There was an error updating your account. Please try again.",
      });
    }

    await deleteTemporaryRequest({ id: id });

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    return handleError(error, res);
  }
};
