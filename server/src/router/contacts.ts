import { Router } from "express";
import {
  getMyContacts,
  createContact,
  updateContact,
  deleteContact,
  getSpecificContact,
} from "../controllers/contacts";
import { isAuth } from "../middlewares";

export default (router: Router) => {
  router.get("/contacts", isAuth, getMyContacts);

  router.get("/contacts/:id", getSpecificContact);

  router.post("/contacts", isAuth, createContact);
  router.patch("/contacts/:id", isAuth, updateContact);
  router.delete("/contacts/:id", isAuth, deleteContact);
};
