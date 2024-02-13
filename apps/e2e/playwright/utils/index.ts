import type { Page } from "@playwright/test";

export const getDashboardDefaultByText = (page: Page, text: string) => {
  return page.getByText(text, { exact: true });
};

export const getNoResultsTableDefault = (page: Page) => {
  return page.getByText("No results.", { exact: true });
};

export const getTableRowActionButton = (page: Page) => {
  return page.locator("tr:first-child td:last-child button");
};

export const getUpdateTableRowActionButton = (page: Page) => {
  return page.getByText("Update");
};

export const getDeleteTableRowActionButton = (page: Page) => {
  return page.getByText("Delete");
};

export const getAlertDialogConfirmButton = (page: Page) => {
  return page.getByRole("button", { name: "Remove" });
};
