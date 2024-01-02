import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";

test.beforeEach(async ({ users }) => {
  await users.getMe();
});

const authCookies = ["absolute-propel-session", "idle-propel-session", "idle"];
const preAuthCookies = ["pre-auth-session"];

test.describe("cookies are properly set", () => {
  test.afterEach(async ({ users }) => {
    await users.logout();
    await users.deleteAll();
  });

  test("pre auth cookies are handled properly", async ({ page }) => {
    await page.goto("/");
    const context = page.context();
    const cookies = await context.cookies();

    preAuthCookies.forEach((preAuthCookie) => {
      expect(cookies.find((cookie) => cookie.name === preAuthCookie)?.value).toBeTruthy();
    });
    authCookies.forEach((authCookie) => {
      expect(cookies.find((cookie) => cookie.name === authCookie)?.value).toBeFalsy();
    });
  });

  test("auth cookies are handled properly", async ({ page, users }) => {
    const currentUser = await users.create();

    await users.apiLogin({
      email: currentUser?.email as string,
      password: currentUser?.password as string,
    });
    await page.goto("/dashboard");
    await users.getMe();

    const context = page.context();
    const cookies = await context.cookies();

    preAuthCookies.forEach((preAuthCookie) => {
      expect(cookies.find((cookie) => cookie.name === preAuthCookie)?.value).toBeFalsy();
    });
    authCookies.forEach((authCookie) => {
      expect(cookies.find((cookie) => cookie.name === authCookie)?.value).toBeTruthy();
    });
  });
});
