import { response, type Response } from "express";

export const PropelResponse = (code: 200 | 201, data: object): Response => {
  return response.status(code).json(data);
};
