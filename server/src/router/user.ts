import { Router } from "express";
import { deleteUser, getMyInfo, updateUser } from "../controllers/user";
import { isAuth, isOwner } from "../middlewares";

export default (router: Router) => {
  router.get("/user/me", isAuth, getMyInfo);
  router.patch("/user/:id", isAuth, isOwner, updateUser);
  router.delete("/user/:id", isAuth, isOwner, deleteUser);
};
