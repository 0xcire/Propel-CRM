import { deleteRedisKV, setRedisKV } from "@propel/redis";
import { createSecureCookie, deriveSessionCSRFToken, isDeployed } from "../utils";

import {
  ABSOLUTE_SESSION_COOKIE,
  ABSOLUTE_SESSION_LENGTH,
  CSRF_COOKIE,
  CSRF_SECRET,
  IDLE_SESSION_COOKIE,
  IDLE_SESSION_LENGTH,
  PRE_AUTH_SESSION_COOKIE,
  sessionRelatedCookies,
} from "../config";

import type { Request, Response } from "express";

export const setAuthSessionCookies = (req: Request, res: Response, sessionID: string) => {
  createSecureCookie(req, {
    res: res,
    name: ABSOLUTE_SESSION_COOKIE as string,
    value: sessionID,
    age: +(ABSOLUTE_SESSION_LENGTH as string),
  });

  createSecureCookie(req, {
    res: res,
    name: IDLE_SESSION_COOKIE as string,
    value: sessionID,
    age: +(IDLE_SESSION_LENGTH as string),
  });

  res.cookie(CSRF_COOKIE, deriveSessionCSRFToken(CSRF_SECRET, sessionID), {
    httpOnly: false,
    secure: true,
    signed: false,
    sameSite: "lax",
    domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
    maxAge: +(ABSOLUTE_SESSION_LENGTH as string),
  });
};

export const removeAuthSessionCookies = (req: Request, res: Response) => {
  sessionRelatedCookies.forEach((cookie) => {
    res.clearCookie(cookie, {
      path: "/",
      domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
      sameSite: "lax",
    });
  });
};

export const setPreAuthCookies = () => 0;

export const removePreAuthCookies = (req: Request, res: Response) => {
  res.clearCookie(PRE_AUTH_SESSION_COOKIE, {
    path: "/",
    domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
    sameSite: "lax",
  });
};

export const persistAuthSession = async (req: Request, sessionID: string, userID: number) => {
  req.session = {
    id: sessionID,
  };
  await setRedisKV(sessionID, String(userID), +(ABSOLUTE_SESSION_LENGTH as string));
};

export const removeSessionPersistence = async (req: Request, sessionID: string) => {
  req.session = {
    id: "",
  };
  await deleteRedisKV(sessionID);
};
