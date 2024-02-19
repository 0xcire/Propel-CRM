import { NewUser, findUsersByEmail, findUsersByUsername, insertNewUser } from "@propel/drizzle";
import { hashPassword } from "@propel/lib";

import { PropelHTTPError } from "../../lib/http-error";

import {
  createToken,
  persistAuthSession,
  removePreAuthCookies,
  setAuthSessionCookies,
  createVerifyEmailRequestAndSendEmail,
  handleError,
} from "../../utils";

import { SALT_ROUNDS } from "../../config";

import type { Request, Response } from "express";
import type { UserInput } from "../types";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password }: UserInput = req.body;

    if (!name || !username || !email || !password) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "All fields required.",
      });
    }

    const userByUsername = await findUsersByUsername(username);
    if (userByUsername) {
      throw new PropelHTTPError({
        code: "CONFLICT",
        message: "Username not available. Please pick another.",
      });
    }

    const userByEmail = await findUsersByEmail({ email: email });
    if (userByEmail) {
      throw new PropelHTTPError({
        code: "CONFLICT",
        message: "Email already exists.",
      });
    }

    const hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));
    const newUser: NewUser = {
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
    };
    const insertedUser = await insertNewUser(newUser);

    if (!insertedUser) {
      throw new PropelHTTPError({
        code: "BAD_REQUEST",
        message: "There was an error creating your account. Please try again.",
      });
    }

    const sessionID = createToken(64);

    await persistAuthSession(req, sessionID, insertedUser.id);
    await createVerifyEmailRequestAndSendEmail(insertedUser.id, insertedUser.email);

    removePreAuthCookies(req, res);
    setAuthSessionCookies(req, res, sessionID);

    return res.status(201).json({
      message: "Signing up.",
      user: insertedUser,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
