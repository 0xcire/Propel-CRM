import { Request, Response } from "express";
import { findUsersByUsername } from "../db/queries";

export const getMyInfo = async (req: Request, res: Response) => {
  try {
    const username = req.user.username;

    const userByUsername = await findUsersByUsername({
      username: username,
      requestingInfo: true,
    });

    if (!userByUsername) {
      return res.status(204).json({
        message: "Can't find user.",
      });
    }

    return res.status(200).json({
      message: "Found user.",
      user: userByUsername,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
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
