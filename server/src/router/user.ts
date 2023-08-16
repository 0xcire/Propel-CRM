import { Router } from "express";
import { deleteUser, getMyInfo, updateUser } from "../controllers/user";
import { isAuth, isOwner } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { cookieSchema, paramSchema, updateUserSchema } from "../db/validation-schema";

export default (router: Router) => {
  router.get("/user/me", validateRequest({ cookies: cookieSchema }), isAuth, getMyInfo);
  router.patch(
    "/user/:id",
    validateRequest({ body: updateUserSchema, params: paramSchema, cookies: cookieSchema }),
    isAuth,
    isOwner,
    updateUser
  );
  router.delete(
    "/user/:id",
    validateRequest({ params: paramSchema, cookies: cookieSchema }),
    isAuth,
    isOwner,
    deleteUser
  );
};
