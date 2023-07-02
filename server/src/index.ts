import express from "express";
import { Request, Response } from "express";
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

app.get("/", async (req: Request, res: Response) => {
  res.json("From LeExpress");
});
app.get("/db", async (req: Request, res: Response) => {
  res.json(await db.execute(sql`select version()`));
});

app.get("/test", async (req: Request, res: Response) => {
  res.json("testing testing 1234");
});

const PORT = 1337;
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`access app via http://localhost:8080`);
  } else {
    console.log("running in prod");
  }
});

async function close() {
  console.log("closing...");
  await new Promise((r) => server.close(r));
  await sql`sql.end( {timeout: 5 })`;
}

process.on("SIGINT", close);

process.on("SIGTERM", close);
