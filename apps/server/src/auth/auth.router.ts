import { Router } from "express";
import {
  accountRecoveryValidator,
  authCookieValidator,
  paramSchema,
  signinValidator,
  signupValidator,
  updateUserFromRecoveryValidator,
  verifyEmailQueryValidator,
} from "@propel/drizzle";
import {
  rateLimitSignIn,
  rateLimitAccountRecovery,
  rateLimitAccountVerification,
} from "../middlewares/rate-limit";


import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ValidateRequestMiddleware } from "../common/middleware/validate-request";
import { ValidateSessionMiddleware } from "../common/middleware/validate-session";
import { UserPermissionsMiddleware } from "../common/middleware/user-permissions";
import { ValidateCsrfMiddleware } from "../common/middleware/validate-csrf";
import { PRE_AUTH_SESSION_COOKIE } from "../common/config";

export default (router: Router) => {
    const { validate: validateRequest } = new ValidateRequestMiddleware();
    const { validateSession, validatePreAuthSession } = new ValidateSessionMiddleware();
    const { validateCsrf } = new ValidateCsrfMiddleware();
    const perm = new UserPermissionsMiddleware();
    const ctrl = new AuthController(new AuthService())
    
  router.post(
    "/auth/signup",
    // TODO: rename signUpDto,
    // TODO: all these terribly named xValidator, xSchema bullsht needs to be renamed xDto, this is dumb. lol
    // or at the very least make it consistent w/ xValidator or xSchema. but Dto is preferred i think
    validateRequest({ body: signupValidator }),
    validatePreAuthSession,
    ctrl['handleSignUp']
  );

  router.post(
    "/auth/signin",
    validateRequest({ body: signinValidator }),
    validatePreAuthSession,
    validateCsrf,
    rateLimitSignIn,
    ctrl['handleSignIn']
  );

  router.post(
    "/auth/signout",
    validateRequest({ cookies: authCookieValidator }),
    validateSession,
    validateCsrf,
    ctrl['handleSignOut']
  );

  router.get(
    "/auth/recovery/:id",
    validateRequest({ params: paramSchema }),
    validatePreAuthSession,
    ctrl['handleValidateTempRecoverySession']
  );

  router.post(
    "/auth/recovery",
    validateRequest({
      body: accountRecoveryValidator,
    }),
    validatePreAuthSession,
    validateCsrf,
    rateLimitAccountRecovery,
    ctrl['handleInitAccountRecovery']
  );

  router.patch(
    "/auth/recovery/:id",
    validateRequest({
      body: updateUserFromRecoveryValidator,
      params: paramSchema,
    }),
    validatePreAuthSession,
    validateCsrf,
    ctrl['handleUpdateUserFromAccountRecovery']
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
    validateCsrf,
    ctrl['handleVerifyEmail']
  );

  router.post(
    "/auth/verify-email/:id",
    validateRequest({
      params: paramSchema,
    }),
    validateSession,
    perm['isAccountOwner'],
    validateCsrf,
    rateLimitAccountVerification, // TODO: potentially refactor
    ctrl['handleInitNewEmailVerification']
  );
};
