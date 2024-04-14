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

import { validateRequest } from "../middlewares/validate-input";
import { validateSession } from "../middlewares/validate-session";
import { validateCSRF } from "../middlewares/validate-csrf";
import { isContactOwner } from "../middlewares/contacts";

import {
  contactIDValidator,
  contactQueryValidator,
  contactSearchQueryValidator,
  authCookieValidator,
  createContactValidator,
  updateContactValidator,
} from "@propel/drizzle";

export default (router: Router) => {
  router.get(
    // [ ]: these dashboard endpoints likely can be removed
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
