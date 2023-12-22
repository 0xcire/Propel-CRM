import { test as base } from "@playwright/test";
import { createUsersFixture } from "../fixtures/users";

import type { Page } from "@playwright/test";
import { createAuthFixture } from "../fixtures/auth";

type Fixtures = {
  page: Page;
  users: ReturnType<typeof createUsersFixture>;
  auth: ReturnType<typeof createAuthFixture>;
};

export const test = base.extend<Fixtures>({
  users: async ({ page }, use, workerInfo) => {
    const usersFixture = createUsersFixture(page, workerInfo);
    await use(usersFixture);
  },
  auth: async ({ page }, use) => {
    const authFixture = createAuthFixture(page);
    await use(authFixture);
  },
});
