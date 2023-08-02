import { Router } from "express";
import { getMyContacts, getOneContact, createContact, updateContact, deleteContact } from "../controllers/contacts";
import { isAuth } from "../middlewares";

export default (router: Router) => {
  router.get("/contacts", isAuth, getMyContacts);

  // probably dont need getOneContact?
  router.get("/contacts/:id", getOneContact);

  router.post("/contacts", isAuth, createContact);
  router.patch("/contacts/:id", isAuth, updateContact);
  router.delete("/contacts/:id", isAuth, deleteContact);
};
