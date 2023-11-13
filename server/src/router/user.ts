import { Router } from "express";
import { deleteUser, getMyInfo, updateUser } from "../controllers/user";
import { isAuth, isOwner } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { authCookieValidator, paramSchema, updateUserValidator } from "../db/validation-schema";

export default (router: Router) => {
  router.get("/user/me", validateRequest({ cookies: authCookieValidator }), isAuth, getMyInfo);

  router.patch(
    "/user/:id",
    validateRequest({ body: updateUserValidator, params: paramSchema, cookies: authCookieValidator }),
    isAuth,
    isOwner,
    updateUser
  );

  router.delete(
    "/user/:id",
    validateRequest({ params: paramSchema, cookies: authCookieValidator }),
    isAuth,
    isOwner,
    deleteUser
  );
};
