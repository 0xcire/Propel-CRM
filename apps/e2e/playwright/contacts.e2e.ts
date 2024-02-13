import { expect } from "@playwright/test";
import { test } from "./lib/fixtures";
import {
  getAlertDialogConfirmButton,
  getDashboardDefaultByText,
  getDeleteTableRowActionButton,
  getNoResultsTableDefault,
  getTableRowActionButton,
  getUpdateTableRowActionButton,
} from "./utils";

test.describe("contacts default values and actions", () => {
  test.beforeEach(async ({ page, users }) => {
    const currentUser = await users.create({});
    await page.goto("/auth/signin");
    await users.login({
      email: currentUser.email as string,
      password: currentUser.password as string,
    });
  });

  test.afterEach(async ({ users }) => {
    await users.logout();
    await users.deleteAll();
  });

  test("UI defaults on dashboard & route", async ({ page }) => {
    await test.step("dashboard displays correct information for fresh account", async () => {
      await expect(getDashboardDefaultByText(page, "No contacts to display.")).toBeVisible();
    });

    await test.step("contacts page query params are set", async () => {
      await page.goto("/contacts");
      await expect(page).toHaveURL("http://localhost:9090/contacts?page=1&limit=10");
    });

    await test.step("contacts page displays correct information for fresh account", async () => {
      await expect(getNoResultsTableDefault(page)).toBeVisible();
    });
  });

  test("dashboard user actions", async ({ page, contacts }) => {
    await test.step("user can create contact", async () => {
      await page.getByTestId("add-contact-svg").click();

      await contacts.submitForm({
        name: "John Doe",
        email: "jdizzle123@gmail.com",
        phoneNumber: "617-555-5555",
        address: "123 ABC St. Town, CA",
      });

      await expect(page.getByText("John Doe").first()).toBeVisible();
    });

    await test.step("user can update contact", async () => {
      await page.getByTestId("update-contact-svg").click();

      await contacts.submitForm({
        name: "John Moe",
      });

      await expect(page.getByText("John Moe").first()).toBeVisible();
    });

    await test.step("user can delete contact", async () => {
      await page.getByTestId("remove-contact-svg").click();

      await page.getByRole("button", { name: "Remove" }).click();

      await expect(page.locator("a", { hasText: "John Moe" }).first()).not.toBeVisible();
    });
  });

  test("contacts route user actions", async ({ page, contacts }) => {
    await test.step("User can create contact", async () => {
      const contactPageNavLink = page.locator("[href='/contacts?page=1&limit=10']");
      await contactPageNavLink.click();

      await page.getByRole("button", { name: "Add Contact", exact: false }).click();
      // await page.getByTestId("add-contact").click();

      await contacts.submitForm({
        name: "John Doe",
        email: "jdizzle123@gmail.com",
        phoneNumber: "617-555-5555",
        address: "123 ABC St. Town, CA",
      });

      await expect(page.locator("tr").nth(1)).toHaveText(/John Doe/i);
    });

    await test.step("user can update contact", async () => {
      await getTableRowActionButton(page).click();

      await getUpdateTableRowActionButton(page).click();

      await contacts.submitForm({
        name: "John Moe",
      });

      await expect(page.locator("tr").nth(1)).toHaveText(/John Moe/i);
    });

    await test.step("user can delete contact", async () => {
      await getTableRowActionButton(page).click();
      await getDeleteTableRowActionButton(page).click();
      await getAlertDialogConfirmButton(page).click();

      await expect(page.locator("tr").nth(1)).not.toHaveText(/John Moe/i);
    });
  });
});
