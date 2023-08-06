import { eq, sql } from "drizzle-orm";
import { db } from "../";
import { users } from "../schema";
import type { UserResponse } from "../../controllers/types";
import type { NewUser } from "../types";

type FindUsersByEmailParams = {
  email: string;
  signingIn?: boolean;
};

type updateUsersByEmailParams = {
  email: string;
  token: string;
  signingIn?: boolean;
};

type FindUsersByIDParams = {
  id: number;
  requestingInfo?: boolean;
  updating?: boolean;
};

type updateUsersByIDParams = {
  id: number;
  newUsername: string | undefined;
  newEmail: string | undefined;
  newPassword: string | undefined;
};

export const findUsersByEmail = async ({
  email,
  signingIn,
}: FindUsersByEmailParams): Promise<UserResponse | undefined> => {
  const user = await db
    .select({
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
      username: users.username,
    })
    .from(users)
    .where(eq(users.username, username));

  if (!user) {
    return undefined;
  }

  return user[0];
};

export const findUsersBySessionToken = async (token: string): Promise<UserResponse | undefined> => {
  const user = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
    })
    .from(users)
    .where(eq(users.sessionToken, token));

  if (!user) {
    return undefined;
  }

  return user[0];
};

export const updateUsersByEmail = async ({ email, token, signingIn }: updateUsersByEmailParams) => {
  const user = await db
    .update(users)
    .set({
      sessionToken: token,
      ...(signingIn
        ? {
            lastLogin: sql`CURRENT_TIMESTAMP`,
          }
        : {}),
    })
    .where(eq(users.email, email))
    .returning({
      id: users.id,
      username: users.username,
      name: users.name,
      email: users.email,
      lastLogin: users.lastLogin,
    });

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

export const updateUserByID = async ({ id, newUsername, newEmail, newPassword }: updateUsersByIDParams) => {
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
