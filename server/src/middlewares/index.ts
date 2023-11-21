import { timingSafeEqual } from "crypto";
import { deleteRedisSession, getUserFromSession } from "../redis";
import { createSecureCookie, deriveSessionCSRFToken } from "../utils";
import {
  ABSOLUTE_SESSION_COOKIE,
  CSRF_COOKIE,
  IDLE_SESSION_COOKIE,
  IDLE_SESSION_LENGTH,
  sessionRelatedCookies,
} from "../config";

import type { Request, Response, NextFunction } from "express";

export const validateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const absoluteSession: string | undefined = req.signedCookies[ABSOLUTE_SESSION_COOKIE];
    const idleSession: string | undefined = req.signedCookies[IDLE_SESSION_COOKIE];
    const csrfCookie = req.cookies["X-PROPEL-CSRF"];
    // hacky solution to manually delete firefox cookies. no apparent security risk. moreso for thoroughness
    const isFirefox = req.header("user-agent")?.includes("Firefox");

    if (absoluteSession && idleSession && absoluteSession !== idleSession) {
      return res.status(403).json({
        message: "Session is invalid.",
      });
    }

    if (!absoluteSession) {
      if (idleSession) {
        res.clearCookie(IDLE_SESSION_COOKIE, {
          path: "/",
          sameSite: "strict",
        });

        await deleteRedisSession(idleSession);
      }

      if (csrfCookie) {
        res.clearCookie(CSRF_COOKIE, {
          path: "/",
          sameSite: "strict",
        });
      }

      if (isFirefox) {
        for (let i = 0; i < sessionRelatedCookies.length; i++) {
          res.cookie(sessionRelatedCookies[i], "", {
            maxAge: 1000,
            sameSite: "strict",
          });
          res.clearCookie(sessionRelatedCookies[i], {
            sameSite: "strict",
          });
        }
      }

      req.session = {
        id: "",
      };

      return res.status(403).json({
        message: "Session does not exist",
      });
    }

    if (!idleSession) {
      if (absoluteSession) {
        await deleteRedisSession(absoluteSession);
        res.clearCookie(ABSOLUTE_SESSION_COOKIE, {
          path: "/",
          sameSite: "strict",
        });

        res.clearCookie(CSRF_COOKIE, {
          path: "/",
          sameSite: "strict",
        });
      }

      if (isFirefox) {
        for (let i = 0; i < sessionRelatedCookies.length; i++) {
          res.cookie(sessionRelatedCookies[i], "", {
            maxAge: 1000,
            sameSite: "strict",
          });
          res.clearCookie(sessionRelatedCookies[i], {
            path: "/",
            sameSite: "strict",
          });
        }
      }

      req.session = {
        id: "",
      };

      return res.status(403).json({
        message: "Session has timed out.",
      });
    }

    const userIDByToken = await getUserFromSession(absoluteSession);

    if (!userIDByToken) {
      return res.status(403).json({
        message: "Can't find user.",
      });
    }

    if (userIDByToken) {
      req.user = {
        id: +userIDByToken,
      };

      req.session = { id: absoluteSession };
    }

    // reset idle session
    if (idleSession && absoluteSession) {
      createSecureCookie({
        res: res,
        age: +(IDLE_SESSION_LENGTH as string),
        name: IDLE_SESSION_COOKIE,
        value: idleSession,
      });
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

// notes:
// login csrf only necessary when distinction between (no) session is vague, ecomm site
// anonymous session likely solution
// [ ]: when in prod. should test against origin/referer
export const validateCSRF = (req: Request, res: Response, next: NextFunction) => {
  try {
    const receivedCSRFToken = req.headers["x-propel-csrf"] as string;
    const sessionID = req.session.id;

    // console.log(req.get("Referer"));

    if (!req.is("json")) {
      return res.status(400).json({
        message: "Unsupported content type.",
      });
    }

    if (!receivedCSRFToken) {
      return res.status(403).json({
        message: "Invalid CSRF Token",
      });
    }

    const receivedCSRFTokenBuffer = Buffer.from(receivedCSRFToken);
    const csrfTokenExpectedBuffer = Buffer.from(deriveSessionCSRFToken(sessionID));

    if (
      receivedCSRFTokenBuffer.length === csrfTokenExpectedBuffer.length &&
      !timingSafeEqual(receivedCSRFTokenBuffer, csrfTokenExpectedBuffer)
    ) {
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
