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

// export const formatAnalyticsData = (data: Array<unknown>, existingMonths: Array<string>) => {
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   // const exisitingMonths = data.map((d: { month: string }) => d.month);

//   const formattedAnalyticsData = data.length > 0 ? months.map((month, idx) => {
//     if(data[idx] && !existingMonths.includes(month)) {
//       return month: month,

//     }
//   }) : [];
// };
