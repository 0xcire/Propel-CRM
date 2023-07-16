import type { User } from "../db/types";

export type UserResponse = Partial<User>;
export type UserInput = {
  name?: string | undefined;
  username?: string | undefined;
  email: string | undefined;
  password: string | undefined;
};
