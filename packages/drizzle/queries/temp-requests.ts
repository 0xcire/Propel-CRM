import { db } from "../db";
import { tempRequests } from "../schema";
import { and, eq } from "drizzle-orm";

import type { TempRequest, NewTempRequest } from "../types";

export class TempRequestService {
  public async getTempRequestIdByEmail(email: string): Promise<Pick<TempRequest, "id"> | undefined> {
    const tempRequestIds = await db
      .select({
        id: tempRequests.id,
      })
      .from(tempRequests)
      .where(eq(tempRequests.userEmail, email));

    if (!tempRequestIds || tempRequestIds.length === 0) {
      return undefined;
    }

    return tempRequestIds[0];
  }

  public async getTempRequestByToken(token: string): Promise<Omit<TempRequest, "userEmail"> | undefined> {
    const tempRequest = await db
      .select({
        id: tempRequests.id,
        userID: tempRequests.userID,
        expiry: tempRequests.expiry,
      })
      .from(tempRequests)
      .where(eq(tempRequests.id, token));

    if (!tempRequest || tempRequest.length === 0) {
      return undefined;
    }

    return tempRequest[0];
  }

  // public createRequestAndDeleteRedundancy() {}
}

export const getTempRequest = async (email: string) => {
  const tempRequest = await db
    .select({
      id: tempRequests.id,
    })
    .from(tempRequests)
    .where(eq(tempRequests.userEmail, email));

  if (!tempRequest || tempRequest.length === 0) {
    return undefined;
  }

  return tempRequest[0];
};

export const getTempRequestFromToken = async (token: string) => {
  const tempRequest = await db
    .select({
      id: tempRequests.id,
      userID: tempRequests.userID,
      expiry: tempRequests.expiry,
    })
    .from(tempRequests)
    .where(eq(tempRequests.id, token));

  if (!tempRequest || tempRequest.length === 0) {
    return undefined;
  }

  return tempRequest[0];
};

export const createRequestAndDeleteRedundancy = async ({ id, expiry, userEmail, userID }: NewTempRequest) => {
  if (userEmail && userID) {
    await db.delete(tempRequests).where(
      and(
        eq(tempRequests.userEmail, userEmail),
        eq(tempRequests.userID, userID)
        //
      )
    );
  }

  const temp = await db
    .insert(tempRequests)
    .values({
      id: id,
      expiry: expiry,
      userEmail: userEmail,
      userID: userID,
    })
    .returning();

  return temp[0];
};

export const deleteTemporaryRequest = async ({ id }: Pick<TempRequest, "id">) => {
  const deletedRequest = await db.delete(tempRequests).where(eq(tempRequests.id, id)).returning();

  return deletedRequest[0];
};

export const deleteTemporaryRequestByEmail = async ({ userEmail }: Pick<TempRequest, "userEmail">) => {
  await db.delete(tempRequests).where(eq(tempRequests.userEmail, userEmail as string));
};
