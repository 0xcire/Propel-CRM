import { type Response } from "express";

export const PropelResponse = (res: Response, code: 200 | 201, data: object): Response => {
  return res.status(code).json(data);
};