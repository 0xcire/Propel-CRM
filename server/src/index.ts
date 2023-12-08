import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
// import { sql } from "drizzle-orm";
import router from "./router";
import { COOKIE_SECRET, ENV } from "./config";

const app = express();
app.set("trust proxy", true);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      },
    },
    crossOriginResourcePolicy: {
      policy: "same-origin",
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(COOKIE_SECRET));

app.use(compression());

app.use(
  cors({
    origin: "https://d2cgv9dakutima.cloudfront.net",
    credentials: true,
  })
);

const PORT = 1337;
const server = app.listen(PORT, () => {
  if (ENV === "development") {
    console.log(`DOCKER: http://localhost:8080 \n NON-DOCKER: http://localhost:5173`);
  } else {
    console.log("running in prod");
  }
});

app.use("/", router());

// async function close() {
//   console.log("closing...");
//   await sql`sql.end( {timeout: 5 })`;
//   await new Promise((r) => server.close(r));
// }

// process.on("SIGINT", close);
// process.on("SIGTERM", close);
// process.on("warning", (e) => console.warn(e.stack));
