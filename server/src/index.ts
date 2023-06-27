import express from "express";
import http from "http"; //?
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import { db } from "./db";
import { sql } from "drizzle-orm";
// import { migrate } from "drizzle-orm/postgres-js/migrator";

dotenv.config();
const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// for migrations
// const migrationClient = postgres("url", { max: 1 });
// migrate(drizzle(migrationClient), ...)

app.get("/", async (req, res) => {
  res.json(["from express", await db.execute(sql`select version()`)]);
});

app.listen(1337, () => {
  console.log(console.log("Server running on port 1337"));
});
