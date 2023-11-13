import { Router } from "express";
import { isAuth } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { signup, signin, signout } from "../controllers/auth";

import { authCookieValidator, signinValidator, signupValidator } from "../db/validation-schema";

export default (router: Router) => {
  router.post("/auth/signup", validateRequest({ body: signupValidator }), signup);
  router.post("/auth/signin", validateRequest({ body: signinValidator }), signin);
  router.post("/auth/signout", validateRequest({ cookies: authCookieValidator }), isAuth, signout);
};
