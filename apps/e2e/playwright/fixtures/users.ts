import { insertNewUser, deleteUserByID, findUsersByUsername } from "@propel/drizzle";
import { deleteRedisSession, limiterConsecutiveFailsByEmail } from "@propel/redis";
import { hashPassword } from "@propel/lib";

import type { Page, WorkerInfo } from "@playwright/test";
import type { NewUser } from "@propel/drizzle";

export type User = {
  password: string;
  name: string;
  id: number;
  username: string;
  email: string;
};

export type SignUpUser = Omit<User, "id">;
export type LoginUser = Pick<User, "email" | "password">;

export const createUsersFixture = (page: Page, workerInfo: WorkerInfo) => {
  const users: Array<Pick<NewUser, "username">> = [];

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
      Referer: "http://localhost:9090",
    };
  };
  const PLAYWRIGHT_NAME = "Playwright Test";
  const PLAYWRIGHT_USER = `pw${workerInfo.workerIndex}${Date.now()}`;
  const PLAYWRIGHT_EMAIL = `playwright${workerInfo.workerIndex}-${Date.now()}@gmail.com`;
  const PLAYWRIGHT_PW = "verysecretPassword1!";

  return {
    getMe: async () => {
      const response = await page.request.get("/api/user/me");
      return response;
    },
    login: async (user: LoginUser) => {
      await page.fill("input[name='email']", user.email);
      await page.fill("input[name='password']", user.password);
      await page.getByRole("button", { name: "Sign In" }).click();
    },
    apiLogin: async ({ email, password }: LoginUser) => {
      const headers = await createHeaders();

      await page.request.post("/api/auth/signin", {
        data: {
          email: email,
          password: password,
        },
        headers: headers,
      });
    },
    create: async () => {
      const hashed = await hashPassword(PLAYWRIGHT_PW, 5);
      const testUser = await insertNewUser({
        name: PLAYWRIGHT_NAME,
        username: PLAYWRIGHT_USER,
        email: PLAYWRIGHT_EMAIL,
        hashedPassword: hashed,
      });

      users.push({
        username: testUser?.username as string,
      });

      return { ...testUser, password: PLAYWRIGHT_PW };
    },
    createForSignUp: () => {
      users.push({
        username: PLAYWRIGHT_USER,
      });
      return {
        name: PLAYWRIGHT_NAME,
        username: PLAYWRIGHT_USER,
        email: PLAYWRIGHT_EMAIL,
        password: PLAYWRIGHT_PW,
      };
    },
    signup: async ({ name, email, username, password }: SignUpUser) => {
      await page.fill("input[name='name']", name);
      await page.fill("input[name='username']", username);
      await page.fill("input[name='email']", email);
      await page.fill("input[name='password']", password);

      await page.getByRole("button", { name: "Sign Up" }).click();
    },
    logout: async () => {
      const headers = await createHeaders();

      await page.request.post("/api/auth/signout", {
        data: {},
        headers: headers,
      });
    },
    deleteAll: async () => {
      for (const user of users) {
        const currentUser = await findUsersByUsername(user.username as string);

        await deleteUserByID(currentUser?.id as number);
      }
    },

    deleteSession: async (sessionID: string | undefined) => {
      if (sessionID) {
        deleteRedisSession(sessionID);
      }
    },

    clearRateLimit: async (email: string | Array<string>) => {
      if (Array.isArray(email)) {
        return email.forEach(async (address) => {
          await limiterConsecutiveFailsByEmail.delete(address);
        });
      }
      return await limiterConsecutiveFailsByEmail.delete(email);
    },
  };
};
