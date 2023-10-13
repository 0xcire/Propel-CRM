import { Router } from "express";
import { isAuth, isOwner } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { cookieSchema, paramSchema } from "../db/validation-schema";
import { getAvgListingDaysOnMarket, getExistingSalesYears, getPeriodicSalesVolume } from "../controllers/analytics";

// year, quarterly, monthly views via search params
export default (router: Router) => {
  router.get(
    "/analytics/sales/:id",
    validateRequest({ cookies: cookieSchema, params: paramSchema }),
    isAuth,
    isOwner,
    getPeriodicSalesVolume
  );

  router.get(
    "/analytics/years/:id",
    validateRequest({ cookies: cookieSchema, params: paramSchema }),
    isAuth,
    isOwner,
    getExistingSalesYears
  );

  router.get("/analytics/gci/:id", validateRequest({ cookies: cookieSchema, params: paramSchema }), isAuth, () => "yo");

  router.get(
    "/analytics/days-on-market/:id",
    validateRequest({ cookies: cookieSchema, params: paramSchema }),
    isAuth,
    isOwner,
    getAvgListingDaysOnMarket
  );
};
