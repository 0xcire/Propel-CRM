import { Request, Response, NextFunction } from "express";
import { PropelHTTPError } from "../../lib/http-error";
import { handleError } from "../../common/utils";
import { MiddlewareResponse } from "./types";

export interface IUserPermissionsMiddleware {
  isAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse>;
  isAccountOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse>;
}

export class UserPermissionsMiddleware implements IUserPermissionsMiddleware {
  public async isAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse> {
    try {
      // useless param right now.
      if (req.headers["x"]) {
        res.sendStatus(403);
      }
      next();
    } catch (error) {
      console.log(error);
      return handleError(error, res);
    }
  }
  public async isAccountOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse> {
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
  }
}
