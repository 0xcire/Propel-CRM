import request from "supertest";
import { API_BASE_URL } from "../constants";

import type { Header } from "../types";
import { generateBaseHeaders } from "./headers";

type Method = "post" | "patch" | "delete";
type CustomRequestParams = {
  path: string;
  header: Header;
  method?: Method;
  data?: Record<string, string>;
};

export const sendGetRequestToPath = async ({ path, header }: CustomRequestParams) => {
  const response = await request(API_BASE_URL)
    .get(path)
    .set("Cookie", [...header["set-cookie"]]);

  return response;
};

export const sendMutationRequestToPath = async ({ method, path, header, data }: CustomRequestParams) => {
  const baseHeaders = generateBaseHeaders(header);

  const response = await request(API_BASE_URL)[method as Method](path).send(data).set(baseHeaders);

  return response;
};
