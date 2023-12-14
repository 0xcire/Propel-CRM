import { deriveSessionCSRFToken, safeComparison } from "../utils";
import { CSRF_SECRET, PRE_AUTH_CSRF_SECRET, PRE_AUTH_SESSION_COOKIE } from "../config";

import type { Request, Response, NextFunction } from "express";

export const validateCSRF = (req: Request, res: Response, next: NextFunction) => {
  try {
    const receivedCSRFToken = req.headers["x-propel-csrf"] as string;
    const preAuthSession = req.signedCookies[PRE_AUTH_SESSION_COOKIE];
    const { id: sessionID } = req.session;

    if (req.method !== "DELETE" && !req.is("application/json")) {
      return res.status(400).json({
        message: "Unsupported content type.",
      });
    }

    if (req.get("Referer") !== "https://propel-crm.xyz/") {
      return res.status(400).json({
        message: "Invalid client.",
      });
    }

    if (req.get("origin") !== "https://propel-crm.xyz") {
      return res.status(400).json({
        message: "Invalid client.",
      });
    }

    if (!receivedCSRFToken) {
      return res.status(403).json({
        message: "Invalid CSRF Token",
      });
    }

    let receivedCSRFTokenBuffer;
    let csrfTokenExpectedBuffer;

    if (preAuthSession) {
      receivedCSRFTokenBuffer = Buffer.from(receivedCSRFToken);
      csrfTokenExpectedBuffer = Buffer.from(deriveSessionCSRFToken(PRE_AUTH_CSRF_SECRET, sessionID));
    } else {
      receivedCSRFTokenBuffer = Buffer.from(receivedCSRFToken);
      csrfTokenExpectedBuffer = Buffer.from(deriveSessionCSRFToken(CSRF_SECRET, sessionID));
    }

    if (!safeComparison(receivedCSRFTokenBuffer, csrfTokenExpectedBuffer)) {
      return res.status(403).json({
        message: "Invalid CSRF Token",
      });
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
