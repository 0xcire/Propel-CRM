import type { Page } from "@playwright/test";

import type { NewContact } from "@propel/drizzle";

export const createContactsFixture = (page: Page) => {
  return {
    submitForm: async ({ name, email, phoneNumber, address }: Partial<NewContact>) => {
      name && (await page.fill("input[name='name']", name));
      email && (await page.fill("input[name='email']", email));
      phoneNumber && (await page.fill("input[name='phoneNumber']", phoneNumber));
      address && (await page.fill("input[name='address']", address));

      await page.getByRole("button", { name: "Update" }).click();
    },
  };
};
