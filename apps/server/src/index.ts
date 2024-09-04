import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
// import { sql } from "drizzle-orm";
import router from "./router";
import { COOKIE_SECRET, NODE_ENV, configStore } from "./config";
import { validateConfig } from "./config/config-validator";

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
    origin: "https://propel-crm.xyz",
    credentials: true,
    preflightContinue: true,
    // exposedHeaders: [""],
  })
);

validateConfig(configStore);

const PORT = 1337;
app.listen(PORT, () => {
  if (NODE_ENV === "development") {
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
