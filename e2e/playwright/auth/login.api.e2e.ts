import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";

test.beforeEach(async () => {});

const authCookies = ["absolute-propel-session", "idle-propel-session", "idle"];
const preAuthCookies = ["csrf-token", "pre-auth-session"];

test.describe("cookies are properly set", () => {
  test("auth cookies are handled properly", async ({ page }) => {
    const context = page.context();
    const cookies = await context.cookies();

    await test.step("pre auth cookies are present", async () => {
      preAuthCookies.forEach((preAuthCookie) => {
        expect(cookies.find((cookie) => cookie.name === preAuthCookie)?.value).toBeTruthy();
      });
    });
    await test.step("auth cookies are present", async () => {
      authCookies.forEach((authCookie) => {
        expect(cookies.find((cookie) => cookie.name === authCookie)?.value).toBeFalsy();
      });
    });
  });
});

// test.describe('redis rate limit')
