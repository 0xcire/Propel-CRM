import type { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";

export type MiddlewareResponse = Response | void;

export interface RequestBody {
  context: "body" | "cookies" | "query" | "params";
  data:
    | Request["body"]
    | Request["signedCookies"]
    | Request["query"]
    | Request["params"];
}

export type SchemaParams = {
  body?:
    | AnyZodObject
    | ZodEffects<ZodEffects<AnyZodObject>>
    | ZodEffects<AnyZodObject>;
  cookies?: ZodEffects<AnyZodObject>;
  query?: ZodEffects<AnyZodObject>;
  params?: ZodEffects<AnyZodObject>;
};

export interface IValidateRequest {
  validateCsrf(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse>;
  validateInput(
    schema: SchemaParams
  ): (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<MiddlewareResponse>;
  validateSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse>;
  validatePreAuthSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<MiddlewareResponse>;
}
