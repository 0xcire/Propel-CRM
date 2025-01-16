import { Router } from "express";
import { ContactsController } from "./contacts.controller";
// TODO: rename -> xyzDto
import {
  contactIDValidator,
  contactQueryValidator,
  contactSearchQueryValidator,
  authCookieValidator,
  createContactValidator,
  updateContactValidator,
} from "@propel/drizzle";
import { ContactsService } from "./contacts.service";
import { ValidateRequestMiddleware } from "../common/middleware/validate-request";
import { ValidateSessionMiddleware } from "../common/middleware/validate-session";
import { isContactOwner } from "./contacts.middleware";
import { ValidateCsrfMiddleware } from "../common/middleware/validate-csrf";

export default (router: Router) => {
    const { validate: validateRequest } = new ValidateRequestMiddleware();
    const { validateSession } = new ValidateSessionMiddleware();
    const { validateCsrf } = new ValidateCsrfMiddleware();
    const ctrl = new ContactsController(new ContactsService())

  router.get(
    "/dashboard/contacts",
    validateRequest({ cookies: authCookieValidator }),
    validateSession,
    ctrl['handleGetDashboardContacts']
  );

  router.get(
    "/contacts",
    validateRequest({
      cookies: authCookieValidator,
      query: contactQueryValidator,
    }),
    validateSession,
    ctrl['handleGetContacts']
  );

  router.get(
    "/contacts/search",
    validateRequest({
      cookies: authCookieValidator,
      query: contactSearchQueryValidator,
    }),
    validateSession,
    ctrl['handleSearchContacts']
  );

  router.get(
    "/contacts/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: contactIDValidator,
    }),
    validateSession,
    isContactOwner,
    ctrl['handleGetContactById']
  );

  router.post(
    "/contacts",
    validateRequest({
      body: createContactValidator,
      cookies: authCookieValidator,
    }),
    validateSession,
    validateCsrf,
    ctrl['handleCreateContact']
  );

  router.patch(
    "/contacts/:contactID",
    validateRequest({
      body: updateContactValidator,
      cookies: authCookieValidator,
      params: contactIDValidator,
    }),
    validateSession,
    validateCsrf,
    isContactOwner,
    ctrl['handleUpdateContact']
  );

  router.delete(
    "/contacts/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: contactIDValidator,
    }),
    validateSession,
    validateCsrf,
    isContactOwner,
    ctrl['handleDeleteContact']
  );
};
