import { Router } from "express";
import auth from "./auth";
import user from "./user";
import contacts from "./contacts";
import tasks from "./tasks";
import listings from "./listings";
import analytics from "./analytics";

const router = Router();

export default (): Router => {
  auth(router);
  user(router);
  contacts(router);
  tasks(router);
  listings(router);
  analytics(router);

  return router;
};
