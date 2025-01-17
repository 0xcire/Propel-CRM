import { randomBytes, createHmac } from "crypto";

export const createToken = (size: number, url?: boolean) => {
  return url 
    ? randomBytes(size).toString("base64url")
    : randomBytes(size).toString("base64");
};

export const deriveSessionCSRFToken = (secret: string, sessionID: string) => {
  return createHmac("sha256", secret).update(sessionID).digest("base64url");
};
