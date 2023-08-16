import { Router } from "express";
import { isAuth } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { signup, signin, signout } from "../controllers/auth";

import { cookieSchema, signinSchema, signupSchema } from "../db/validation-schema";

export default (router: Router) => {
  router.post("/auth/signup", validateRequest({ body: signupSchema }), signup);
  router.post("/auth/signin", validateRequest({ body: signinSchema, cookies: cookieSchema }), signin);
  router.post("/auth/signout", validateRequest({ cookies: cookieSchema }), isAuth, signout);
};
