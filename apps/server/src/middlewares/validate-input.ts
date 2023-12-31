import { AnyZodObject, ZodEffects, ZodError } from "zod";
import { objectNotEmpty } from "../utils";
import { getRequestBodies } from "../config";

import type { Request, Response, NextFunction } from "express";

type SchemaParams = {
  body?: AnyZodObject | ZodEffects<ZodEffects<AnyZodObject>> | ZodEffects<AnyZodObject>;
  cookies?: ZodEffects<AnyZodObject>;
  query?: ZodEffects<AnyZodObject>;
  params?: ZodEffects<AnyZodObject>;
};

export const validateRequest = (schema: SchemaParams) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBodies = getRequestBodies(req);

      for (let body of requestBodies) {
        const context = body.context as keyof SchemaParams;
        if (schema[context] && objectNotEmpty(body.data)) {
          const validatedData = await schema[context]?.parseAsync(body.data);
          body.data = validatedData;
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
