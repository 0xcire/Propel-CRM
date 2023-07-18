import type { Request, Response, NextFunction } from "express";
import { findUsersBySessionToken } from "../db/queries";
import { SESSION_COOKIE_NAME } from "../config";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME as string];

    if (!sessionToken) {
      return res.status(403).json({
        message: "Session does not exist",
      });
    }

    // extract
    const userByToken = await findUsersBySessionToken(sessionToken);

    if (!userByToken) {
      return res.status(403).json({
        message: "Can't find user.",
      });
    }

    if (userByToken.id && userByToken.username) {
      req.user = {
        id: userByToken.id,
        username: userByToken.username,
      };
    }

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
