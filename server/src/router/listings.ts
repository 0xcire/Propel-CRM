import { Router } from "express";
import {
  createListing,
  getAllListings,
  deleteListing,
  updateListing,
  getDashboardListings,
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
  newListingLeadSchema,
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

  // ?
  // router.get("/listings/:id/leads")

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
    validateRequest({ cookies: cookieSchema, params: newListingLeadSchema }),
    isAuth,
    isListingOwner,
    addListingLead
  );

  router.delete(
    "/listings/:id/lead/:contactID",
    validateRequest({ cookies: cookieSchema, params: newListingLeadSchema }),
    isAuth,
    isListingOwner,
    removeListingLead
  );
};
