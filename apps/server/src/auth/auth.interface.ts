import type { Request, Response, NextFunction } from "express";
import type { MiddlewareResponse } from "../common/middleware/types";
import type { UserInput, ZUser } from "./types";
import type { Ctx } from '../types';

export interface IAuthService {
    // TODO: technically this could be user: UserInput too
    signIn(email: string, password: string, ctx: Ctx): Promise<ZUser>;
    signUp(user: UserInput, ctx: Ctx): Promise<ZUser>;
    signOut(ctx: Ctx): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    initNewEmailVerification(userId: number, email: string): Promise<void>;
    initAccountRecovery(email: string): Promise<void>;
    validateTempRecoverySession(tempSessionId: string): Promise<void> // TODO: is this needed?
    updateUserFromAccountRecovery(id: string, plainTextPass: string): Promise<void>
}

export interface IRateLimitMiddleware {
    accountRecoveryRl(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<MiddlewareResponse>;
    accountVerificationRl(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<MiddlewareResponse>;
    signInRl(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<MiddlewareResponse>;
  }