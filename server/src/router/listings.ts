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
} from "../controllers/listings";

import { validateRequest } from "../middlewares/validate-input";
import { isAuth } from "../middlewares";
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
} from "../db/validation-schema";

export default (router: Router) => {
  router.get("/dashboard/listings", validateRequest({ cookies: authCookieValidator }), isAuth, getDashboardListings);

  router.get(
    "/listings",
    validateRequest({ cookies: authCookieValidator, query: listingQueryValidator }),
    isAuth,
    getAllListings
  );

  router.get(
    "/listings/search",
    validateRequest({ cookies: authCookieValidator, query: listingSearchQueryValidator }),
    isAuth,
    searchUsersListings
  );

  router.get(
    "/listings/:listingID",
    validateRequest({ cookies: authCookieValidator, params: listingIDValidator }),
    isAuth,
    isListingOwner,
    getSpecificListing
  );

  router.post(
    "/listings",
    validateRequest({ body: createListingSchema, cookies: authCookieValidator }),
    isAuth,
    createListing
  );

  router.patch(
    "/listings/:listingID",
    validateRequest({ body: updateListingSchema, cookies: authCookieValidator, params: listingIDValidator }),
    isAuth,
    isListingOwner,
    updateListing
  );

  router.delete(
    "/listings/:listingID",
    validateRequest({ cookies: authCookieValidator, params: listingIDValidator }),
    isAuth,
    isListingOwner,
    deleteListing
  );

  router.post(
    "/listings/status/:listingID",
    validateRequest({ cookies: authCookieValidator, params: listingIDValidator }),
    isAuth,
    isListingOwner,
    markListingAsSold
  );

  router.post(
    "/listings/:listingID/lead/:contactID",
    validateRequest({ cookies: authCookieValidator, params: listingAndContactIDValidator }),
    isAuth,
    isListingOwner,
    isContactOwner,
    addListingLead
  );

  router.delete(
    "/listings/:listingID/lead/:contactID",
    validateRequest({ cookies: authCookieValidator, params: listingAndContactIDValidator }),
    isAuth,
    isListingOwner,
    isContactOwner,
    removeListingLead
  );
};
