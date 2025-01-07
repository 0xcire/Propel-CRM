import { Router } from "express";

import {
  getDashboardListings,
  getAllListings,
  getSpecificListing,
  createListing,
  deleteListing,
  updateListing,
  addListingLead,
  removeListingLead,
  markListingAsSold,
  searchUsersListings,
  getContactsRelatedListings,
} from "../../controllers/listings";

import { validateRequest } from "../middlewares/validate-input";
import { validateSession } from "../middlewares/validate-session";
import { validateCSRF } from "../middlewares/validate-csrf";
import { isListingOwner } from "../middlewares/listings";
import { isContactOwner } from "../middlewares/contacts";

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

export default (router: Router) => {
  // [ ] : could be removed
  router.get(
    "/dashboard/listings",
    validateRequest({ cookies: authCookieValidator }),
    validateSession,
    getDashboardListings
  );

  router.get(
    "/listings",
    validateRequest({
      cookies: authCookieValidator,
      query: listingQueryValidator,
    }),
    validateSession,
    getAllListings
  );

  router.get(
    "/listings/search",
    validateRequest({
      cookies: authCookieValidator,
      query: listingSearchQueryValidator,
    }),
    validateSession,
    searchUsersListings
  );

  router.get(
    "/listings/contacts/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: contactIDValidator,
    }),
    validateSession,
    isContactOwner,
    getContactsRelatedListings
  );

  router.get(
    "/listings/:listingID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingIDValidator,
    }),
    validateSession,
    isListingOwner,
    getSpecificListing
  );

  router.post(
    "/listings",
    validateRequest({
      body: createListingSchema,
      cookies: authCookieValidator,
    }),
    validateSession,
    validateCSRF,
    createListing
  );

  router.patch(
    "/listings/:listingID",
    validateRequest({
      body: updateListingSchema,
      cookies: authCookieValidator,
      params: listingIDValidator,
    }),
    validateSession,
    validateCSRF,
    isListingOwner,
    updateListing
  );

  router.delete(
    "/listings/:listingID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingIDValidator,
    }),
    validateSession,
    validateCSRF,
    isListingOwner,
    deleteListing
  );

  router.post(
    "/listings/:listingID/sold/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingIDValidator,
      body: markSoldValidator,
    }),
    validateSession,
    validateCSRF,
    isListingOwner,
    isContactOwner,
    markListingAsSold
  );

  router.post(
    "/listings/:listingID/lead/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingAndContactIDValidator,
    }),
    validateSession,
    validateCSRF,
    isListingOwner,
    isContactOwner,
    addListingLead
  );

  router.delete(
    "/listings/:listingID/lead/:contactID",
    validateRequest({
      cookies: authCookieValidator,
      params: listingAndContactIDValidator,
    }),
    validateSession,
    validateCSRF,
    isListingOwner,
    isContactOwner,
    removeListingLead
  );
};
