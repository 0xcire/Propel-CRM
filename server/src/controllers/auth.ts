import type { Request, Response } from "express";
import { db } from "../db";
import { users, type User, type NewUser } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { checkPassword, createSessionToken, hashPassword } from "../utils";

// BASIC
// [x] user can sign in and be instructed on incorrect inputs
// [x] user can sign up and be instructed on duplicate email/username
// [x] user can sign out - figure this out
// [] user can delete their own account
// [] user can update their account info

// [] users are sent an email verification on sign up, and cannot sign in if not verified
// [] users can recover password if they input incorrectly X times on sign in
// ^ or recover password if on sign up, inputting an existing email

// extract
type UserResponse = Pick<User, "username" | "email" | "hashedPassword">;
type UserInput = {
  name?: string | undefined;
  username?: string | undefined;
  email: string | undefined;
  password: string | undefined;
};

// able to sign in via username or email
// if user cant be found via email -> render link to sign up: "account doesn't exist, create one here"
export const signin = async (req: Request, res: Response) => {
  // check for email verification
  try {
    const { email, password }: UserInput = req.body;

    // client side validation handles this case, dont need to return message
    if (!email || !password) {
      return res.sendStatus(400);
    }

    // extract
    const userArray: Array<UserResponse> = await db
      .select({
        username: users.username,
        email: users.email,
        hashedPassword: users.hashedPassword,
      })
      .from(users)
      .where(eq(users.email, email));
    const userByEmail = userArray[0];

    // 'redirect' to sign up page
    if (!userByEmail) {
      return res.status(401).json({
        message: "Account with this email does not exist.",
      });
    }

    const passwordMatches = await checkPassword(password, userByEmail.hashedPassword);

    // after X tries, 'redirect' to account recovery
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }

    // increase this and extract
    const THIRTY_MINUTES = 1800000;
    const token = await createSessionToken();

    const user = await db
      .update(users)
      .set({
        sessionToken: token,
        lastLogin: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(users.email, email))
      .returning({
        id: users.id,
        username: users.username,
        name: users.name,
        email: users.email,
        lastLogin: users.lastLogin,
      });

    res.cookie("session", token, {
      expires: new Date(Date.now() + THIRTY_MINUTES),
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({ message: "signing in", user: user[0] });
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

    // extract
    const userByEmail: Array<Pick<UserResponse, "email">> = await db
      .select({
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email));

    const userByUsername: Array<Pick<UserResponse, "username">> = await db
      .select({
        username: users.username,
      })
      .from(users)
      .where(eq(users.username, username));

    if (userByUsername[0]) {
      return res.status(409).json({
        message: "Username not available. Please pick another.",
      });
    }

    // 'redirect' to sign up or account recovery
    if (userByEmail[0]) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    // extract into helpers
    const insertUser = async (user: NewUser) => {
      return db.insert(users).values(user).returning({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
      });
    };

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

    const user = await insertUser(newUser);

    // extract
    const THIRTY_MINUTES = 1800000;
    res.cookie("session", token, {
      expires: new Date(Date.now() + THIRTY_MINUTES),
      httpOnly: true,
      secure: true,
    });

    return res.status(201).json({
      message: "Signing up.",
      user: user[0],
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
    const sessionToken = req.cookies["session"];

    if (!req.cookies) {
      return res.status(204).json({
        message: "Session does not exist.",
      });
    }

    // extract
    const userByToken = await db.select().from(users).where(eq(users.sessionToken, sessionToken));

    if (!userByToken) {
      res.clearCookie("session");
      return res.status(204).json({
        message: "Can't find user.",
      });
    }

    //extract
    await db
      .update(users)
      .set({
        sessionToken: "",
      })
      .where(eq(users.sessionToken, sessionToken));

    res.clearCookie("session");
    return res.status(204).json({
      message: "Signing out.",
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
