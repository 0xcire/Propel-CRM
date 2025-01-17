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
  const { validate: validateRequest } = new ValidateRequestMiddleware();
  const { validateSession } = new ValidateSessionMiddleware();
  const { validateCsrf } = new ValidateCsrfMiddleware();
  const perm = new UserPermissionsMiddleware();
  const ctrl = new UsersController(new UsersService())

  router.get("/user/refresh", validateSession, (_, res: Response) => {
    return res.status(200).json({});
  });

  router.get(
    "/user/me",
    validateRequest({ cookies: authCookieValidator }),
    validateSession,
    ctrl['handleGetCurrentUserInfo']
  );

  router.patch(
    "/user/:id",
    validateRequest({
      body: updateUserValidator,
      params: paramSchema,
      cookies: authCookieValidator,
    }),
    validateSession,
    validateCsrf,
    perm['isAccountOwner'],
    ctrl['handleUpdateUser']
  );

  router.delete(
    "/user/:id",
    validateRequest({ params: paramSchema, cookies: authCookieValidator }),
    validateSession,
    validateCsrf,
    perm['isAccountOwner'],
    ctrl['handleDeleteUser']
  );
};
