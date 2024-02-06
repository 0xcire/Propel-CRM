import { expect } from "@playwright/test";
import { test } from "../lib/fixtures";

test.afterEach(async ({ users }) => {
  await users.logout();
  await users.deleteAll();
});

test("User can reset their password", async ({ page, users, emails }) => {
  let requestID: string | undefined;
  const currentUser = await users.create({
    testingEmail: true,
  });

  await test.step("user can request a recovery email", async () => {
    await page.goto("/auth/recovery");

    await page.fill("input[name='email']", currentUser.email as string);

    await page.click('button[type="submit"]');

    const data = await emails.getByTag(currentUser.username as string);

    expect(data.count).toBe(1);
  });

  await test.step("user can fill in form to change password", async () => {
    requestID = await users.getTempRequestToken(currentUser.email as string);

    await page.goto(`/auth/recovery/${requestID}`);

    await page.fill("input[name='password']", "VeryNewPassword!123");
    await page.fill("input[name='confirmPassword']", "VeryNewPassword!123");

    await page.click("button[type='submit']");

    const getSuccessMessageToast = () => {
      return page.getByText("Password updated successfully.", { exact: true }).first();
    };

    await expect(getSuccessMessageToast()).toBeVisible();
  });

  await test.step("user can now login", async () => {
    await page.goto("/auth/signin");

    await users.login({
      email: currentUser.email as string,
      password: "VeryNewPassword!123",
    });

    await expect(page.locator("[data-testid=dashboard]")).toBeVisible();
  });

  await test.step("previous request is now invalid", async () => {
    await users.logout();

    await page.goto(`/auth/recovery/${requestID}`);

    await expect(page.getByText("request expired", { exact: false }).first()).toBeVisible();
  });
});
