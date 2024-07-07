import dotenv from "dotenv";
dotenv.config({ path: "../../" });

console.log("from drizzle pkg", dotenv.config({ path: "../../" }));

export const PG_URL = process.env.PG_URL;
