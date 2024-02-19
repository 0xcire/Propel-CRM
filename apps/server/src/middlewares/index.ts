import { PropelHTTPError } from "../lib/http-error";
import { handleError } from "../utils/handle-error";

import type { Request, Response, NextFunction } from "express";

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authenticatedUserID = req.user.id;

    if (!authenticatedUserID) {
      throw new PropelHTTPError({
        code: "FORBIDDEN",
        message: "Not authenticated.",
      });
    }

    if (authenticatedUserID.toString() !== id) {
      throw new PropelHTTPError({
        code: "FORBIDDEN",
        message: "Can only perform this operation on your own account.",
      });
    }

    next();
  } catch (error) {
    return handleError(error, res);
  }
};

// []
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // useless param right now.
    if (req.headers["x"]) {
      res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
