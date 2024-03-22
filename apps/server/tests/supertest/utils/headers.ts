import request from "supertest";
import { API_BASE_URL } from "../constants";

import type { Header } from "../types";

export const getHeaderFromResponse = async () => {
  const response = await request(API_BASE_URL).get("/user/me");
  const { header } = response;

  return header;
};

export const findCookieByName = (cookies: Array<string>, name: string): string | undefined => {
  return cookies.find((cookie) => cookie.includes(name));
};

export const parseCookieForValue = (cookie: string | undefined): string => {
  if (!cookie) return "";

  return cookie.split(";")[0].split("=")[1];
};

const getCSRFToken = (header: Header): string => {
  const setCookieHeader = header["set-cookie"] as unknown as Array<string>;

  const csrfCookie = findCookieByName(setCookieHeader, "csrf-token");
  const csrfToken = parseCookieForValue(csrfCookie);

  return csrfToken;
};

export const generateBaseHeaders = (header: Header) => {
  const cookiesString = [...header["set-cookie"]].join();

  return {
    Cookie: cookiesString,
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Propel-CSRF": getCSRFToken(header),
    Referer: "http://localhost:9090",
  };
};
