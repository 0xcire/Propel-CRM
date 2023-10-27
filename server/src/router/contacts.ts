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
  contactIDParamSchema,
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
    "/contacts/:contactID",
    validateRequest({ cookies: cookieSchema, query: contactSearchQuerySchema, params: contactIDParamSchema }),
    isAuth,
    isContactOwner,
    getSpecificContact
  );

  router.post(
    "/contacts",
    validateRequest({ body: createContactSchema, cookies: cookieSchema }),
    isAuth,
    createContact
  );

  router.patch(
    "/contacts/:contactID",
    validateRequest({ body: updateContactSchema, cookies: cookieSchema, params: contactIDParamSchema }),
    isAuth,
    isContactOwner,
    updateContact
  );

  router.delete(
    "/contacts/:contactID",
    validateRequest({ cookies: cookieSchema, params: contactIDParamSchema }),
    isAuth,
    isContactOwner,
    deleteContact
  );
};
