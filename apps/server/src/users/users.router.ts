import { Router } from "express";
import {
  authCookieValidator,
  paramSchema,
  updateUserValidator,
} from "@propel/drizzle";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UserPermissionsMiddleware } from "../common/middleware/user-permissions";
import { ValidateCsrfMiddleware } from "../common/middleware/validate-csrf";
import { ValidateSessionMiddleware } from "../common/middleware/validate-session";
import { ValidateRequestMiddleware } from "../common/middleware/validate-request";

import type { Response } from 'express'

export default (router: Router) => {
  const vr = new ValidateRequestMiddleware();
  const vs = new ValidateSessionMiddleware();
  const vc = new ValidateCsrfMiddleware();
  const perm = new UserPermissionsMiddleware();

  const service = new UsersService()
  const ctrl = new UsersController(service)

  router.get("/user/refresh", vs.validateSession, (_, res: Response) => {
    return res.status(200).json({});
  });

  router.get(
    "/user/me",
    vr.validateRequest({ cookies: authCookieValidator }),
    vs.validateSession,
    ctrl.handleGetCurrentUserInfo
  );

  router.patch(
    "/user/:id",
    vr.validateRequest({
      body: updateUserValidator,
      params: paramSchema,
      cookies: authCookieValidator,
    }),
    vs.validateSession,
    vc.validateCsrf,
    perm['isAccountOwner'],
    ctrl['handleUpdateUser']
  );

  router.delete(
    "/user/:id",
    vr.validateRequest({ params: paramSchema, cookies: authCookieValidator }),
    vs.validateSession,
    vc.validateCsrf,
    perm['isAccountOwner'],
    ctrl['handleDeleteUser']
  );
};
