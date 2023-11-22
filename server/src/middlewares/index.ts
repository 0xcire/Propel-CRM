import { deleteRedisSession, getUserFromSession, setRedisSession } from "../redis";
import { createAnonymousToken, createSecureCookie, deriveSessionCSRFToken, safeComparison } from "../utils";
import {
  ABSOLUTE_SESSION_COOKIE,
  CSRF_COOKIE,
  CSRF_SECRET,
  IDLE_SESSION_COOKIE,
  IDLE_SESSION_LENGTH,
  PRE_AUTH_CSRF_SECRET,
  PRE_AUTH_SESSION_COOKIE,
  PRE_AUTH_SESSION_LENGTH,
} from "../config";

import type { Request, Response, NextFunction } from "express";

// [ ]: had a poor solution to handling firefox cookies
// try just setting cookie with old age, etc

export const validateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const absoluteSession: string | undefined = req.signedCookies[ABSOLUTE_SESSION_COOKIE];
    const idleSession: string | undefined = req.signedCookies[IDLE_SESSION_COOKIE];

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

      req.session = {
        id: "",
      };

      initializePreAuthSession(req, res);

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

      req.session = {
        id: "",
      };

      initializePreAuthSession(req, res);

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

      req.session = {
        id: absoluteSession,
      };

      // reset idle timeout
      // [ ]: way to attach timestamp to req.user and send in response? to reliably use in client?
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

export const validatePreAuthSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const preAuthSession = req.signedCookies[PRE_AUTH_SESSION_COOKIE];

    if (!preAuthSession) {
      return res.status(400).json({
        message: "Session likely timed out. Please refresh the page.",
      });
    }

    req.session = {
      id: preAuthSession,
    };

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

// [ ]: test against origin/referer? req.get('Referer')
// already using cookie to header + sameSite as recommended
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

async function initializePreAuthSession(req: Request, res: Response) {
  const preAuthSession = req.signedCookies[PRE_AUTH_SESSION_COOKIE];

  let anonymousSessionTokenID;

  if (!preAuthSession) {
    anonymousSessionTokenID = createAnonymousToken();
    createSecureCookie({
      res: res,
      name: PRE_AUTH_SESSION_COOKIE,
      age: +(PRE_AUTH_SESSION_LENGTH as string),
      value: anonymousSessionTokenID,
    });

    res.cookie(CSRF_COOKIE, deriveSessionCSRFToken(PRE_AUTH_CSRF_SECRET, anonymousSessionTokenID), {
      httpOnly: false,
      secure: true,
      signed: false,
      sameSite: "strict",
      maxAge: +(PRE_AUTH_SESSION_LENGTH as string),
    });
  }
}
