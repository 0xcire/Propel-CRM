import { removeAuthSessionCookies, removeSessionPersistence } from "../../utils";
import { ABSOLUTE_SESSION_COOKIE } from "../../config";

import type { Request, Response } from "express";

export const signout = async (req: Request, res: Response) => {
  try {
    const sessionID = req.signedCookies[ABSOLUTE_SESSION_COOKIE as string];

    await removeSessionPersistence(req, sessionID);

    removeAuthSessionCookies(req, res);

    return res.status(200).json({
      message: "Signing out.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
