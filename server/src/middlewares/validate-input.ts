import type { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodEffects, ZodError } from "zod";
import { objectNotEmpty } from "../utils";
import { getRequestBodies } from "../config";

type SchemaParams = {
  body?: ZodEffects<ZodEffects<AnyZodObject>> | ZodEffects<AnyZodObject>;
  cookies?: ZodEffects<AnyZodObject>;
  query?: ZodEffects<AnyZodObject>;
  params?: ZodEffects<AnyZodObject>;
};

export const validateRequest = (schema: SchemaParams) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBodies = getRequestBodies(req);

      for (let body of requestBodies) {
        if (schema[body.source as keyof SchemaParams] && objectNotEmpty(body.data)) {
          const validatedBody = await schema[body.source as keyof SchemaParams]?.parseAsync(body.data);
          body.data = validatedBody;
        }
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: "Invalid inputs on request.",
        });
      }
      return res.status(400).json({});
    }
  };
};
