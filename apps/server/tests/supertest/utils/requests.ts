/* eslint-disable no-unexpected-multiline */
import request from "supertest";
import { API_BASE_URL } from "../constants";

import { generateBaseHeaders, getHeaderFromResponse } from "./headers";
import { Header } from "../types";

type Method = "post" | "patch" | "delete";
type CustomRequestParams<T> = {
  path: string;
  method?: Method;
  header?: Header;
  data?: T;
};

export const sendGetRequestToPath = async ({ path, header }: CustomRequestParams<Record<string, string>>) => {
  const initHeaders = await getHeaderFromResponse();

  const cookie = header ? [...header["set-cookie"]] : [...initHeaders["set-cookie"]];

  const response = await request(API_BASE_URL).get(path).set("Cookie", cookie);

  return response;
};

export const sendMutationRequestToPath = async <T extends Record<string, unknown>>({
  method,
  path,
  header,
  data,
}: CustomRequestParams<T>) => {
  const initHeaders = await getHeaderFromResponse();
  const baseHeaders = header ? generateBaseHeaders(header) : generateBaseHeaders(initHeaders);

  const cookie = header ? [...header["set-cookie"]] : [...initHeaders["set-cookie"]];

  const response = await request(API_BASE_URL)
    [method as Method](path)
    .send(data)
    .set(baseHeaders)
    .set("Cookie", cookie);

  return response;
};

export const logIn = async (email = "test@gmail.com", password = "testtest"): Promise<Header> => {
  const { headers: authHeaders } = await sendMutationRequestToPath({
    method: "post",
    path: "/auth/signin",
    data: {
      email: email,
      password: password,
    },
  });

  return authHeaders;
};
