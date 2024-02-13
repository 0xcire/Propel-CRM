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

test.describe("listings default values and actions", () => {
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
      await expect(getDashboardDefaultByText(page, "Add Listings")).toBeVisible();
    });

    await test.step("listings page query params are set", async () => {
      await page.goto("/listings");
      await expect(page).toHaveURL("http://localhost:9090/listings?page=1&limit=10&status=active");
    });

    await test.step("listings page displays correct information for fresh account", async () => {
      await expect(getNoResultsTableDefault(page)).toBeVisible();
    });
  });

  test("dashboard user actions", async ({ page, listings }) => {
    await test.step("user can create listing", async () => {
      await page.getByTestId("add-listing-svg").click();

      await listings.submitForm({
        address: "123 Fake St Los Angeles, CA 01234",
        baths: 4,
        bedrooms: 3,
        description: "A description",
        price: "250000",
        propertyType: "single family",
        squareFeet: 1500,
      });

      await expect(page.getByText("123 Fake St Los Angeles, CA 01234", { exact: false })).toBeVisible();
    });

    await test.step("user can update listing", async () => {
      await page.getByTestId("update-listing-svg").click();

      await listings.submitForm({
        price: "350000",
        save: true,
      });

      await expect(page.getByText("$350,000.00")).toBeVisible();
    });
  });

  test("listings route user actions", async ({ page, listings }) => {
    await test.step("User can create listing", async () => {
      // can't await page.goto('/listings') ?
      const listingPageNavLink = page.locator("[href='/listings?page=1&limit=10&status=active']");
      await listingPageNavLink.click();

      await page.getByRole("button", { name: "Add Listing", exact: true }).click();

      await listings.submitForm({
        address: "123 Fake St Los Angeles, CA 01234",
        baths: 4,
        bedrooms: 3,
        description: "A description",
        price: "250000",
        propertyType: "single family",
        squareFeet: 1500,
      });

      await expect(page.locator("tr").nth(1)).toHaveText(/123 Fake St Los Angeles, CA 01234/i);
    });

    await test.step("user can update listing", async () => {
      await getTableRowActionButton(page).click();
      await getUpdateTableRowActionButton(page).click();

      await listings.submitForm({
        price: "350000",
        save: true,
      });

      await expect(page.locator("tr").nth(1)).toContainText("$350,000");
    });

    await test.step("user can delete listing", async () => {
      await getTableRowActionButton(page).click();
      await getDeleteTableRowActionButton(page).click();
      await getAlertDialogConfirmButton(page).click();

      await expect(page.locator("tr").nth(1)).not.toHaveText(/123 Fake St Los Angeles, CA 01234/i);
    });
  });
});
