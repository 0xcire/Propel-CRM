// import { expect } from "@playwright/test";
import type { Page, WorkerInfo } from "@playwright/test";
import { TEST_EMAIL, TEST_PW } from "../config";

// configure mono repo for code sharing, especially TYPES!!
// would be nice to import db and run sql statements instead of making requests

interface UserInfo {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface User extends UserInfo {
  workerIdx: number;
}

export const createUsersFixture = (page: Page, workerInfo: WorkerInfo) => {
  const users: Array<User> = [];

  const csrfToken = async () => {
    const cookies = await page.context().cookies();
    const csrfCookie = cookies.find((cookie) => cookie.name === "csrf-token");

    return csrfCookie?.value;
  };

  const createHeaders = async () => {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Propel-CSRF": (await csrfToken()) ?? "",
    };
  };
  const PLAYWRIGHT_NAME = "Playwright Test";
  const PLAYWRIGHT_USER = `playwright${workerInfo.workerIndex}`;
  const PLAYWRIGHT_EMAIL = `playwright${workerInfo.workerIndex}@gmail.com`;
  const PLAYWRIGHT_PW = "verysecretPassword1!";

  return {
    getMe: async () => {
      const response = await page.request.get("/api/user/me");
      return response;
    },
    login: async () => {
      await page.fill("input[name='email']", TEST_EMAIL);
      await page.fill("input[name='password']", TEST_PW);
      await page.getByRole("button", { name: "Sign In" }).click();
    },
    apiLogin: async () => {
      const headers = await createHeaders();

      const response = await page.request.post("/api/auth/signin", {
        data: {
          email: TEST_EMAIL,
          password: TEST_PW,
        },
        headers: headers,
      });
    },
    create: async () => {
      const headers = await createHeaders();

      const response = await page.request.post("/api/auth/signup", {
        data: {
          name: PLAYWRIGHT_NAME,
          username: PLAYWRIGHT_USER,
          email: PLAYWRIGHT_EMAIL,
          password: PLAYWRIGHT_PW,
        },
        headers: headers,
      });
      const json: { message: string; user: UserInfo } = await response.json();
      const user = json.user;
      users.push({ workerIdx: workerInfo.workerIndex, ...user });
    },
    signup: async () => {
      await page.fill("input[name='name']", PLAYWRIGHT_NAME);
      await page.fill("input[name='username']", PLAYWRIGHT_USER);
      await page.fill("input[name='email']", PLAYWRIGHT_EMAIL);
      await page.fill("input[name='password']", PLAYWRIGHT_PW);
      await page.getByRole("button", { name: "Sign Up" }).click();
    },
    logout: async () => {
      const headers = await createHeaders();

      const response = await page.request.post("/api/auth/signout", {
        data: {},
        headers: headers,
      });
    },
    deleteAll: async () => {
      const headers = await createHeaders();

      for (const user of users) {
        await page.request.delete(`/api/user/${user.id}`, {
          data: {},
          headers: headers,
        });
      }
    },
    delete: async (workerIdx: number) => {
      const headers = await createHeaders();
      const userID = users.find((user) => user.workerIdx === workerIdx);

      const response = await page.request.delete(`/api/user/${userID}`, {
        data: {},
        headers: headers,
      });
    },
  };
};
