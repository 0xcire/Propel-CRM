import type { Request, Response, NextFunction } from "express";

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
    console.log(req);
    if ("this is a string") {
      res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
