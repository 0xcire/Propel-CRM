import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";

import type { User } from "../fixtures/users";

// [ ]: need to test email functionality?

test.describe("user login flow", () => {
  let currentUser: User;

  test.beforeEach(async ({ page, users }) => {
    currentUser = (await users.create()) as User;
    await page.goto("/");

    const initialUserResponse = await users.getMe();
    expect(initialUserResponse.status()).toEqual(403);
  });

  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("log in / log out flow", async ({ page, users }) => {
    await test.step("log in", async () => {
      await page.goto("/auth/signin");
      await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

      await users.login({
        email: currentUser?.email as string,
        password: currentUser?.password as string,
      });

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
  let currentUser: User;
  const WRONG_EMAIL = "wowthisisfake@gmail.com";

  test.beforeEach(async ({ users }) => {
    currentUser = (await users.create()) as User;
  });

  test.afterEach(async ({ users }) => {
    await users.deleteAll();
    await users.clearRateLimit([WRONG_EMAIL, currentUser.email]);
  });

  test("for incorrect email and password", async ({ page, users }) => {
    let incorrectEmailText: string, incorrectPasswordText: string;

    const getErrorMessageToast = () =>
      page
        .getByText("Incorrect email or password.", {
          exact: false,
        })
        .first();

    await page.goto("/auth/signin");

    await test.step("incorrect email", async () => {
      await users.login({
        email: WRONG_EMAIL,
        password: currentUser.password,
      });

      incorrectEmailText = await getErrorMessageToast().innerText();

      await expect(getErrorMessageToast()).toBeVisible();
    });

    await test.step("incorrect password", async () => {
      await page.reload();

      await users.login({
        email: currentUser.email as string,
        password: "notafakepassword",
      });

      incorrectPasswordText = await getErrorMessageToast().innerText();

      await expect(getErrorMessageToast()).toBeVisible();
    });

    await test.step("error messages should be the same", async () => {
      expect(incorrectEmailText).toEqual(incorrectPasswordText);
    });
  });
});
