import { test, expect } from "@playwright/test";

// import { handleAPIResponse } from "../../../client/src/lib/fetch";
// [ ] todo: actual monorepo arch.
// support something like: import { X } from '@propel/client/...' similar to calcom

const authCookies = ["absolute-propel-session", "idle-propel-session", "idle"];
const preAuthCookies = ["csrf-token", "pre-auth-session"];

test.beforeEach(async ({ page, request }) => {
  await page.goto("/");

  // const initialUserRequest = await request.get("/api/user/me");
  // expect(initialUserRequest.status()).toEqual(403);
});

// test.afterEach(async ({ page, request }) => {
//   const logout = await request.post("/api/auth/signout");
//   expect(logout.status()).toEqual(200);
//   expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
// });

// test.describe('redis rate limit')

test.describe("user login flow", () => {
  test("go to log in page when not authenticated", async ({ page, request }) => {
    // best way to test res status codes, make call again?
    const initialUserRequest = await request.get("/api/user/me");
    expect(initialUserRequest.status()).toEqual(403);

    await page.goto("/auth/signin");
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    const context = page.context();
    const cookies = await context.cookies();

    preAuthCookies.forEach((preAuthCookie) => {
      expect(cookies.find((cookie) => cookie.name === preAuthCookie)?.value).toBeTruthy();
    });

    authCookies.forEach((authCookie) => {
      expect(cookies.find((cookie) => cookie.name === authCookie)?.value).toBeFalsy();
    });

    // await page.fill("input[name='email']", "notreal@gmail.com");
    // await page.fill("input[name='password']", "testtest");
    // await page.getByRole("button", { name: "Sign In" }).click();
    // await expect(page.getByText("Incorrect email or password.")).toBeVisible();

    // await page.fill("input[name='email']", "test@gmail.com");
    // await page.fill("input[name='password']", "wrongpass");
    // await page.getByRole("button", { name: "Sign In" }).click();
    // await expect(page.getByText("Incorrect email or password. 5 tries remaining.")).toBeVisible();

    await page.fill("input[name='email']", "test@gmail.com");
    await page.fill("input[name='password']", "testtest");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText("Welcome, Test Test")).toBeVisible();
  });
});

// test.describe("user sign up flow", () => {
//   test("go to sign up page", async () => {
//     //
//   });
// });
