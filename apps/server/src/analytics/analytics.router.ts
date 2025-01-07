import { Router } from "express";
import {
  analyticsQuerySchema,
  authCookieValidator,
  paramSchema,
} from "@propel/drizzle";
import { ValidateSessionMiddleware } from "../common/middleware/validate-session";
import { ValidateRequestMiddleware } from "../common/middleware/validate-request";
import { UserPermissionsMiddleware } from "../common/middleware/user-permissions";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

// TODO: still need to move some schemas to common/dto or analytics/dto/*

export default (router: Router) => {
  const ctrl = new AnalyticsController(new AnalyticsService());
  const { validate: validateRequest } = new ValidateRequestMiddleware();
  const { validateSession } = new ValidateSessionMiddleware();
  const perm = new UserPermissionsMiddleware();
  
  router.get(
    "/analytics/sales/:id",
    validateRequest({
      cookies: authCookieValidator,
      params: paramSchema,
      query: analyticsQuerySchema,
    }),
    validateSession,
    perm['isAccountOwner'],
    ctrl['handleGetSalesVolumeForYear']
  );

  router.get(
    "/analytics/years/:id",
    validateRequest({ cookies: authCookieValidator, params: paramSchema }),
    validateSession,
    perm['isAccountOwner'],
    ctrl['handleGetExistingSalesYears']
  );

  router.get(
    "/analytics/days-on-market/:id",
    validateRequest({
      cookies: authCookieValidator,
      params: paramSchema,
      query: analyticsQuerySchema,
    }),
    validateSession,
    perm['isAccountOwner'],
    ctrl['handleGetAvgListingDaysOnMarket']
  );

  router.get(
    "/analytics/list-sale-ratio/:id",
    validateRequest({
      cookies: authCookieValidator,
      params: paramSchema,
      query: analyticsQuerySchema,
    }),
    validateSession,
    perm['isAccountOwner'],
    ctrl['handleGetListToSaleRatioForYear']
  );

  router.get(
    "/analytics/time-to-close/:id",
    validateRequest({
      cookies: authCookieValidator,
      params: paramSchema,
      query: analyticsQuerySchema,
    }),
    validateSession,
    perm['isAccountOwner'],
    ctrl['handleGetAvgTimeToCloseLead']
  );
};
