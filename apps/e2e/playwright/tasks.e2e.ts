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

test.describe("tasks default values and actions", () => {
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
      await expect(getDashboardDefaultByText(page, "No tasks to display.")).toBeVisible();
    });

    await test.step("tasks page query params are set", async () => {
      await page.goto("/tasks");
      await expect(page).toHaveURL("http://localhost:9090/tasks?page=1&limit=10&completed=false");
    });

    await test.step("tasks page displays correct information for fresh account", async () => {
      await expect(getNoResultsTableDefault(page)).toBeVisible();
    });
  });

  test("dashboard user actions", async ({ page, tasks }) => {
    await test.step("user can create task", async () => {
      const dashboardTaskMenuButton = page.locator('[aria-haspopup="menu"]').last();
      await dashboardTaskMenuButton.click();

      const taskMenuAddTaskButton = page.getByText(/Add Task/i);
      await taskMenuAddTaskButton.click();

      await tasks.submitForm({
        title: "Finish playwright tests",
      });

      await expect(page.getByText("Finish playwright tests").first()).toBeVisible();
    });

    await test.step("user can update task", async () => {
      await page.getByTestId("task-update-svg").first().click();

      await tasks.submitForm({
        title: "I updated the title",
      });

      await expect(page.getByText("I updated the title").first()).toBeVisible();
    });

    await test.step("user can mark task complete", async () => {
      const taskCheckbox = page.locator('[role="checkbox"]').first();
      await taskCheckbox.click();

      await expect(page.getByText("I updated the title")).not.toBeVisible();
    });
  });

  test("contacts route user actions", async ({ page, tasks }) => {
    await test.step("User can create task", async () => {
      // can't await page.goto('/tasks') ?
      const taskPageNavLink = page.locator("[href='/tasks?page=1&limit=10&completed=false']");
      await taskPageNavLink.click();

      await page.getByRole("button", { name: "Add Task", exact: false }).click();

      await tasks.submitForm({
        title: "More playwright testing",
      });

      await expect(page.locator("tr").nth(1)).toHaveText(/More playwright testing/i);
    });

    await test.step("user can update task", async () => {
      await getTableRowActionButton(page).click();
      await getUpdateTableRowActionButton(page).click();

      await tasks.submitForm({
        title: "Even more playwright testing",
      });

      await expect(page.locator("tr").nth(1)).toHaveText(/Even more playwright testing/i);
    });

    await test.step("user can delete task", async () => {
      await getTableRowActionButton(page).click();
      await getDeleteTableRowActionButton(page).click();
      await getAlertDialogConfirmButton(page).click();

      await expect(page.locator("tr").nth(1)).not.toHaveText(/Even more playwright testing/i);
    });
  });
});
