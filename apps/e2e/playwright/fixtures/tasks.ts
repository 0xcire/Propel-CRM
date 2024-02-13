import type { Page } from "@playwright/test";

import type { NewTask } from "@propel/drizzle";

export const createTasksFixture = (page: Page) => {
  return {
    submitForm: async ({ title, description }: Partial<NewTask>) => {
      title && (await page.fill("input[name='title']", title));
      description && (await page.fill("input[name='description']", description));

      await page.getByRole("button", { name: "Add" }).click();
    },
  };
};
