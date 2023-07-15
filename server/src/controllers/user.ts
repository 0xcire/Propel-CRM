import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getMyInfo = async (req: Request, res: Response) => {
  try {
    const username = req.user.username;

    // TODO: [] inefficient
    const findUserByUsername = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        lastLogin: users.lastLogin,
      })
      .from(users)
      .where(eq(users.username, username));

    const user = findUserByUsername[0];

    // if (!user) {
    //   return res.status(204).json({
    //     message: "Can't find user.",
    //   });
    // }

    return res.status(200).json({
      message: "Found user.",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  // middleware isOwner
  // db delete where...
};

export const updateUser = async (req: Request, res: Response) => {
  // middleware isOwner
  // db update set where
};
