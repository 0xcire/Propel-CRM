import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

import type { NewUser, User } from "../types";

type UserResponse = Partial<User>;

type FindUsersByEmailParams = {
  email: string;
  signingIn?: boolean;
};

type FindUsersByIDParams = {
  id: number;
  requestingInfo?: boolean;
  updating?: boolean;
};

type updateUsersByIDParams = {
  id: number;
  newUsername?: string | undefined;
  newEmail?: string | undefined;
  newPassword?: string | undefined;
  verified?: boolean;
};

export const findUsersByEmail = async ({
  email,
  signingIn,
}: FindUsersByEmailParams): Promise<UserResponse | undefined> => {
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      ...(signingIn
        ? {
            username: users.username,
            hashedPassword: users.hashedPassword,
          }
        : {}),
    })
    .from(users)
    .where(eq(users.email, email));
  if (!user) {
    return undefined;
  }

  return user[0];
};

export const findUsersByUsername = async (username: string): Promise<UserResponse | undefined> => {
  const user = await db
    .select({
      id: users.id,
      username: users.username,
    })
    .from(users)
    .where(eq(users.username, username));

  if (!user) {
    return undefined;
  }

  return user[0];
};

export const insertNewUser = async (user: NewUser) => {
  const insertedUser = await db.insert(users).values(user).returning({
    id: users.id,
    name: users.name,
    username: users.username,
    email: users.email,
  });

  return insertedUser[0];
};

export const findUsersByID = async ({ id, requestingInfo, updating }: FindUsersByIDParams) => {
  const user = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      ...(requestingInfo
        ? {
            name: users.name,
            lastLogin: users.lastLogin,
            createdAt: users.createdAt,
            isAdmin: users.isAdmin,
            isVerified: users.isVerified,
          }
        : {}),
      ...(updating
        ? {
            hashedPassword: users.hashedPassword,
          }
        : {}),
    })
    .from(users)
    .where(eq(users.id, id));

  if (!user) {
    return undefined;
  }

  return user[0];
};

export const updateUserByID = async ({ id, newUsername, newEmail, newPassword, verified }: updateUsersByIDParams) => {
  const updatedUser = await db
    .update(users)
    .set({
      ...(newUsername
        ? {
            username: newUsername,
          }
        : {}),
      ...(newEmail
        ? {
            email: newEmail,
          }
        : {}),
      ...(newPassword
        ? {
            hashedPassword: newPassword,
          }
        : {}),
      ...(verified !== undefined
        ? {
            isVerified: verified,
          }
        : {}),
    })
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
    });

  return updatedUser[0];
};

export const deleteUserByID = async (id: number) => {
  const deletedUser = await db.delete(users).where(eq(users.id, id)).returning({
    name: users.name,
    username: users.username,
  });

  return deletedUser[0];
};
