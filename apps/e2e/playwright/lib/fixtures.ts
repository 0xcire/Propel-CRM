import { test as base } from "@playwright/test";

import { createUsersFixture } from "../fixtures/users";
import { createEmailsFixture } from "../fixtures/emails";
import { createContactsFixture } from "../fixtures/contacts";
import { createTasksFixture } from "../fixtures/tasks";
import { createListingsFixture } from "../fixtures/listings";

import type { Page } from "@playwright/test";

type Fixtures = {
  page: Page;
  users: ReturnType<typeof createUsersFixture>;
  emails: ReturnType<typeof createEmailsFixture>;
  contacts: ReturnType<typeof createContactsFixture>;
  tasks: ReturnType<typeof createTasksFixture>;
  listings: ReturnType<typeof createListingsFixture>;
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
  tasks: async ({ page }, use) => {
    const tasksFixture = createTasksFixture(page);
    await use(tasksFixture);
  },
  listings: async ({ page }, use) => {
    const listingsFixture = createListingsFixture(page);
    await use(listingsFixture);
  },
});
