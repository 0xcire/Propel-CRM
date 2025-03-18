import { Router } from "express";
import { ListingsController } from "./listings.controller";
import { ListingsService } from "./listings.service";
import {
  authCookieValidator,
  createListingSchema,
  updateListingSchema,
  listingIDValidator,
  listingAndContactIDValidator,
  listingQueryValidator,
  listingSearchQueryValidator,
  contactIDValidator,
  markSoldValidator,
} from "@propel/drizzle";
import { ValidateRequestMiddleware } from "../common/middleware/validate-request";
import { ValidateSessionMiddleware } from "../common/middleware/validate-session";
import { ValidateCsrfMiddleware } from "../common/middleware/validate-csrf";
import { isContactOwner } from "../contacts/contacts.middleware";
import { isListingOwner } from "./listings.middleware";

export default (router: Router) => {
  const { validateRequest } = new ValidateRequestMiddleware();
  const { validateSession } = new ValidateSessionMiddleware();
  const { validateCsrf } = new ValidateCsrfMiddleware();
  const ctrl = new ListingsController(new ListingsService())

  router.get(
    "/dashboard/listings",
    validateRequest({ cookies: authCookieValidator }),
    validateSession,
    ctrl['handleGetDashboardListings']
  );

  router.get(
    "/listings",
    validateRequest({
      cookies: authCookieValidator,
      query: listingQueryValidator,
    }),
    validateSession,
    ctrl['handleGetAllListings']
  );

  router.get(
    "/listings/search",
    validateRequest({
      cookies: authCookieValidator,
      query: listingSearchQueryValidator,
    }),
    validateSession,
    ctrl['handleSearchListings']
  );

  router.get(
    "/listings/contacts/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: contactIDValidator,
    }),
    validateSession,
    isContactOwner,
    ctrl['handleGetContactsRelatedListings']
  );

  router.get(
    "/listings/:listingID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingIDValidator,
    }),
    validateSession,
    isListingOwner,
    ctrl['handleGetListingById']
  );

  router.post(
    "/listings",
    validateRequest({
      body: createListingSchema,
      cookies: authCookieValidator,
    }),
    validateSession,
    validateCsrf,
    ctrl['handleCreateListing']
  );

  router.patch(
    "/listings/:listingID",
    validateRequest({
      body: updateListingSchema,
      cookies: authCookieValidator,
      params: listingIDValidator,
    }),
    validateSession,
    validateCsrf,
    isListingOwner,
    ctrl['handleUpdateListing']
  );

  router.delete(
    "/listings/:listingID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingIDValidator,
    }),
    validateSession,
    validateCsrf,
    isListingOwner,
    ctrl['handleDeleteListing']
  );

  router.post(
    "/listings/:listingID/sold/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingIDValidator,
      body: markSoldValidator,
    }),
    validateSession,
    validateCsrf,
    isListingOwner,
    isContactOwner,
    ctrl['handleInitListingSale']
  );

  router.post(
    "/listings/:listingID/lead/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingAndContactIDValidator,
    }),
    validateSession,
    validateCsrf,
    isListingOwner,
    isContactOwner,
    ctrl['handleAddLeadToListing']
  );

  router.delete(
    "/listings/:listingID/lead/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingAndContactIDValidator,
    }),
    validateSession,
    validateCsrf,
    isListingOwner,
    isContactOwner,
    ctrl['handleRemoveLeadFromListing']
  );
};
