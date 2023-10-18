import crypto from "crypto";
import bcrypt from "bcrypt";

import { SALT_ROUNDS } from "../config";

// param: 16 is constant and should not cause errors
export const createSessionToken = () => {
  return crypto.randomBytes(16).toString("base64");
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password.trim(), Number(SALT_ROUNDS));
};

export const checkPassword = async (password: string, storedPassword: string) => {
  return bcrypt.compare(password.trim(), storedPassword);
};

export const objectNotEmpty = (object: Record<string, unknown>) => {
  return Object.keys(object).length > 0;
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
