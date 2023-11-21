import { Router } from "express";
import { validateCSRF, validateSession } from "../middlewares";
import { validateRequest } from "../middlewares/validate-input";
import { signup, signin, signout } from "../controllers/auth";

import { authCookieValidator, signinValidator, signupValidator } from "../db/validation-schema";

export default (router: Router) => {
  router.post("/auth/signup", validateRequest({ body: signupValidator }), signup);
  router.post("/auth/signin", validateRequest({ body: signinValidator }), validateCSRF, signin);
  router.post(
    "/auth/signout",
    validateRequest({ cookies: authCookieValidator }),
    validateSession,
    validateCSRF,
    signout
  );
};
