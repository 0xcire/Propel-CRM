import { createRequestAndDeleteRedundancy } from "@propel/drizzle";
import dayjs from "dayjs";
import { sendRecoverPasswordEmail, sendVerifyAccountEmail } from "@propel/emails";
import { createUUID } from ".";

export const createVerifyEmailRequestAndSendEmail = async (recipientID: number, recipientEmail: string) => {
  const id = createUUID();

  await createRequestAndDeleteRedundancy({
    id: id,
    expiry: dayjs().add(1, "hour").toDate(),
    userEmail: recipientEmail,
    userID: recipientID,
  });

  await sendVerifyAccountEmail(recipientEmail, id);
};

export const createRecoverPasswordRequestAndSendEmail = async (recipientID: number, recipientEmail: string) => {
  const id = createUUID();

  await createRequestAndDeleteRedundancy({
    id: id,
    expiry: dayjs().add(1, "hour").toDate(),
    userEmail: recipientEmail,
    userID: recipientID,
  });
  await sendRecoverPasswordEmail(recipientEmail, id);
};
