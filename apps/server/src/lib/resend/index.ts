import { Resend } from "resend";
import { RESEND_KEY } from "../../config";

const resend = new Resend(RESEND_KEY);

export const emails = resend.emails;
