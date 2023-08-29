import { Router } from "express";
import { createListing, getAllListings, deleteListing, updateListing } from "../controllers/listings";
import { validateRequest } from "../middlewares/validate-input";
import { isAuth } from "../middlewares";
import { isListingOwner } from "../middlewares/listings";

import { cookieSchema, createListingSchema, paramSchema, updateListingSchema } from "../db/validation-schema";

export default (router: Router) => {
  // router.get("/listings/:id", getListing)

  router.get("/listings", validateRequest({ cookies: cookieSchema }), isAuth, getAllListings);

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
};
