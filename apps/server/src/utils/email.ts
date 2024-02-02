import { setRedisKV } from "@propel/redis";
import { sendRecoverPasswordEmail, sendVerifyAccountEmail } from "@propel/emails";
import { createToken } from ".";

import { ONE_HOUR } from "../config";

export const createVerifyEmailSessionAndSendEmail = async (recipientID: number, recipientEmail: string) => {
  const token = createToken(64, true);
  await setRedisKV(token, String(recipientID), ONE_HOUR);
  await sendVerifyAccountEmail(recipientEmail, token);
};

export const createRecoverPasswordSessionAndSendEmail = async (recipientID: number, recipientEmail: string) => {
  const token = createToken(64, true);
  await setRedisKV(token, String(recipientID), ONE_HOUR);
  await sendRecoverPasswordEmail(recipientEmail, token);
};
