import { Router } from "express";

import { validatePreAuthSession, validateSession, validateSessionFromUserEmail } from "../middlewares/validate-session";
import { validateCSRF } from "../middlewares/validate-csrf";

import { validateRequest } from "../middlewares/validate-input";

import {
  signup,
  signin,
  signout,
  recoverPassword,
  getValidRecoveryRequest,
  updateUserFromAccountRecovery,
  verifyEmail,
  requestNewEmailVerification,
} from "../controllers/auth";

import {
  accountRecoveryValidator,
  authCookieValidator,
  paramSchema,
  signinValidator,
  signupValidator,
  updateUserFromRecoveryValidator,
  verifyEmailQueryValidator,
} from "@propel/drizzle";
import { isOwner } from "../middlewares";

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

  router.patch(
    //
    "/auth/verify-email",
    validateRequest({
      params: paramSchema,
      query: verifyEmailQueryValidator,
    }),
    validateSessionFromUserEmail,
    validateCSRF,
    verifyEmail
  );

  router.post(
    //
    "/auth/verify-email/:id",
    validateRequest({
      params: paramSchema,
    }),
    validateSession,
    isOwner,
    validateCSRF,
    requestNewEmailVerification
  );
};
