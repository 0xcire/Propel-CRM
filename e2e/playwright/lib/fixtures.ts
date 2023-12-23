import { test as base } from "@playwright/test";

import { createUsersFixture } from "../fixtures/users";

import type { Page } from "@playwright/test";

type Fixtures = {
  page: Page;
  users: ReturnType<typeof createUsersFixture>;
};

export const test = base.extend<Fixtures>({
  users: async ({ page }, use, workerInfo) => {
    const usersFixture = createUsersFixture(page, workerInfo);
    await use(usersFixture);
  },
});
