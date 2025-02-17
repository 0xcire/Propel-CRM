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

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service"
import { RateLimitMiddleware } from "./auth.middleware";
import { ValidateRequestMiddleware } from "../common/middleware/validate-request";
import { ValidateSessionMiddleware } from "../common/middleware/validate-session";
import { UserPermissionsMiddleware } from "../common/middleware/user-permissions";
import { ValidateCsrfMiddleware } from "../common/middleware/validate-csrf";
import { PRE_AUTH_SESSION_COOKIE } from "../common/config";

export const AuthRouter = (router: Router) => {
    const r = new ValidateRequestMiddleware();
    const s = new ValidateSessionMiddleware();
    const c = new ValidateCsrfMiddleware();
    const rl = new RateLimitMiddleware();
    const perm = new UserPermissionsMiddleware();
    const service = new AuthService();
    const ctrl = new AuthController(service)
    
  router.post(
    "/auth/signup",
    // TODO: rename signUpDto,
    // TODO: all these terribly named xValidator, xSchema bullsht needs to be renamed xDto, this is dumb. lol
    // or at the very least make it consistent w/ xValidator or xSchema. but Dto is preferred i think - source: my tenured 9 months of total exp :D
    r.validateRequest({ body: signupValidator }),
    s.validatePreAuthSession,
    ctrl['handleSignUp']
  );

  router.post(
    "/auth/signin",
    r.validateRequest({ body: signinValidator }),
    s.validatePreAuthSession,
    c.validateCsrf,
    rl.signInRl,
    ctrl['handleSignIn']
  );

  router.post(
    "/auth/signout",
    r.validateRequest({ cookies: authCookieValidator }),
    s.validateSession,
    c.validateCsrf,
    ctrl['handleSignOut']
  );

  router.get(
    "/auth/recovery/:id",
    r.validateRequest({ params: paramSchema }),
    s.validatePreAuthSession,
    ctrl['handleValidateTempRecoverySession']
  );

  router.post(
    "/auth/recovery",
    r.validateRequest({
      body: accountRecoveryValidator,
    }),
    s.validatePreAuthSession,
    c.validateCsrf,
    rl.accountRecoveryRl,
    ctrl['handleInitAccountRecovery']
  );

  router.patch(
    "/auth/recovery/:id",
    r.validateRequest({
      body: updateUserFromRecoveryValidator,
      params: paramSchema,
    }),
    s.validatePreAuthSession,
    c.validateCsrf,
    ctrl['handleUpdateUserFromAccountRecovery']
  );

  router.patch(
    "/auth/verify-email",
    r.validateRequest({
      query: verifyEmailQueryValidator,
    }),
    (req, res, next) => {
      if (req.signedCookies[PRE_AUTH_SESSION_COOKIE]) {
        s.validatePreAuthSession(req, res, next);
      } else {
        s.validateSession(req, res, next);
      }
    },
    c.validateCsrf,
    ctrl['handleVerifyEmail']
  );

  router.post(
    "/auth/verify-email/:id",
    r.validateRequest({
      params: paramSchema,
    }),
    s.validateSession,
    perm['isAccountOwner'],
    c.validateCsrf,
    rl.accountVerificationRl,
    ctrl['handleInitNewEmailVerification']
  );
};
