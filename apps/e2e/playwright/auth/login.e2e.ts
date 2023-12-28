import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";
import { TEST_EMAIL } from "../config";

// import { db } from "@propel/drizzle";
// [ ]: need to test email functionality?

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

      await expect(page.getByText("Incorrect email or password.", { exact: false }).first()).toBeVisible();
    });
    await test.step("incorrect password", async () => {
      await page.fill("input[name='email']", TEST_EMAIL);
      await page.fill("input[name='password']", "notafakepassword");

      await page.getByRole("button", { name: "Sign In" }).click();

      await expect(page.getByText("Incorrect email or password.", { exact: false }).first()).toBeVisible();
    });
  });
});
