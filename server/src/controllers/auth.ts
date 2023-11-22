import { deleteRedisSession, setRedisSession } from "../redis";
import { findUsersByEmail, findUsersByUsername, insertNewUser } from "../db/queries/user";
import { checkPassword, createSecureCookie, createToken, deriveSessionCSRFToken, hashPassword } from "../utils";
import {
  IDLE_SESSION_COOKIE,
  ABSOLUTE_SESSION_COOKIE,
  IDLE_SESSION_LENGTH,
  ABSOLUTE_SESSION_LENGTH,
  CSRF_COOKIE,
  sessionRelatedCookies,
  PRE_AUTH_SESSION_COOKIE,
  CSRF_SECRET,
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
    const passwordMatches = await checkPassword(password, userByEmail?.hashedPassword as string);

    if (!userByEmail) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    // TODO: after X tries, 'redirect' to account recovery or timeout
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const sessionID = createToken();

    // [ ]: set up rate limit to prevent brute force, mentioned above in above todo

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

    res.cookie(CSRF_COOKIE, deriveSessionCSRFToken(CSRF_SECRET, sessionID), {
      httpOnly: false,
      secure: true,
      signed: false,
      sameSite: "strict",
      maxAge: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      sameSite: "strict",
    });

    req.session = {
      id: sessionID,
    };

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
    // TODO: this along wth a password reset, would be a good usecase for jwt!

    const hashedPassword = await hashPassword(password);
    const sessionID = createToken();

    const newUser: NewUser = {
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
    };

    const insertedUser = await insertNewUser(newUser);

    await setRedisSession(sessionID, insertedUser.id as number, +(ABSOLUTE_SESSION_LENGTH as string));

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      sameSite: "strict",
    });

    req.session = {
      id: sessionID,
    };

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

    res.cookie(CSRF_COOKIE, deriveSessionCSRFToken(CSRF_SECRET, sessionID), {
      httpOnly: false,
      secure: true,
      signed: false,
      sameSite: "strict",
      maxAge: +(ABSOLUTE_SESSION_LENGTH as string),
    });

    res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
      path: "/",
      sameSite: "strict",
    });

    req.session = {
      id: sessionID,
    };

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

    sessionRelatedCookies.forEach((cookie) => {
      res.clearCookie(cookie, {
        path: "/",
        sameSite: "strict",
      });
    });

    req.session = {
      id: "",
    };

    return res.status(204).json({
      message: "Signing out.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
