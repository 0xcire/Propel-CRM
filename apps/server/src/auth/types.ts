import type { User } from "@propel/drizzle";

export type ZUser = {
    username?: string | undefined;
    hashedPassword?: string | undefined;
    id: number;
    email: string;
} | undefined

export type UserResponse = Partial<User>;

// TODO: better name
// ex. UserInfo
export type UserInput = {
  name?: string | undefined;
  username?: string | undefined;
  email: string | undefined;
  password: string | undefined;
};