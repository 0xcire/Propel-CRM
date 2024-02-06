import dotenv from "dotenv";
dotenv.config();

export const RESEND_KEY = process.env.RESEND_KEY;
export const RECOVERY_EMAIL = process.env.RECOVERY_EMAIL;
export const VERIFY_EMAIL = process.env.VERIFY_EMAIL;
