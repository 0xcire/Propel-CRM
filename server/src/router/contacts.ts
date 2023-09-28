import { Router } from "express";
import {
  getDashboardContacts,
  getMyContacts,
  getSpecificContact,
  searchMyContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contacts";
import { isAuth } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import {
  contactQuerySchema,
  contactSearchQuerySchema,
  cookieSchema,
  createContactSchema,
  paramSchema,
  updateContactSchema,
} from "../db/validation-schema";
import { isContactOwner } from "../middlewares/contacts";

export default (router: Router) => {
  router.get("/dashboard/contacts", validateRequest({ cookies: cookieSchema }), isAuth, getDashboardContacts);

  router.get("/contacts", validateRequest({ cookies: cookieSchema, query: contactQuerySchema }), isAuth, getMyContacts);

  router.get(
    "/search_contacts",
    validateRequest({ cookies: cookieSchema, query: contactSearchQuerySchema }),
    isAuth,
    searchMyContacts
  );

  router.get(
    "/contacts/:id",
    validateRequest({ cookies: cookieSchema, query: contactSearchQuerySchema, params: paramSchema }),
    isAuth,
    isContactOwner,
    getSpecificContact
  );

  // router.get("/contacts/:id/listings");

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
