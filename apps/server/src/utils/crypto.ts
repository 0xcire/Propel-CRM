import { randomBytes, createHmac, timingSafeEqual, randomUUID } from "crypto";

export const createToken = (size: number, url?: boolean) => {
  if (url) {
    return randomBytes(size).toString("base64url");
  }
  return randomBytes(size).toString("base64");
};

export const createUUID = () => {
  return randomUUID();
};

export const deriveSessionCSRFToken = (secret: string, sessionID: string) => {
  return createHmac("sha256", secret).update(sessionID).digest("base64url");
};

export const safeComparison = (a: Buffer, b: Buffer) => {
  return a.length === b.length && timingSafeEqual(a, b);
};
