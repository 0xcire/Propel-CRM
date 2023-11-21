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

import { validateCSRF, validateSession } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { isContactOwner } from "../middlewares/contacts";

import {
  contactIDValidator,
  contactQueryValidator,
  contactSearchQueryValidator,
  authCookieValidator,
  createContactValidator,
  updateContactValidator,
} from "../db/validation-schema";

export default (router: Router) => {
  router.get(
    "/dashboard/contacts",
    validateRequest({ cookies: authCookieValidator }),
    validateSession,
    getDashboardContacts
  );

  router.get(
    "/contacts",
    validateRequest({ cookies: authCookieValidator, query: contactQueryValidator }),
    validateSession,
    getMyContacts
  );

  router.get(
    "/contacts/search",
    validateRequest({ cookies: authCookieValidator, query: contactSearchQueryValidator }),
    validateSession,
    searchUsersContacts
  );

  router.get(
    "/contacts/:contactID",
    validateRequest({ cookies: authCookieValidator, params: contactIDValidator }),
    validateSession,
    isContactOwner,
    getSpecificContact
  );

  router.post(
    "/contacts",
    validateRequest({ body: createContactValidator, cookies: authCookieValidator }),
    validateSession,
    validateCSRF,
    createContact
  );

  router.patch(
    "/contacts/:contactID",
    validateRequest({ body: updateContactValidator, cookies: authCookieValidator, params: contactIDValidator }),
    validateSession,
    validateCSRF,
    isContactOwner,
    updateContact
  );

  router.delete(
    "/contacts/:contactID",
    validateRequest({ cookies: authCookieValidator, params: contactIDValidator }),
    validateSession,
    validateCSRF,
    isContactOwner,
    deleteContact
  );
};
