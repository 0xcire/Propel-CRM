import type { Request, Response, NextFunction } from "express";
import { findUsersBySessionToken } from "../db/queries/user";
import { SESSION_COOKIE_NAME } from "../config";
import { type AnyZodObject, ZodEffects, ZodError } from "zod";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME as string];

    if (!sessionToken) {
      return res.status(403).json({
        message: "Session does not exist",
      });
    }

    const userByToken = await findUsersBySessionToken(sessionToken);

    if (!userByToken) {
      return res.status(403).json({
        message: "Can't find user.",
      });
    }

    // if (userByToken.sessionToken !== sessionToken) {
    //   return res.status(403).json({
    //     message: "Invalid session.",
    //   });
    // }

    if (userByToken.id && userByToken.username) {
      req.user = {
        id: userByToken.id,
        username: userByToken.username,
      };
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({});
  }
};

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authenticatedUserID = req.user.id;

    if (!authenticatedUserID) {
      return res.status(403).json({
        message: "Not authenticated.",
      });
    }

    if (authenticatedUserID.toString() !== id) {
      return res.status(403).json({
        message: "Can only perform this operation on your own account.",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({});
  }
};

// []
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if ("this is a string") {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

type SchemaParams = {
  body?: ZodEffects<ZodEffects<AnyZodObject>> | ZodEffects<AnyZodObject> | AnyZodObject;
  cookies?: ZodEffects<AnyZodObject>;
  query?: ZodEffects<AnyZodObject>;
  params?: ZodEffects<AnyZodObject>;
};

export const validateRequest = (schema: SchemaParams) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body && Object.keys(req.body).length > 0) {
        console.log("BEFORE PARSE", req.body);
        const validatedRequestBody = await schema.body.parseAsync(req.body);
        req.body = validatedRequestBody;
        console.log("AFTER PARSE", req.body);
      }

      if (schema.cookies && Object.keys(req.cookies).length > 0) {
        const validatedCookiesBody = await schema.cookies.parseAsync(req.cookies);
        req.cookies = validatedCookiesBody;
      }

      if (schema.query && Object.keys(req.query).length > 0) {
        const validatedQueryBody = await schema.query.parseAsync(req.query);
        req.query = validatedQueryBody;
      }

      if (schema.params && Object.keys(req.params).length > 0) {
        const validatedParamBody = await schema.params.parseAsync(req.params);
        req.params = validatedParamBody;
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("THIS IS PROBABLY FROM PARAM SCHEMA", error);
        return res.status(400).json({
          message: "Invalid inputs on request.",
        });
      }
      return res.status(400).json({});
    }
  };
};
