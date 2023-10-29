# Propel CRM

A CRM for real estate agents.

... the timing is great 😅

## Features

- Production ready Docker configuration
  - Nginx rate limiting
- Session based cookie authentication
  - password salt & hashing w/ bcrypt
- Dashboard overview of recent listings, contacts, tasks, and analytics

- Protected routes on client only shown when valid user data is returned from server

- Listings, Contacts, & Tasks page that show user data in a searchable, filterable & paginated table

  - Contacts searchable by name
  - tasks filterable by priority
  - listings by status (active or sold)

  - each row contains a dropdown menu to perform full CRUD operations on that entity & manage potential relationships w/ other data
    - Add lead (contact) to a listing
    - mark listings as sold to specific lead @ specified price
    - add listing & contact specific tasks

- Analytics page that shows the following for a specified time frame:

  - Sales volume & total sales volume
  - GCI
  - average days to close lead
  - average days on market
  - sale to list ratio

- Broken Object Level Authorization considered at router level

## Architecture

### Client

- Tailwind / Shadcn UI (Radix)
  - `./client/src/components/ui` contain shadcn components
  - `./client/src/components` contain my extension of shadcn as well as my own
- Vite
- TypeScript
- React
- React Router
- React Query / React Context
- Bullet Proof React inspired

### Server

- TypeScript
- Node
- Express

### Database

- PostgreSQL on [Neon](https://neon.tech/)
- Drizzle ORM

### Containerization

- Docker

### Web Server

- Nginx

## Getting Started

Populate `./server/.env.example` with your own postgreSQL credentials and:

### Without Docker

`git clone https://github.com/0xcire/Propel-CRM.git propel-crm` \
`cd propel-crm` \
from `propel-crm` ... \
`cd server && npm install && npm run dev` \
`cd client && npm install && npm run dev` \
open up `http://localhost:5173/` in your browser

### With Docker

`git clone https://github.com/0xcire/Propel-CRM.git propel-crm` \
`cd propel-crm` \
`docker compose -f docker-compose.dev.yml up` to run in dev mode & \
`docker compose up` to run in prod

### Interacting with DB via Drizzle

Ensure `server/drizzle.config.ts` is properly configured and:

`npm exec drizzle-kit generate:pg` to run migrations \
`npm exec drizzle-kit introspect:pg` to generate schemas based on existing db \
`npm exec drizzle-kit drop` to delete previously generated migrations \
`npm exec drizzle-kit studio` to use Drizzle ORM's new feature to explore your db \
see more commands [here](https://orm.drizzle.team/kit-docs/commands)

## Learning Points

- Getting a better understanding of TypeScript generics

  - useful for data transforming utility functions
  - helped create typesafe, reusable form components based off Shadcn implementation

- Docker

  - Multi stage builds to optimize for production
  - Using docker-compose to sync client, server, and nginx services together

- Nginx

  - Reverse proxy
  - Rate Limiting

- Back end development concepts and getting a much better grasp of feature development from db design to ui

- Authentication

  - Differences between JWT and Session/Cookie based auth

- Pros/Cons of using SQL vs NoSQL
- SQL aggregate functions

## Issues

- React Query and Forms.

  - Ran into issues where default values were not updated after invalidating queries on mutation success.
  - [this TK Dodo article](https://tkdodo.eu/blog/react-query-and-forms) really helped me out

- Struggled initally with configuring Nginx

- Also had trouble initially wrapping my head around SQL aggregate functions when creating the analytics view

## Notes

- Demo account listings are mostly seeded with data from faker js.

  - please see `/server/src/lib/faker.ts` to see how that was done
  - data in analytics and some listing details may not make 100% sense

- While best practices and not reinventing the wheel were considered in most parts of this project, one area where that does not apply is user auth.
  - I don't intend to use this commercially, it's mainly just a learning project and a good opportunity to learn how auth is roughly done under the hood.

## Roadmap

### MVP Features

- [x] adding **full** Docker support
- auth MVP
  - [x] user can sign up, sign in, sign out
- user-slice MVP
  - [x] user can perform CRUD actions on their account data
- contacts-slice MVP
  - [x] user can perform basic CRUD actions on their associated contacts
  - [x] on dashboard, displayed on entire right column, similar to common game ui's
- tasks-slice MVP
  - [x] user can CRUD a task
- listings-slice MVP
  - [x] user can CRUD a listing
- [x] analytics-slice MVP
  - [x] filterable performance analytics for listings sold by year/quarter

### Full Features

- animations

  - [ ] <-> page transition between <Public /> routes
  - [ ] contact, task, listing layout animation
  - [ ] page transition layout animation between dashboard and individual pages
  - [x] any not from-center chart animations

- React Query

  - [x] optimistic UI, only applied to delete mutations

- Resend (Email Service)

  - [ ] Account recovery, email verification, sending pdf reports, etc

- MapBox

  - [ ] address autocomplete

- Amazon S3

  - [ ] Avatar image upload
  - [ ] listing images upload

- auth / user-slice

  - [ ] refresh token
  - [ ] email confirmation
  - [ ] account recovery
  - [ ] 2fa opt-in
  - [ ] disable account

- contacts-slice

  - [ ] sending follow up texts or emails to contacts, etc
  - [ ] members of same team can send contacts to eachother
  - [x] search for contacts

- tasks-slice

  - [ ] can use something like @<Name> and autocomplete based on your contacts in notes section
  - [x] can add listing specific tasks
  - [x] can tag contact specific tasks

- listings-slice

  - [x] add leads to listings
  - [ ] suggest contacts based on proximity?
    - currently based off fake data...

- analytics-slice

  - [ ] generate pdf reports with email functionality ( resend )
  - [x] avg days on market
  - [x] avg days on market
  - [x] avg time to close lead, overall sales vol.

- mobile dialog components

  - [ ] detect purely mobile viewport and replace dialog components with [Vaul](https://github.com/emilkowalski/vaul)

- teams, team specifc admin, admin for all
