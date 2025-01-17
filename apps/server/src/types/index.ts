import { Limit } from "@propel/types";
import { PropelHTTPError } from "../lib/http-error";
import type { Request, Response } from 'express'

// handler = (req, res): Promise<PropelResponse | PropelError> => { return }

export type PropelResponse = {
  message: string;
  data: unknown;
};

export type PropelError = IPropelHTTPError;

// [ ]: type PropelError { code: number, message: string }
// in try:   throw new PropelError
// in catch: if (error instanceof PropelError) { return res.status(error.code).json({message: error.message })}

export type IPropelHTTPError = InstanceType<typeof PropelHTTPError>;

// export type PropelError =

export type Ctx = {
  req: Request,
  res: Response
}

export type PaginationQuery = {
  page: number;
  limit: Limit;
}
