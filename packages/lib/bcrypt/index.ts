import { hash } from "bcrypt";

export const hashPassword = (password: string, saltRounds: number) => {
  return hash(password, saltRounds);
};
