import { test as base } from '@playwright/test';

type Fixtures = {
  users: ReturnType<>;
};

export const test = base.extend<Fixtures>({
  users: async ({ emails }, use, workerInfo) => {
    const usersFixture = createUsersFixture(page, emails, workerInfo);
    await use(usersFixture);
  },
});
