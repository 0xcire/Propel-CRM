import { Router } from "express";
import { isAuth, validateRequest } from "../middlewares";
import { signup, signin, signout } from "../controllers/auth";

import { cookieSchema, signinSchema, signupSchema } from "../db/drizzle-zod";

// const authValidateSchema = {
//   body: signupSchema,
//   cookies: cookieSchema,
//   queries: undefined,
//   params: undefined
// };

export default (router: Router) => {
  router.post("/auth/signup", validateRequest({ body: signupSchema }), signup);
  router.post("/auth/signin", validateRequest({ body: signinSchema, cookies: cookieSchema }), signin);
  router.post("/auth/signout", validateRequest({ cookies: cookieSchema }), isAuth, signout);
};
