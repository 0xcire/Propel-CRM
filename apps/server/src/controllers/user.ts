import { deleteRedisKV } from "@propel/redis";
import {
  deleteUserByID,
  findUsersByEmail,
  findUsersByID,
  findUsersByUsername,
  updateUserByID,
  //
} from "@propel/drizzle";
import { checkPassword, hashPassword } from "@propel/lib";

import { handleError, removeAuthSessionCookies } from "../utils";
import { PropelHTTPError } from "../lib/http-error";

import { ABSOLUTE_SESSION_COOKIE, SALT_ROUNDS } from "../config";

import type { Request, Response } from "express";

export const getMyInfo = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;

    const userByID = await findUsersByID({
      id: id,
      requestingInfo: true,
    });

    if (!userByID) {
      throw new PropelHTTPError({
        code: "NOT_FOUND",
        message: "Can't find user.",
      });
    }

    return res.status(200).json({
      message: "Found user.",
      user: userByID,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sessionToken = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];

    await deleteRedisKV(sessionToken);

    const deletedUser = await deleteUserByID(+(id as string));

    removeAuthSessionCookies(req, res);

    return res.status(200).json({
      message: "successfully deleted.",
      user: deletedUser,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, verifyPassword, password } = req.body;

    if (!id) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "User ID required.",
      });
    }

    let hashedPassword;

    if (!verifyPassword) {
      throw new PropelHTTPError({
        code: "UNAUTHORIZED",
        message: "Verify password to confirm changes",
      });
    }

    const currentUser = await findUsersByID({ id: +(id as string), updating: true });

    if (password) {
      hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));

      const passwordMatches = await checkPassword(password, currentUser?.hashedPassword as string);

      if (passwordMatches) {
        throw new PropelHTTPError({
          code: "CONFLICT",
          message: "Password can't match previous one.",
        });
      }
    }

    const passwordVerified = await checkPassword(verifyPassword, currentUser?.hashedPassword as string);

    if (!passwordVerified) {
      throw new PropelHTTPError({
        code: "CONFLICT",
        message: "Enter your password correctly to confirm changes.",
      });
    }

    if (username) {
      const userByUsername = await findUsersByUsername(username);

      if (userByUsername) {
        throw new PropelHTTPError({
          code: "CONFLICT",
          message: "Username is taken. Please pick another.",
        });
      }
    }

    if (email) {
      const userByEmail = await findUsersByEmail({ email: email });

      if (userByEmail) {
        throw new PropelHTTPError({
          code: "CONFLICT",
          message: "Email is already taken. Please pick another.",
        });
      }
    }

    const updatedUser = await updateUserByID({
      id: +id,
      newUsername: username,
      newEmail: email,
      newPassword: hashedPassword,
    });

    return res.status(200).json({
      message: "Updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
