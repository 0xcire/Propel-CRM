import { handleError, objectNotEmpty } from "../utils";

import type { Request, Response, NextFunction } from "express";
import type { RequestBody, SchemaParams } from "./types";

export class ValidateRequestMiddleware  {
    public validate(schema: SchemaParams) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const requestBodies = this.getRequestBodies(req);
        
                for (const body of requestBodies) {
                  const context = body.context as keyof SchemaParams;
                  if (schema[context] && objectNotEmpty(body.data)) {
                    const validatedData = await schema[context]?.parseAsync(body.data);
                    body.data = validatedData;
                  }
                }
        
                return next();
              } catch (error) {
                return handleError(error, res);
              }
        }
    }

    private getRequestBodies(req: Request): Array<RequestBody> {
        return [
          {
            context: "body",
            data: req.body,
          },
          {
            context: "cookies",
            data: req.signedCookies,
          },
          {
            context: "query",
            data: req.query,
          },
          {
            context: "params",
            data: req.params,
          },
        ];
      }
}