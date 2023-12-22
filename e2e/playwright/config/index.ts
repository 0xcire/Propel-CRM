import dotenv from "dotenv";

dotenv.config();

export const TEST_EMAIL = process.env.TEST_EMAIL as string;
export const TEST_PW = process.env.TEST_PW as string;
