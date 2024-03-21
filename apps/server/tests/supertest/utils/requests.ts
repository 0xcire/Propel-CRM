import request from "supertest";

// maybe configurable env var
const API_BASE_URL = "http://localhost:9090/api";

export const getHeaderFromResponse = async () => {
  const response = await request(API_BASE_URL).get("/user/me");
  const { header } = response;

  return header;
};

type CustomRequestParams = {
  path: string;
  header: Awaited<ReturnType<typeof getHeaderFromResponse>>;
};

export const sendGetRequestToPath = async ({ path, header }: CustomRequestParams) => {
  const response = await request(API_BASE_URL)
    .get(path)
    .set("Cookie", [...header["set-cookie"]]);

  return response;
};

export const sendPostRequestToPath = async ({ path, header }: CustomRequestParams) => {
  const response = await request(API_BASE_URL)
    .post(path)
    .set("Cookie", [...header["set-cookie"]])
    .set("Header", "X-PROPEL-CSRF");

  return response;
};

export const sendPatchRequestToPath = async ({ path, header }: CustomRequestParams) => {
  const response = await request(API_BASE_URL)
    .patch(path)
    .set("Cookie", [...header["set-cookie"]])
    .set("Header", "X-PROPEL-CSRF");

  return response;
};

export const sendDeleteRequestToPath = async ({ path, header }: CustomRequestParams) => {
  const response = await request(API_BASE_URL)
    .delete(path)
    .set("Cookie", [...header["set-cookie"]])
    .set("Header", "X-PROPEL-CSRF");

  return response;
};
