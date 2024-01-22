import { Router } from "express";

import { validatePreAuthSession, validateSession } from "../middlewares/validate-session";
import { validateCSRF } from "../middlewares/validate-csrf";

import { validateRequest } from "../middlewares/validate-input";

import {
  signup,
  signin,
  signout,
  recoverPassword,
  getValidRecoveryRequest,
  updateUserFromAccountRecovery,
} from "../controllers/auth";

import {
  accountRecoveryValidator,
  authCookieValidator,
  paramSchema,
  signinValidator,
  signupValidator,
  updateUserFromRecoveryValidator,
} from "@propel/drizzle";

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

  router.get(
    "/auth/recovery/:id",
    validateRequest({ params: paramSchema }),
    validatePreAuthSession,
    getValidRecoveryRequest
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

  router.patch(
    "/auth/recovery/:id",
    validateRequest({
      body: updateUserFromRecoveryValidator,
      params: paramSchema,
    }),
    validatePreAuthSession,
    validateCSRF,
    updateUserFromAccountRecovery
  );

  router.delete(
    "/auth/recovery/:id",
    validateRequest({}),
    validatePreAuthSession,
    //
    validateCSRF,
    () => {
      return 0;
    }
  );
};
