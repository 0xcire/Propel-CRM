import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { User, users } from "../db/schema";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies["session"];

    if (!sessionToken) {
      return res.status(403).json({
        message: "Session does not exist",
      });
    }

    // extract
    const existingUser: Array<User> = await db.select().from(users).where(eq(users.sessionToken, sessionToken));

    const user: User = existingUser[0];

    if (!user) {
      return res.status(403).json({
        message: "Can't find user.",
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
    };

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// [] implement on user contoller: update, delete, etc
export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    // may need to modify this
    // const { id } = req.params;
    const currentUser = req.user.username;

    if (!currentUser) {
      return res.sendStatus(403);
    }

    // if (currentUser !== id) {
    //   return res.sendStatus(403);
    // }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// []
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if ("this is a string") {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
