import { Response, Router } from "express";

import { deleteUser, getMyInfo, updateUser } from "../controllers/user";

import { isOwner } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { validateCSRF } from "../middlewares/validate-csrf";
import { validateSession } from "../middlewares/validate-session";

import { authCookieValidator, paramSchema, updateUserValidator } from "@propel/drizzle";

export default (router: Router) => {
  router.get("/user/refresh", validateSession, (_, res: Response) => {
    return res.status(200).json({});
  });

  router.get("/user/me", validateRequest({ cookies: authCookieValidator }), validateSession, getMyInfo);

  router.patch(
    "/user/:id",
    validateRequest({ body: updateUserValidator, params: paramSchema, cookies: authCookieValidator }),
    validateSession,
    validateCSRF,
    isOwner,
    updateUser
  );

  router.delete(
    "/user/:id",
    validateRequest({ params: paramSchema, cookies: authCookieValidator }),
    validateSession,
    validateCSRF,
    isOwner,
    deleteUser
  );
};
