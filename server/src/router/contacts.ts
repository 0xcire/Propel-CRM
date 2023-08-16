import { Router } from "express";
import {
  getMyContacts,
  createContact,
  updateContact,
  deleteContact,
  getSpecificContact,
} from "../controllers/contacts";
import { isAuth } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { cookieSchema, createContactSchema, paramSchema, updateContactSchema } from "../db/validation-schema";
import { isContactOwner } from "../middlewares/contacts";

export default (router: Router) => {
  router.get("/contacts", validateRequest({ cookies: cookieSchema }), isAuth, getMyContacts);

  // router.get("/contacts/:id", getSpecificContact);

  router.post(
    "/contacts",
    validateRequest({ body: createContactSchema, cookies: cookieSchema }),
    isAuth,
    createContact
  );
  router.patch(
    "/contacts/:id",
    validateRequest({ body: updateContactSchema, cookies: cookieSchema, params: paramSchema }),
    isAuth,
    isContactOwner,
    updateContact
  );
  router.delete(
    "/contacts/:id",
    validateRequest({ cookies: cookieSchema, params: paramSchema }),
    isAuth,
    isContactOwner,
    deleteContact
  );
};
