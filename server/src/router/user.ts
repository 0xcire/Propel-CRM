import { Router } from "express";
import { getMyInfo } from "../controllers/user";
import { isAuth, isOwner } from "../middlewares";

export default (router: Router) => {
  router.get("/user/me", isAuth, getMyInfo);
  //   router.post("/auth/signup/", signup);
  //   router.post("/auth/signin", signin);
  //   router.post("/auth/signout", isAuth, signout);
};
