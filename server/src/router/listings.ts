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
  cookieSchema,
  createListingSchema,
  listingQuerySchema,
  updateListingSchema,
  listingIDParamSchema,
  listingAndContactIDSchema,
  listingSearchQuerySchema,
} from "../db/validation-schema";

export default (router: Router) => {
  router.get("/dashboard/listings", validateRequest({ cookies: cookieSchema }), isAuth, getDashboardListings);

  router.get(
    "/listings",
    validateRequest({ cookies: cookieSchema, query: listingQuerySchema }),
    isAuth,
    getAllListings
  );

  router.get(
    "/listings/search",
    validateRequest({ cookies: cookieSchema, query: listingSearchQuerySchema }),
    isAuth,
    searchUsersListings
  );

  router.get(
    "/listings/:listingID",
    validateRequest({ cookies: cookieSchema, params: listingIDParamSchema }),
    isAuth,
    isListingOwner,
    getSpecificListing
  );

  router.post(
    "/listings",
    validateRequest({ body: createListingSchema, cookies: cookieSchema }),
    isAuth,
    createListing
  );

  router.patch(
    "/listings/:listingID",
    validateRequest({ body: updateListingSchema, cookies: cookieSchema, params: listingIDParamSchema }),
    isAuth,
    isListingOwner,
    updateListing
  );

  router.delete(
    "/listings/:listingID",
    validateRequest({ cookies: cookieSchema, params: listingIDParamSchema }),
    isAuth,
    isListingOwner,
    deleteListing
  );

  router.post(
    "/listings/status/:listingID",
    validateRequest({ cookies: cookieSchema, params: listingIDParamSchema }),
    isAuth,
    isListingOwner,
    markListingAsSold
  );

  router.post(
    "/listings/:listingID/lead/:contactID",
    validateRequest({ cookies: cookieSchema, params: listingAndContactIDSchema }),
    isAuth,
    isListingOwner,
    isContactOwner,
    addListingLead
  );

  router.delete(
    "/listings/:listingID/lead/:contactID",
    validateRequest({ cookies: cookieSchema, params: listingAndContactIDSchema }),
    isAuth,
    isListingOwner,
    isContactOwner,
    removeListingLead
  );
};
