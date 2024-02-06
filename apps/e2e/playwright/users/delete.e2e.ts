import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";

test.describe("user can delete account", () => {
  test.beforeEach(async ({ page, users }) => {
    const currentUser = await users.create({});

    await page.goto("/auth/signin");

    await users.login({
      email: currentUser.email as string,
      password: currentUser.password,
    });

    await expect(page.locator("[data-testid=dashboard]")).toBeVisible(); // needed
  });

  test("expected behavior for account delete flow", async ({ page }) => {
    await test.step("user is prompted to confirm deletion", async () => {
      await page.goto("/profile");
      await page.getByRole("button", { name: "Delete Account" }).click();

      await expect(page.getByText("Are you absolutely sure?", { exact: true })).toBeVisible();
    });

    await test.step("user is redirected to signup", async () => {
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();
    });
  });
});
