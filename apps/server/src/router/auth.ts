import { Router } from "express";

import { validatePreAuthSession, validateSession } from "../middlewares/validate-session";
import { validateCSRF } from "../middlewares/validate-csrf";

import { validateRequest } from "../middlewares/validate-input";
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
import {
  signin,
  signup,
  signout,
  requestPasswordRecovery,
  getValidRecoveryRequest,
  updateUserFromAccountRecovery,
  verifyEmail,
  requestNewEmailVerification,
} from "../controllers/auth";
import { PRE_AUTH_SESSION_COOKIE } from "../config";

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
    // rateLimitRequestByUserEmail, -> [ ]: not sure why this didn't come to mind. refactor rate limit code into middleware
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
    // rateLimitRequestByUserEmail,
    requestPasswordRecovery
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
    "/auth/verify-email",
    validateRequest({
      query: verifyEmailQueryValidator,
    }),
    (req, res, next) => {
      if (req.signedCookies[PRE_AUTH_SESSION_COOKIE]) {
        validatePreAuthSession(req, res, next);
      } else {
        validateSession(req, res, next);
      }
    },
    validateCSRF,
    verifyEmail
  );

  router.post(
    "/auth/verify-email/:id",
    validateRequest({
      params: paramSchema,
    }),
    validateSession,
    isOwner,
    validateCSRF,
    // rateLimitRequestByUserID,
    requestNewEmailVerification
  );
};
