import type { Request, Response } from "express";
import { db } from "../db";
import { users, type User, type NewUser } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { checkPassword, createSessionToken, hashPassword } from "../utils";
import { timestamp } from "drizzle-orm/pg-core";

// [] handle links between sign in and sign up
// [] general: cookies, sessions, authentication, hashing, salting, bcrypt
// [] sign in: forgot password flow, phone # account recovery
// [] figure out redirects, protected routes, etc

// BASIC
// [x] user can sign in and be instructed on incorrect inputs
// [x] user can sign up and be instructed on duplicate email/username
// [x] user can sign out - figure this out
// [] user can delete their own account
// [] user can update their account info

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
  try {
    const { email, password }: UserInput = req.body;

    if (!email || !password) {
      // "please fill out all fields"
      return res.sendStatus(400);
    }

    // extract
    const user: Array<UserResponse> = await db
      .select({
        username: users.username,
        email: users.email,
        hashedPassword: users.hashedPassword,
      })
      .from(users)
      .where(eq(users.email, email));
    // console.log(user[0].hashedPassword);

    if (!user[0].email) {
      // "No account with this email. Sign up here."
      return res.sendStatus(401);
    }

    const passwordMatches = await checkPassword(password, user[0].hashedPassword);
    // delete req.body.password; ?

    if (!passwordMatches) {
      console.log("stop right there");
      return res.sendStatus(401);
    }

    // sign in logic here

    const THIRTY_MINUTES = 1800000;
    const token = await createSessionToken();

    // await db.update(users).set({ sessionToken: token, lastLogin: sql`current_timestampz` }).where(eq(users.email, email));

    await db.update(users).set({ sessionToken: token }).where(eq(users.email, email));

    res.cookie("session", token, {
      expires: new Date(Date.now() + THIRTY_MINUTES),
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json("signing in").end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// successful sign up should redirect user to application
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password }: UserInput = req.body;

    if (!name || !username || !email || !password) {
      // "please fill out all fields"
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
      // "username not available, please pick another"
      return res.sendStatus(409);
    }

    if (userByEmail[0]) {
      // "email already exists. recover your password here."
      return res.sendStatus(409);
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

    const hashedPassword = await hashPassword(password);

    const token = createSessionToken();

    const newUser: NewUser = {
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
      sessionToken: token,
    };

    await insertUser(newUser);

    const THIRTY_MINUTES = 1800000;
    res.cookie("session", token, {
      expires: new Date(Date.now() + THIRTY_MINUTES),
      httpOnly: true,
      secure: true,
    });

    return res.status(201).json("signing up").end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// return status code on success and redirect based on code?
export const signout = async (req: Request, res: Response) => {
  try {
    const username = req.user.username;

    await db.update(users).set({ sessionToken: "" }).where(eq(users.username, username));

    res.clearCookie("session");
    // return a 300 code?
    return res.status(200).json("signing out").end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
