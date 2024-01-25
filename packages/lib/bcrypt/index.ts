import { hash, compare } from "bcrypt";

export const hashPassword = (password: string, saltRounds: number) => {
  return hash(password, saltRounds);
};

export const checkPassword = async (password: string, storedPassword: string) => {
  return compare(password.trim(), storedPassword);
};
