import { Router } from "express";
import { deleteUser, getMyInfo, updateUser } from "../controllers/user";
import { isAuth, isOwner, validateRequest } from "../middlewares";
import { cookieSchema, paramSchema, updateUserSchema } from "../db/drizzle-zod";

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
