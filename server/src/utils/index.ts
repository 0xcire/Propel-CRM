import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET as string;
const SALT_ROUNDS = 10;

// export const random = () => crypto.randomBytes(128).toString("base64");

// export const authentication = (salt: string, password: string) => {
//   return crypto.createHmac("sha256", [salt, password].join("/")).update(secret).digest("hex");
// };

// export const createSessionToken = (): Promise<string | Error> => {
//   return new Promise((resolve, reject) => {
//     crypto.randomBytes(16, (err, data) => {
//       err ? reject(err) : resolve(data.toString("base64"));
//     });
//   });
// };

export const createSessionToken = () => crypto.randomBytes(16).toString("base64");

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const checkPassword = async (password: string, storedPassword: string) => {
  return bcrypt.compare(password, storedPassword);
};
