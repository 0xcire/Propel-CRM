import { Router } from "express";

import { isAuth, isOwner } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";

import { analyticsQuerySchema, authCookieValidator, paramSchema } from "../db/validation-schema";

import {
  getAvgListingDaysOnMarket,
  getAvgTimeToCloseLead,
  getExistingSalesYears,
  getListToSaleRatioForYear,
  getSalesVolumeForYear,
} from "../controllers/analytics";

export default (router: Router) => {
  router.get(
    "/analytics/sales/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema, query: analyticsQuerySchema }),
    isAuth,
    isOwner,
    getSalesVolumeForYear
  );

  router.get(
    "/analytics/years/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema }),
    isAuth,
    isOwner,
    getExistingSalesYears
  );

  router.get(
    "/analytics/days-on-market/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema, query: analyticsQuerySchema }),
    isAuth,
    isOwner,
    getAvgListingDaysOnMarket
  );

  router.get(
    "/analytics/list-sale-ratio/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema, query: analyticsQuerySchema }),
    isAuth,
    isOwner,
    getListToSaleRatioForYear
  );

  router.get(
    "/analytics/time-to-close/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema, query: analyticsQuerySchema }),
    isAuth,
    isOwner,
    getAvgTimeToCloseLead
  );
};
