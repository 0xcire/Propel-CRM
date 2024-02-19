import { ZodError } from "zod";
import { RateLimiterRes } from "@propel/redis";
import { PropelHTTPError } from "../lib/http-error";

import { handleRateLimitErrorResponse } from "../lib";

import type { Response } from "express";

// [ ]: ideally this is a global error handler?
// apparently one of the major gripes with express
export const handleError = (error: unknown, res: Response) => {
  console.log(error);

  if (error instanceof ZodError) {
    return res.status(422).json({
      message: "Invalid inputs on request.",
    });
  }

  if (error instanceof RateLimiterRes) {
    return handleRateLimitErrorResponse(error, res);
  }

  if (error instanceof PropelHTTPError) {
    return res.status(error.code).json({
      message: error.message,
    });
  }

  return res.status(500).json({});
};
