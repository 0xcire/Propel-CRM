import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";
// import { handleAPIResponse } from "../../../client/src/lib/fetch";
// [ ] todo: actual monorepo arch.
// support something like: import { X } from '@propel/client/...' similar to calcom

// TODO:
// fixtures
// closing context
// logout after each test
// etc

// test login
// logout
// sign up
// error codes
// eventually need to test emails

test.beforeEach(async ({ page, users }) => {
  await page.goto("/");
  // best way to test res status codes, make call again?
  const initialUserResponse = await users.getMe();
  expect(initialUserResponse.status()).toEqual(403);
});

test.afterEach(async ({ users }) => {
  users.logout();
  // await users.deleteAll();
});

test.describe("user login flow", () => {
  // go to log in page when not authenticated
  test("log in happy path", async ({ page, users }) => {
    await page.goto("/auth/signin");
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await users.login();

    await expect(page.locator("[data-testid=dashboard]")).toBeVisible();
  });

  // test("ambiguous error messages", async ({ page }) => {
  //   // wrong email
  //   await page.fill("input[name='email']", "notreal@gmail.com");
  //   await page.fill("input[name='password']", "testtest");
  //   await page.getByRole("button", { name: "Sign In" }).click();
  //   const emailMessage = await page.waitForSelector();

  //   // wrong password

  //   await page.fill("input[name='email']", "test@gmail.com");
  //   await page.fill("input[name='password']", "wrongpass");
  //   await page.getByRole("button", { name: "Sign In" }).click();
  //   // await expect(page.getByText("Incorrect email or password. 5 tries remaining.")).toBeVisible();
  //   const passwordMessage = await page.waitForSelector();

  //   expect(emailMessage).toEqual(passwordMessage);
  // });
});
