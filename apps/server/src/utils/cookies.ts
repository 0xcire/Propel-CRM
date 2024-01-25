import { ENV } from "../config";

import type { Request, Response } from "express";

export const isDeployed = (req: Request) => {
  return ENV === "production" && !req.headers.referer?.includes("localhost");
};

type CreateSecureCookieParams = {
  res: Response;
  name: string;
  value: string;
  age: number;
};

export const createSecureCookie = (req: Request, { res, name, value, age }: CreateSecureCookieParams) => {
  res.cookie(name, value, {
    maxAge: age,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: isDeployed(req) ? "propel-crm.xyz" : undefined,
    signed: true,
  });
};
