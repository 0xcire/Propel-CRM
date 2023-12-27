import { Router } from "express";

import { isOwner } from "../middlewares";
import { validateSession } from "../middlewares/validate-session";
import { validateRequest } from "../middlewares/validate-input";

import {
  getAvgListingDaysOnMarket,
  getAvgTimeToCloseLead,
  getExistingSalesYears,
  getListToSaleRatioForYear,
  getSalesVolumeForYear,
} from "../controllers/analytics";

import { analyticsQuerySchema, authCookieValidator, paramSchema } from "../db/validation-schema";

export default (router: Router) => {
  router.get(
    "/analytics/sales/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema, query: analyticsQuerySchema }),
    validateSession,
    isOwner,
    getSalesVolumeForYear
  );

  router.get(
    "/analytics/years/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema }),
    validateSession,
    isOwner,
    getExistingSalesYears
  );

  router.get(
    "/analytics/days-on-market/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema, query: analyticsQuerySchema }),
    validateSession,
    isOwner,
    getAvgListingDaysOnMarket
  );

  router.get(
    "/analytics/list-sale-ratio/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema, query: analyticsQuerySchema }),
    validateSession,
    isOwner,
    getListToSaleRatioForYear
  );

  router.get(
    "/analytics/time-to-close/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema, query: analyticsQuerySchema }),
    validateSession,
    isOwner,
    getAvgTimeToCloseLead
  );
};
