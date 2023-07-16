import crypto from "crypto";
import bcrypt from "bcrypt";

import { SALT_ROUNDS } from "../config";

// param: 16 is constant and should not cause errors
export const createSessionToken = () => {
  return crypto.randomBytes(16).toString("base64");
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS as string);
};

export const checkPassword = async (password: string, storedPassword: string) => {
  return bcrypt.compare(password, storedPassword);
};
