# Propel CRM

A CRM for real estate agents.

- [Related resources](./docs/RESOURCES.md)
- [Roadmap](./docs/ROADMAP.md)
- [Features](./docs/FEATURES.md)

## Important Note

This app was built in two parts - if you will. Part 1 - me being absolutely clueless, kind of just stumbling overmyself. Part 2 - as I was able to leverage this \*\*\* afpp into a job, I quickly learnt how terrible I truly was. And mainly the (link merge here) can show a lot of improvements I made server-side as a result of the lessons I learnt at my first job!! Also - not re-built into Next/Nest as I want to build a different application using this stack!

## Architecture

### Client

- Tailwind / [Shadcn UI](https://ui.shadcn.com/) (Radix)
  - `.apps/client/src/components/ui` contain shadcn components
  - `.apps/client/src/components` contain my extension of shadcn as well as my own
- Vite
- TypeScript
- React
- React Router
- React Query / React Context
- [BulletProof React](https://github.com/alan2207/bulletproof-react) inspired

### Server

- TypeScript
- Node
- Express

### Testing

- Jest
- Playwright
- SuperTest

### Database

- Redis
- PostgreSQL on [Neon](https://neon.tech/)
- Drizzle ORM

### Emails

<!-- - [React Emails](https://react.email) -->

- [Resend](https://resend.com)
- [TestMail](https://testmail.app)

### AWS

- Client on S3 & CloudFront
- Nginx and Express containers on EC2 via Elastic Beanstalk

### Containerization

- Docker

### Proxy Server

- Nginx ( needed to supply own Nginx proxy in docker compose env on beanstalk )

## Getting Started

Run `npm install -g dotenv-cli`, many scripts rely on it

Populate `./apps/server/.env.example` with your own postgreSQL credentials and:

### Without Docker

`git clone https://github.com/0xcire/Propel-CRM.git propel-crm \&& cd propel-crm && npm install` \
`turbo run dev` \
configure cors for localhost in `apps/server/src/index.ts` and \
open up `http://localhost:5173/` in your browser

### With Docker

`git clone https://github.com/0xcire/Propel-CRM.git propel-crm && cd propel-crm && npm install` \
`docker compose -f .docker/docker-compose.dev.yml up` to run in dev mode & \
`docker compose -f .docker/docker-compose.preview.yml up` to run in 'local' prod

## Running Tests

in root dir:

- for e2e: run `npm run test:local --workspace=e2e`
- for server unit & integration tests: run `npm run test --workspace=server`
  - ensure you initialize preview env with `npm run preview` beforehand &
  - seed local db with `npm run migrate:local --workspace=@propel/drizzle && npm run seed:local --workspace=@propel/drizzle` if not done so already

## Interacting with DB via Drizzle

Ensure `./packages/drizzle/drizzle.config.ts` is properly configured and:

`npm exec drizzle-kit generate:pg` to run migrations \
`npm exec drizzle-kit drop` to delete previously generated migrations \
`npm run studio:{ test | local | prod } --workspace=@propel/drizzle` to use Drizzle ORM's new feature to explore your db \
`npm run migrate:{ test | local | prod } --workspace=@propel/drizzle` to run migrations against various db environments \
`npm run seed:{ local | prod }` to seed database according to env \
see more drizzle specific commands [here](https://orm.drizzle.team/kit-docs/commands)

## Learning Points

- Understanding the full scope of a feature, from db design to ui!

- Getting a better understanding of TypeScript generics

  - useful for data transforming utility functions
  - helped create typesafe, reusable form components based off Shadcn implementation

- Databases

  - Pros/Cons of using SQL vs NoSQL
  - SQL aggregate functions
  - Using Redis to store session data

- Docker

  - Multi stage builds to optimize for production
  - Using docker-compose to sync client, server, and nginx services together

- Nginx

  - Reverse proxy
  - Rate Limiting

<!-- - Back end development concepts -->

- Backend Security Concepts

  - [XSS mitigation](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
    - wrote a custom middleware to parse all inputs against a zod schema
  - [CSRF protection](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
    - using cookie to header pattern, and sameSite cookies

- Authentication (extension of above)

  - Differences between JWT and Session/Cookie based auth
  - [effective session mgmt](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
    - For my use case, sessions are used for authentication where as JWTs (while not yet implemented) will be used as short lived tokens to do things like reset passwords, and verify emails
  - [Securely handling authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
    - securely handling password hashing
    - note: have yet to address account recovery

## Issues

- React Query and Forms.

  - Ran into issues where default values were not updated after invalidating queries on mutation success.
  - [this TK Dodo article](https://tkdodo.eu/blog/react-query-and-forms) really helped me out

- Struggled initally with configuring Nginx

- Also had trouble initially wrapping my head around SQL aggregate functions when creating the analytics view

- API testing strategy & openAPI

  - while not a replacement, currently using Supertest as a way to test & "document" api functionality
  - could look to refactor backend with Tsoa, Nest, Deepkit, etc to generate openAPI docs in the future
    - an example of me doing so with Tsoa can be seen [here](https://github.com/0xcire/sentinel-vacation-rentals)
  - these tests do not run in CI, they run in husky pre-push

- e2e testing strategy

  - hesitancy on exactly how to run tests in CI
  - initially recreated postgres / redis locally on docker compose which ran fine but could not pin down postgres 'fast shutdown request' issue
  - **Solution:** Took advantage of Neon's branching feature and built docker images mirror prod environments as close as possible

- DB vs Redis for temp requests ( verify-email / account recovery )
  - Without running tests, redis works perfectly
  - However, when trying to e2e test these flows, it immediately became difficult to either parse emails or SCAN redis for tokens and run a `page.goto('/auth/recovery/${token}')` in playwright
  - **Solution:** create a temp_requests table so I can query for tokens based off other data

## Notes

- Project is still a WIP. Everything that does not require a third party service and UI enhancements are roughly 90% complete. Excited to then add,

  - Framer Motion animations
  - Verify account email
  - Account recovery email
  - MapBox address autocomplete
  - S3 file upload
  - AWS hosting

- Demo account listings are mostly seeded with data from faker.

  - please see `/packages/faker` to see how that was done
  - data in analytics and some listing details may not make 100% sense

- Took the time to go through OWASP guides for some security features and while the general recommendation is to use a library where people much more knowledgable than myself can handle all edge cases, I figured this would be a good learning opportunity to understand what is going on

- AWS

  - docs are misleading. if you only intend to use a docker-compose.yml to deploy on elastic beanstalk, you still need to zip that file
  - when using docker compose, provide your own nginx proxy container. default options are ignored.

- Serverless

  - Using some serverless providers in Upstash & Neon, could rearchitect express app/infra to run serverless.

- Monorepo architecture

  - ran into instances where I realized some code sharing (especially for e2e testing)
  - Had I planned for this from the start, I think I would have gone with Nx, however, a migration using turborepo seemed more straightforward
