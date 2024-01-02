import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";

import type { User, SignUpUser } from "../fixtures/users";

test.describe("user sign up flow", () => {
  let currentUser: SignUpUser;

  test.afterEach(async ({ users }) => {
    await users.logout();
    await users.deleteAll();
  });

  test("user can sign up", async ({ page, users }) => {
    currentUser = users.createForSignUp();
    await page.goto("/auth/signup");
    await users.signup({
      name: currentUser.name,
      username: currentUser.username,
      email: currentUser.email,
      password: currentUser.password,
    });
    await expect(page.locator("[data-testid=dashboard]")).toBeVisible();
  });
});

test.describe("no duplicate identifiers", () => {
  let currentUser: User;

  test.beforeEach(async ({ page, users }) => {
    currentUser = (await users.create()) as User;
    await page.goto("/auth/signup");
  });

  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("unique emails", async ({ page, users }) => {
    await users.signup({
      name: currentUser.name,
      username: "SomethingElse123",
      email: currentUser.email,
      password: currentUser.password,
    });

    await expect(page.getByText("Email already exists.", { exact: true })).toBeVisible();
  });

  test("unique usernames", async ({ page, users }) => {
    await users.signup({
      name: currentUser.name,
      username: currentUser.username,
      email: "veryoriginalemail123@gmail.com",
      password: currentUser.password,
    });

    await expect(page.getByText("Username not available. Please pick another.", { exact: true })).toBeVisible();
  });
});
