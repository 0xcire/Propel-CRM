import { Router } from "express";

import {
  getDashboardContacts,
  getMyContacts,
  getSpecificContact,
  searchUsersContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contacts";

import { isAuth } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { isContactOwner } from "../middlewares/contacts";

import {
  contactIDParamSchema,
  contactQueryValidator,
  contactSearchQueryValidator,
  cookieSchema,
  createContactSchema,
  updateContactSchema,
} from "../db/validation-schema";

export default (router: Router) => {
  router.get("/dashboard/contacts", validateRequest({ cookies: cookieSchema }), isAuth, getDashboardContacts);

  router.get(
    "/contacts",
    validateRequest({ cookies: cookieSchema, query: contactQueryValidator }),
    isAuth,
    getMyContacts
  );

  router.get(
    "/contacts/search",
    validateRequest({ cookies: cookieSchema, query: contactSearchQueryValidator }),
    isAuth,
    searchUsersContacts
  );

  router.get(
    "/contacts/:contactID",
    validateRequest({ cookies: cookieSchema, params: contactIDParamSchema }),
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
