import { deleteRedisSession, setRedisSession } from "../redis";
import { findUsersByEmail, findUsersByUsername, insertNewUser } from "../db/queries/user";
import { checkPassword, createSecureCookie, createSessionToken, hashPassword } from "../utils";
import {
  IDLE_SESSION_COOKIE,
  ABSOLUTE_SESSION_COOKIE,
  IDLE_SESSION_LENGTH,
  ABSOLUTE_SESSION_LENGTH,
} from "../config/index";

import type { Request, Response } from "express";
import type { NewUser } from "../db/types";
import type { UserInput } from "./types";

// TODO: add email verification later
// TODO: add account recovery later

// TODO: signin = async(req,res): Promise<PropelResponse>

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

    const sessionID = createSessionToken();

    // [ ]: set up rate limit to prevent brute force, mentioned above in above todo

    // TODO: CSRF
    // [ ]: add CSRF-CSRF middleware
    // [ ]: figure out CORS config
    // [ ]: compare header technique.. owasp
    // [ ]: protect against state change endpoints...

    // [ ]: allow user to terminate extraneous sessions
    // ex. user logs into acct on multiple devices
    // currently session is invalidated, but, old sessionID exists in redis for TTL

    createSecureCookie({
      res: res,
      name: ABSOLUTE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    createSecureCookie({
      res: res,
      name: IDLE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(IDLE_SESSION_LENGTH as string),
    });

    await setRedisSession(sessionID, userByEmail.id as number, +(ABSOLUTE_SESSION_LENGTH as string));

    return res.status(200).json({
      message: "signing in",
      user: userByEmail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password }: UserInput = req.body;

    if (!name || !username || !email || !password) {
      return res.sendStatus(400);
    }

    const userByEmail = await findUsersByEmail({ email: email });

    const userByUsername = await findUsersByUsername(username);

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
    // TODO: this along with a password reset, would be a good usecase for jwt!

    const hashedPassword = await hashPassword(password);
    const sessionID = createSessionToken();

    const newUser: NewUser = {
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
    };

    const insertedUser = await insertNewUser(newUser);

    await setRedisSession(sessionID, insertedUser.id as number, +(ABSOLUTE_SESSION_LENGTH as string));

    createSecureCookie({
      res: res,
      name: ABSOLUTE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    createSecureCookie({
      res: res,
      name: IDLE_SESSION_COOKIE as string,
      value: sessionID,
      age: +(IDLE_SESSION_LENGTH as string),
    });

    return res.status(201).json({
      message: "Signing up.",
      user: insertedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];

    await deleteRedisSession(sessionToken);

    res.clearCookie(ABSOLUTE_SESSION_COOKIE, {
      domain: "localhost",
      path: "/",
      sameSite: "strict",
    });
    res.clearCookie(IDLE_SESSION_COOKIE, {
      domain: "localhost",
      path: "/",
      sameSite: "strict",
    });

    return res.status(204).json({
      message: "Signing out.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
