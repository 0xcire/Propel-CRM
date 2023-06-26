import express from "express";
import http from "http"; //?
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import { sql } from "drizzle-orm";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

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

// make connection then listen for server

// for migrations
// const migrationClient = postgres("url", { max: 1 });
// migrate(drizzle(migrationClient), ...)

// for querying
// const queryClient = postgres("url");
// const db: PostgresJsDatabase = drizzle(queryClient);
// await db.select().from(...)...

app.get("/", (req, res) => {
  res.json("responding from express");
});

app.listen(1337, () => {
  console.log(console.log("Server running on port 1337"));
});
