import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test.describe("user login flow", () => {
  test("go to log in page when not authenticated", async ({ page }) => {
    await page.goto("/auth/signin");

    await expect(page.getByText("Sign In")).toBeVisible();
  });
});
