import { test } from "@playwright/test";

test.describe("Unique identifiers", () => {
  test("Email taken", async () => {});
  test("Username taken", async () => {});
});
// test.describe("user sign up flow", () => {
//   test("sign up happy path", async ({ page, users }) => {
//     await page.goto("/auth/signup");

//     await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();

//     const context = page.context();
//     const cookies = await context.cookies();

//     // Common
//     preAuthCookies.forEach((preAuthCookie) => {
//       expect(cookies.find((cookie) => cookie.name === preAuthCookie)?.value).toBeTruthy();
//     });

//     authCookies.forEach((authCookie) => {
//       expect(cookies.find((cookie) => cookie.name === authCookie)?.value).toBeFalsy();
//     });

//     await page.fill("input[name='name']", "testuser@gmail.com");
//     await page.fill("input[name='username']", "test-user");
//     await page.fill("input[name='email']", "test-user@gmail.com");
//     await page.fill("input[name='password']", "testtest");
//   });
// });
