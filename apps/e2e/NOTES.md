## e2e architecture

- [ ] consider refactoring app into monorepo w/ turborepo

  - [migrating](https://turbo.build/repo/docs/handbook/migrating-to-a-monorepo)
  - [w/ docker](https://turbo.build/repo/docs/handbook/deploying-with-docker)

- for auth:

  - would be nice to import redis and db
  - could do tests.beforeEach(async({ users }) => users.create())
  - tests.afterEach(async({ users }) => users.deleteAll())
  - could delete 'testing' accounts
  - important, because signup.e2e.ts is also testing deleting acct flow, could separate that into own test

- Types
  - redefining types like User now in 3 different spots, with server/src/db containing the 'true definition'

for ex:

- import type { User } from '@propel/packages/db/types'
- import { redis } from '@propel/packages/redis'
- import { db } from '@propel/packages/drizzle'
