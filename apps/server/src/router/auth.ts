import { Router } from "express";

import { validatePreAuthSession, validateSession } from "../middlewares/validate-session";
import { validateCSRF } from "../middlewares/validate-csrf";

import { validateRequest } from "../middlewares/validate-input";

import { signup, signin, signout } from "../controllers/auth";

import { authCookieValidator, signinValidator, signupValidator } from "@propel/drizzle/schema/validation-schema";

export default (router: Router) => {
  router.post(
    "/auth/signup",
    validateRequest({ body: signupValidator }),
    validatePreAuthSession,
    validateCSRF, //
    signup
  );

  router.post(
    "/auth/signin",
    validateRequest({ body: signinValidator }),
    validatePreAuthSession,
    validateCSRF, //
    signin
  );
  router.post(
    "/auth/signout",
    validateRequest({ cookies: authCookieValidator }),
    validateSession,
    validateCSRF,
    signout
  );
};
