import { Router } from "express";
import { isAuth } from "../middlewares";
import { signup, signin, signout } from "../controllers/auth";

export default (router: Router) => {
  router.post("/auth/signup", signup);
  router.post("/auth/signin", signin);
  router.post("/auth/signout", isAuth, signout);
};
