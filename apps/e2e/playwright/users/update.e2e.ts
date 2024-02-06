import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";

import type { User } from "../fixtures/users";

test.describe("user can update account information", () => {
  let currentUser: User;

  test.beforeEach(async ({ page, users }) => {
    currentUser = (await users.create({})) as User;

    await page.goto("/auth/signin");

    await users.login({
      email: currentUser.email as string,
      password: currentUser.password,
    });

    await expect(page.locator("[data-testid=dashboard]")).toBeVisible();
    await page.goto("/profile");
  });

  test.afterEach(async ({ users }) => {
    await users.logout();
    await users.deleteAll();
  });

  test("update username and email", async ({ page }) => {
    await page.getByRole("button", { name: "Edit" }).locator("nth=0").click();
    await page.fill("input[name='username']", "AWholeNewWorld");

    await page.getByRole("button", { name: "Edit" }).locator("nth=1").click();
    await page.fill("input[name='email']", "pwizzle@gmail.com");

    await page.getByRole("button", { name: "Save Changes" }).click();

    await page.fill("input[name='verifyPassword']", currentUser.password);
    await page.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.getByText("My Account", { exact: true })).toBeVisible();

    await expect(page.locator("input[name='username']")).toHaveValue("AWholeNewWorld");
    await expect(page.locator("input[name='email']")).toHaveValue("pwizzle@gmail.com");
  });
  test("user can change password", async ({ page, users }) => {
    await page.getByRole("button", { name: "Change Password" }).click();

    await page.fill("input[name='verifyPassword']", currentUser.password);
    await page.fill("input[name='password']", "ANewPassword!1");
    await page.fill("input[name='confirmPassword']", "ANewPassword!1");

    await page.getByRole("button", { name: "Save Changes" }).click();

    await users.logout();

    await page.goto("/auth/signin");

    await users.login({
      email: currentUser.email as string,
      password: "ANewPassword!1",
    });

    await expect(page.locator("[data-testid=dashboard]")).toBeVisible();
  });
});
//
