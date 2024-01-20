import { Router } from "express";

import { validatePreAuthSession, validateSession } from "../middlewares/validate-session";
import { validateCSRF } from "../middlewares/validate-csrf";

import { validateRequest } from "../middlewares/validate-input";

import { signup, signin, signout, recoverPassword } from "../controllers/auth";

import { accountRecoveryValidator, authCookieValidator, signinValidator, signupValidator } from "@propel/drizzle";

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

  router.post(
    "/auth/recovery",
    validateRequest({
      body: accountRecoveryValidator,
    }),
    validatePreAuthSession,
    validateCSRF,
    recoverPassword
  );
};
