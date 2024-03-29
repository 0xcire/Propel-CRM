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
import { isDeployed } from "../utils";
import { ABSOLUTE_SESSION_COOKIE, SALT_ROUNDS, sessionRelatedCookies } from "../config";

import type { Request, Response } from "express";

// TODO: have some stuff here being repeated with auth controller, consider extracting

export const getMyInfo = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;

    const userByID = await findUsersByID({
      id: id,
      requestingInfo: true,
    });

    if (!userByID) {
      return res.status(204).json({
        message: "Can't find user.",
      });
    }

    return res.status(200).json({
      message: "Found user.",
      user: userByID,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sessionToken = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];

    await deleteRedisKV(sessionToken);

    // TODO: in future, need to also delete all related rows in other tables
    const deletedUser = await deleteUserByID(+(id as string));

    sessionRelatedCookies.forEach((cookie) => {
      res.clearCookie(cookie, {
        path: "/",
        domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
        sameSite: "lax",
      });
    });

    res.clearCookie("idle", {
      path: "/",
      domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "successfully deleted.",
      user: deletedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, verifyPassword, password } = req.body;

    let hashedPassword;

    if (!verifyPassword) {
      return res.status(401).json({
        message: "Verify password to confirm changes.",
      });
    }

    const currentUser = await findUsersByID({ id: +(id as string), updating: true });

    if (password) {
      hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));

      const passwordMatches = await checkPassword(password, currentUser?.hashedPassword as string);

      if (passwordMatches) {
        return res.status(409).json({
          message: "Password can't match previous one.",
        });
      }
    }

    const passwordVerified = await checkPassword(verifyPassword, currentUser?.hashedPassword as string);

    if (!passwordVerified) {
      return res.status(409).json({
        message: "Enter your password correctly to confirm changes.",
      });
    }

    if (username) {
      const userByUsername = await findUsersByUsername(username);

      if (userByUsername) {
        return res.status(409).json({
          message: "Username is taken. Please pick another.",
        });
      }
    }

    if (email) {
      const userByEmail = await findUsersByEmail({ email: email });

      if (userByEmail) {
        return res.status(409).json({
          message: "Email is already taken. Please pick another.",
        });
      }
    }

    const updatedUser = await updateUserByID({
      id: +(id as string),
      newUsername: username,
      newEmail: email,
      newPassword: hashedPassword,
    });

    return res.status(200).json({
      message: "Updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
