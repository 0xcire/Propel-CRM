import { response, type Response } from "express";

export const propelResponse = <T>({ code, data }: { code: 200 | 201; data: T }): Response => {
  return response.status(code).json({
    data: data,
  });
};
