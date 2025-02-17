
import {
  createSecureCookie,
  createToken,
  deriveSessionCSRFToken,
  handleError,
  isDeployed,
} from "../../common/utils";
import {
  ABSOLUTE_SESSION_COOKIE,
  CSRF_COOKIE,
  IDLE_SESSION_COOKIE,
  IDLE_SESSION_LENGTH,
  PRE_AUTH_CSRF_SECRET,
  PRE_AUTH_SESSION_COOKIE,
  PRE_AUTH_SESSION_LENGTH,
} from "../../common/config";
import { PropelHTTPError } from "../../lib/http-error";
import { deleteRedisKV, getValueFromRedisKey } from "@propel/redis";

import type { Request, Response, NextFunction } from "express";
import type { MiddlewareResponse } from "./types";


// TODO: potential clean up of code branching here
export class ValidateSessionMiddleware {
  public validateSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse> => {
    try {
      const absoluteSession: string | undefined =
        req.signedCookies[ABSOLUTE_SESSION_COOKIE];
      const idleSession: string | undefined =
        req.signedCookies[IDLE_SESSION_COOKIE];

      if (absoluteSession && idleSession && absoluteSession !== idleSession) {
        throw new PropelHTTPError({
          code: "FORBIDDEN",
          message: "Session invalid.",
        });
      }

      if (!absoluteSession) {
        if (idleSession) {
          res.clearCookie(IDLE_SESSION_COOKIE, {
            path: "/",
            // TODO: make this env var
            domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
            sameSite: "lax",
          });

          res.clearCookie("idle", {
            path: "/",
            domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
            sameSite: "lax",
          });

          await deleteRedisKV(idleSession);
        }

        req.session = {
          id: "",
        };

        this.initializePreAuthSession(req, res);

        throw new PropelHTTPError({
          code: "FORBIDDEN",
          message: "Session does not exist.",
        });
      }

      if (!idleSession) {
        if (absoluteSession) {
          await deleteRedisKV(absoluteSession);
          res.clearCookie(ABSOLUTE_SESSION_COOKIE, {
            path: "/",
            domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
            sameSite: "lax",
          });

          res.clearCookie(CSRF_COOKIE, {
            path: "/",
            domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
            sameSite: "lax",
          });
        }

        req.session = {
          id: "",
        };

        this.initializePreAuthSession(req, res);

        throw new PropelHTTPError({
          code: "FORBIDDEN",
          message: "Session has timed out",
        });
      }

      const userIDByToken = await getValueFromRedisKey(absoluteSession);

      if (!userIDByToken) {
        throw new PropelHTTPError({
          code: "FORBIDDEN",
          message: "Can't find user.",
        });
      }

      if (userIDByToken) {
        req.user = {
          id: +userIDByToken,
        };

        req.session = {
          id: absoluteSession,
        };

        // reset idle timeout
        createSecureCookie(req, {
          res: res,
          age: +(IDLE_SESSION_LENGTH as string),
          name: IDLE_SESSION_COOKIE,
          value: idleSession,
        });

        res.cookie("idle", String(Date.now()), {
          maxAge: +(IDLE_SESSION_LENGTH as string),
          httpOnly: false,
          sameSite: "lax",
          domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
          secure: true,
        });
      }

      return next();
    } catch (error) {
      return handleError(error, res);
    }
  }

  public async validatePreAuthSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse> {
    try {
      const preAuthSession = req.signedCookies[PRE_AUTH_SESSION_COOKIE];

      if (!preAuthSession) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Session likely timed out. Please refresh the page.",
        });
      }

      req.session = {
        id: preAuthSession,
      };

      return next();
    } catch (error) {
      return handleError(error, res);
    }
  }

  private async initializePreAuthSession(req: Request, res: Response) {
    const preAuthSession = req.signedCookies[PRE_AUTH_SESSION_COOKIE];

    let anonymousSessionTokenID;

    if (!preAuthSession) {
      anonymousSessionTokenID = createToken(32);
      createSecureCookie(req, {
        res: res,
        name: PRE_AUTH_SESSION_COOKIE,
        age: +(PRE_AUTH_SESSION_LENGTH as string),
        value: anonymousSessionTokenID,
      });

      res.cookie(
        CSRF_COOKIE,
        deriveSessionCSRFToken(PRE_AUTH_CSRF_SECRET, anonymousSessionTokenID),
        {
          httpOnly: false,
          secure: true,
          signed: false,
          sameSite: "lax",
          domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
          maxAge: +(PRE_AUTH_SESSION_LENGTH as string),
        }
      );
    }
  }
}
