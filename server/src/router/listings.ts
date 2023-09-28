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
} from "../controllers/listings";
import { validateRequest } from "../middlewares/validate-input";
import { isAuth } from "../middlewares";
import { isListingOwner } from "../middlewares/listings";

import {
  cookieSchema,
  createListingSchema,
  listingQuerySchema,
  listingLeadSchema,
  paramSchema,
  updateListingSchema,
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
    "/listings/:id",
    validateRequest({ cookies: cookieSchema, params: paramSchema }),
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
    "/listings/:id",
    validateRequest({ body: updateListingSchema, cookies: cookieSchema, params: paramSchema }),
    isAuth,
    isListingOwner,
    updateListing
  );

  router.delete(
    "/listings/:id",
    validateRequest({ cookies: cookieSchema, params: paramSchema }),
    isAuth,
    isListingOwner,
    deleteListing
  );

  router.post(
    "/listings/:id/lead/:contactID",
    validateRequest({ cookies: cookieSchema, params: listingLeadSchema }),
    isAuth,
    isListingOwner,
    addListingLead
  );

  router.delete(
    "/listings/:id/lead/:contactID",
    validateRequest({ cookies: cookieSchema, params: listingLeadSchema }),
    isAuth,
    isListingOwner,
    removeListingLead
  );
};
