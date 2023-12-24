import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";
import { TEST_EMAIL } from "../config";

// [ ]: actual monorepo arch?
// [ ]: can just make requests, but certain things like clearing redis cache are necessary
// import type { User } from '@propel/server/types' or etc
// import { redis } from '@propel/packages/lib/redis' or etc -> clean up redis after tests
// import { db } from '@propel/packages/lib/drizzle' or etc

// [ ]: need to test email functionality?

// SIGNIN:
// [x]: user flow happy path -> login, logout
// [x]: api, cookies are handled properly

// SIGNUP:
// [ ]: signup happy path, user can sign up, be redirected to dashboard
// [ ]: test proper response for existing email
// [ ]: proper response for existing username

test.beforeEach(async ({ page, users }) => {
  await page.goto("/");

  const initialUserResponse = await users.getMe();
  expect(initialUserResponse.status()).toEqual(403);
});

test.describe("user login flow", () => {
  test("log in / log out flow", async ({ page, users }) => {
    await test.step("log in", async () => {
      await page.goto("/auth/signin");
      await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

      await users.login();

      await expect(page.locator("[data-testid=dashboard]")).toBeVisible();
    });

    await test.step("log out", async () => {
      await page.locator("[data-testid=nav-dropdown]").click();

      await page.getByText("Logout", { exact: false }).click();

      await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    });
  });
});

test.describe("ambiguous error messages", () => {
  test("for incorrect email and password", async ({ page }) => {
    page.goto("/auth/signin");

    await test.step("incorrect email", async () => {
      await page.fill("input[name='email']", "notreal@gmail.com");
      await page.fill("input[name='password']", "afakepassword");

      await page.getByRole("button", { name: "Sign In" }).click();

      const emailMessage = await expect(
        page.getByText("Incorrect email or password.", { exact: false }).first()
      ).toBeVisible();
    });
    await test.step("incorrect password", async () => {
      await page.fill("input[name='email']", TEST_EMAIL);
      await page.fill("input[name='password']", "notafakepassword");

      await page.getByRole("button", { name: "Sign In" }).click();

      const passwordMessage = await expect(
        page.getByText("Incorrect email or password.", { exact: false }).first()
      ).toBeVisible();
    });
  });
});
