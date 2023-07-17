import type { Request, Response } from "express";

import {
  findUsersByEmail,
  findUsersBySessionToken,
  findUsersByUsername,
  insertNewUser,
  updateUsersByEmail,
} from "../db/queries";

import { checkPassword, createSessionToken, hashPassword } from "../utils";
import { SESSION_COOKIE_LENGTH, SESSION_COOKIE_NAME } from "../config";

import type { NewUser } from "../db/types";
import type { UserInput } from "./types";

// BASIC
// [x] user can sign in and be instructed on incorrect inputs
// [x] user can sign up and be instructed on duplicate email/username
// [x] user can sign out - figure this out
// [] user can delete their own account
// [] user can update their account info

// [] add email verification later
// [] add account recover later

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password }: UserInput = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const userByEmail = await findUsersByEmail({ email: email, signingIn: true });

    if (!userByEmail) {
      return res.status(401).json({
        message: "Account with this email does not exist.",
      });
    }

    const passwordMatches = await checkPassword(password, userByEmail.hashedPassword as string);

    // TODO: after X tries, 'redirect' to account recovery or timeout
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }

    const token = await createSessionToken();

    const updatedUser = await updateUsersByEmail({
      email: email,
      token: token,
      signingIn: true,
    });

    res.cookie(SESSION_COOKIE_NAME as string, token, {
      expires: new Date(Date.now() + Number(SESSION_COOKIE_LENGTH)),
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      message: "signing in",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// successful sign up should redirect user to application
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password }: UserInput = req.body;

    if (!name || !username || !email || !password) {
      return res.sendStatus(400);
    }

    const userByEmail = await findUsersByEmail({ email: email });

    const userByUsername = await findUsersByUsername({ username: username });

    if (userByUsername) {
      return res.status(409).json({
        message: "Username not available. Please pick another.",
      });
    }

    if (userByEmail) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    // create email verification functionality

    const hashedPassword = await hashPassword(password);
    const token = createSessionToken();

    const newUser: NewUser = {
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
      sessionToken: token,
    };
    console.log(newUser);

    const insertedUser = await insertNewUser(newUser);

    res.cookie(SESSION_COOKIE_NAME as string, token, {
      expires: new Date(Date.now() + Number(SESSION_COOKIE_LENGTH)),
      httpOnly: true,
      secure: true,
    });

    return res.status(201).json({
      message: "Signing up.",
      user: insertedUser,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

// return status code on success and redirect based on code?
export const signout = async (req: Request, res: Response) => {
  try {
    const username = req.user.username;
    const sessionToken = req.cookies[SESSION_COOKIE_NAME as string];

    if (!req.cookies) {
      return res.status(204).json({
        message: "Session does not exist.",
      });
    }

    const userByToken = await findUsersBySessionToken(sessionToken);

    if (!userByToken) {
      res.clearCookie("session");
      return res.status(204).json({
        message: "Can't find user.",
      });
    }

    const updatedUser = await updateUsersByEmail({
      email: userByToken.email as string,
      token: "",
    });

    res.clearCookie(SESSION_COOKIE_NAME as string);
    return res.status(204).json({
      message: "Signing out.",
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
