import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET as string;
const SALT_ROUNDS = 10;

// export const authentication = (salt: string, password: string) => {
//   return crypto.createHmac("sha256", [salt, password].join("/")).update(secret).digest("hex");
// };

// param: 16 is constant and should not cause errors
export const createSessionToken = () => {
  return crypto.randomBytes(16).toString("base64");
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const checkPassword = async (password: string, storedPassword: string) => {
  return bcrypt.compare(password, storedPassword);
};
