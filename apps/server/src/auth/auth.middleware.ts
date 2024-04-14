import type { Request, Response, NextFunction } from "express";

export class AuthMiddleware {
  public isAccountOwner() {
    return (_req: Request, _res: Response, next: NextFunction) => {
      next();
    };
  }

  public isAuth() {
    return (_req: Request, _res: Response, next: NextFunction) => {
      next();
    };
  }

  public validateCSRF() {
    return (_req: Request, _res: Response, next: NextFunction) => {
      next();
    };
  }
}

// new AuthMiddleware().isAccountOwner();
