import { test as base } from "@playwright/test";

import { createUsersFixture } from "../fixtures/users";
import { createEmailsFixture } from "../fixtures/emails";

import type { Page } from "@playwright/test";

type Fixtures = {
  page: Page;
  users: ReturnType<typeof createUsersFixture>;
  emails: ReturnType<typeof createEmailsFixture>;
};

export const test = base.extend<Fixtures>({
  users: async ({ page }, use, workerInfo) => {
    const usersFixture = createUsersFixture(page, workerInfo);
    await use(usersFixture);
  },
  emails: async ({ page }, use, workerInfo) => {
    const emailsFixture = createEmailsFixture(page, workerInfo);
    await use(emailsFixture);
  },
});
