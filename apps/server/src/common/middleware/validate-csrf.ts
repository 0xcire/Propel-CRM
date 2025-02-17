import { timingSafeEqual } from "node:crypto";
import { PropelHTTPError } from "../../lib/http-error";
import { CSRF_SECRET, PRE_AUTH_CSRF_SECRET, PRE_AUTH_SESSION_COOKIE } from "../config";
import { deriveSessionCSRFToken, handleError, isDeployed } from "../utils";

import type { Request, Response, NextFunction } from "express";
import type { MiddlewareResponse } from "./types";

export class ValidateCsrfMiddleware {
  public validateCsrf = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse> => {
    try {
      const receivedCSRFToken = req.headers["x-propel-csrf"] as string;
      const preAuthSession = req.signedCookies[PRE_AUTH_SESSION_COOKIE];
      const { id: sessionID } = req.session;

      if (req.method !== "DELETE" && !req.is("application/json")) {
        throw new PropelHTTPError({
          code: "BAD_REQUEST",
          message: "Unsupported content type;",
        });
      }

      if (isDeployed(req)) {
        if (
          req.get("Referer") !== "https://propel-crm.xyz/" &&
          req.get("origin") !== "https://propel-crm.xyz"
        ) {
          throw new PropelHTTPError({
            code: "BAD_REQUEST",
            message: "Invalid client",
          });
        }
      }

      if (!receivedCSRFToken) {
        throw new PropelHTTPError({
          code: "FORBIDDEN",
          message: "Invalid CSRF Token",
        });
      }

      let receivedCSRFTokenBuffer;
      let csrfTokenExpectedBuffer;

      // [ ]: research necessity to differentiate secrets here
      if (preAuthSession) {
        receivedCSRFTokenBuffer = Buffer.from(receivedCSRFToken);
        csrfTokenExpectedBuffer = Buffer.from(
          deriveSessionCSRFToken(PRE_AUTH_CSRF_SECRET, sessionID)
        );
      } else {
        receivedCSRFTokenBuffer = Buffer.from(receivedCSRFToken);
        csrfTokenExpectedBuffer = Buffer.from(
          deriveSessionCSRFToken(CSRF_SECRET, sessionID)
        );
      }

      if (!this.safeCompare(receivedCSRFTokenBuffer, csrfTokenExpectedBuffer)) {
        throw new PropelHTTPError({
          code: "FORBIDDEN",
          message: "Invalid CSRF Token",
        });
      }

      return next();
    } catch (error) {
      return handleError(error, res);
    }
  }

  private safeCompare(a: Buffer, b: Buffer) {
    return (a.length === b.length) && timingSafeEqual(a, b);
  }
}