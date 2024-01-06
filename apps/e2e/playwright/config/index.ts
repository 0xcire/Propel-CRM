import dotenv from "dotenv";

dotenv.config();

export const TEST_EMAIL = process.env.TEST_EMAIL as string;
export const TEST_PW = process.env.TEST_PW as string;
export const TEST_USER = process.env.TEST_USER as string;

export const CI = process.env.CI;
