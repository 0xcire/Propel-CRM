import { redis } from "../redis";
import { createSecureCookie } from "../utils";
import { ABSOLUTE_SESSION_COOKIE, IDLE_SESSION_COOKIE, IDLE_SESSION_LENGTH } from "../config";

import type { Request, Response, NextFunction } from "express";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const absoluteSession = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];
    const idleSession = req.signedCookies[IDLE_SESSION_COOKIE as string];

    if (absoluteSession && idleSession && absoluteSession !== idleSession) {
      return res.status(403).json({
        message: "Session is invalid.",
      });
    }

    if (!absoluteSession) {
      if (idleSession) {
        res.clearCookie(IDLE_SESSION_COOKIE);
        await redis.del(idleSession);
      }

      return res.status(403).json({
        message: "Session does not exist",
      });
    }

    if (!idleSession && !absoluteSession) {
      return res.status(403).json({
        message: "Session is no longer valid.",
      });
    }

    if (!idleSession) {
      if (absoluteSession) {
        await redis.del(absoluteSession);
        res.clearCookie(ABSOLUTE_SESSION_COOKIE);
      }

      return res.status(403).json({
        message: "Session has timed out.",
      });
    }

    const userIDByToken = await redis.get(absoluteSession);

    if (!userIDByToken) {
      return res.status(403).json({
        message: "Can't find user.",
      });
    }

    if (userIDByToken) {
      req.user = {
        id: +userIDByToken,
      };
    }

    // reset idle session
    createSecureCookie({
      res: res,
      age: +(IDLE_SESSION_LENGTH as string),
      name: IDLE_SESSION_COOKIE,
      value: idleSession,
    });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({});
  }
};

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authenticatedUserID = req.user.id;

    if (!authenticatedUserID) {
      return res.status(403).json({
        message: "Not authenticated.",
      });
    }

    if (authenticatedUserID.toString() !== id) {
      return res.status(403).json({
        message: "Can only perform this operation on your own account.",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({});
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
