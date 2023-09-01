import { Router } from "express";
import { isAuth } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { cookieSchema } from "../db/validation-schema";
import { getPeriodicSalesVolume } from "../controllers/analytics";

// sales bar graph
// GCI - gross commission income line graph

// year, quarterly, monthly views via search params
export default (router: Router) => {
  router.get("/analytics/sales", validateRequest({ cookies: cookieSchema }), isAuth, getPeriodicSalesVolume);

  router.get("/analytics/gci", validateRequest({ cookies: cookieSchema }), isAuth, () => "yo");
};
