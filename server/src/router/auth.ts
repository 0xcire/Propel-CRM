import { Router } from "express";
import { signup, signin, signout } from "../controllers/auth";
import { isAuth, isOwner } from "../middlewares";

export default (router: Router) => {
  router.post("/auth/signup/", signup);
  router.post("/auth/signin", signin);
  router.post("/auth/signout", isAuth, signout);
};
