import dotenv from "dotenv";
dotenv.config();

export const CI = process.env.CI;
export const TESTMAIL_KEY = process.env.TESTMAIL_KEY;
export const TESTMAIL_ENDPOINT = process.env.TESTMAIL_ENDPOINT;
export const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;
