import { randomBytes, createHmac } from "crypto";
import { hash, compare } from "bcrypt";
import { CSRF_SECRET, SALT_ROUNDS } from "../config";

import type { Response } from "express";

type CreateSecureCookieParams = {
  res: Response;
  name: string;
  value: string;
  age: number;
};

// param: 16 is constant and should not cause errors
export const createToken = () => {
  return randomBytes(16).toString("base64");
};

export const deriveSessionCSRFToken = (sessionID: string) => {
  return createHmac("sha256", CSRF_SECRET).update(sessionID).digest("base64url");
};

export const hashPassword = async (password: string) => {
  return hash(password.trim(), +(SALT_ROUNDS as string));
};

export const checkPassword = async (password: string, storedPassword: string) => {
  return compare(password.trim(), storedPassword);
};

export const objectNotEmpty = (object: Record<string, unknown>) => {
  return Object.keys(object).length > 0;
};

export const createSecureCookie = ({ res, name, value, age }: CreateSecureCookieParams) => {
  return res.cookie(name, value, {
    maxAge: age,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    signed: true,
  });
};

export const getCurrentYear = () => new Date().getFullYear();

export const formatAnalyticsData = <T extends { month: unknown }>(
  data: Array<T>,
  getValue: (data: unknown) => unknown,
  defaultValue: string
) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const existingMonths = data.map((data) => (data as { month: unknown } & unknown).month);
  return data.length > 0
    ? months.map((month, index) => {
        if (!data[index] && !existingMonths.includes(month)) {
          return {
            month: month,
            value: defaultValue,
          };
        }

        if (!existingMonths.includes(month)) {
          return {
            month: month,
            value: defaultValue,
          };
        }

        const referenceIdx = existingMonths.indexOf(month);

        return {
          month: data[referenceIdx].month,
          value: getValue(data[referenceIdx]),
        };
      })
    : [];
};
