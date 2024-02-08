import { test as base } from "@playwright/test";

import { createUsersFixture } from "../fixtures/users";
import { createEmailsFixture } from "../fixtures/emails";
import { createContactsFixture } from "../fixtures/contacts";

import type { Page } from "@playwright/test";

type Fixtures = {
  page: Page;
  users: ReturnType<typeof createUsersFixture>;
  emails: ReturnType<typeof createEmailsFixture>;
  contacts: ReturnType<typeof createContactsFixture>;
};

export const test = base.extend<Fixtures>({
  users: async ({ page }, use, workerInfo) => {
    const usersFixture = createUsersFixture(page, workerInfo);
    await use(usersFixture);
  },
  // eslint-disable-next-line no-empty-pattern
  emails: async ({}, use) => {
    const emailsFixture = createEmailsFixture();
    await use(emailsFixture);
  },
  contacts: async ({ page }, use) => {
    const contactsFixutre = createContactsFixture(page);
    await use(contactsFixutre);
  },
});
