import { Resend } from "resend";
import { RESEND_KEY } from "./config";

export const resend = new Resend(RESEND_KEY);
