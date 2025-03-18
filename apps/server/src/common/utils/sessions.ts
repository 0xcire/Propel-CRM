import { isDeployed } from "../utils";
import { sessionRelatedCookies } from "../config";

import type { Ctx } from "../../types";


export const removeAuthSessionCookies = ({ req, res }: Ctx) => {
  sessionRelatedCookies.forEach((cookie) => {
    res.clearCookie(cookie, {
      path: "/",
      domain: isDeployed(req) ? ".cire.sh" : undefined,
      sameSite: "lax",
    });
  });
};
