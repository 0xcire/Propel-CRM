import { Router } from "express";
import auth from "./auth";
import user from "./user";
import contacts from "./contacts";

const router = Router();

export default (): Router => {
  auth(router);
  user(router);
  contacts(router);

  return router;
};
