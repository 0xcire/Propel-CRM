import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";
import { TEST_EMAIL, TEST_USER } from "../config";

test.describe("user sign up flow", () => {
  test("user can sign up", async ({ page, users }) => {
    await test.step("sign up", async () => {
      await page.goto("/auth/signup");
      await users.signup();

      await expect(page.locator("[data-testid=dashboard]")).toBeVisible();
    });

    await test.step("delete account", async () => {
      await page.goto("/profile");
      await page.getByRole("button", { name: "Delete Account" }).click();
      await page.getByRole("button", { name: "Continue" }).click();

      await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();
    });
  });
});

test.describe("no duplicate identifiers", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signup");
  });
  test("unique emails", async ({ page }) => {
    await page.fill("input[name='name']", "Playwright Test");
    await page.fill("input[name='username']", `a-${Date.now()}`);
    await page.fill("input[name='email']", TEST_EMAIL);
    await page.fill("input[name='password']", "VerySecretPassword1!");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Email already exists.", { exact: true })).toBeVisible();
  });
  test("unique usernames", async ({ page }) => {
    await page.fill("input[name='name']", "Playwright Test");
    await page.fill("input[name='username']", TEST_USER);
    await page.fill("input[name='email']", "generic@gmail.com");
    await page.fill("input[name='password']", "VerySecretPassword1!");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Username not available. Please pick another.", { exact: true })).toBeVisible();
  });
});
