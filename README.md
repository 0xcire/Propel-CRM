# Propel CRM

A CRM for real estate agents.

## Features

- Docker setup for Development and Production.
- Session based cookie authentication

## Architecture

### Client

- Tailwind / Shadcn UI (Radix)
  - `./client/src/components/ui` contain shadcn components and everything in
  - `./client/src/components` contain my extension / customization of them as well as my own
- Vite
- React
- React Router
- React Query / React Context

### Server

- Node
- Express

### Database

- PostgreSQL (Neon)
- Drizzle ORM

### Containerization

- Docker

## Getting Started

Populate `./server/.env.example` with your own postgreSQL credentials and:

### Without Docker

`git clone https://github.com/0xcire/Propel-CRM.git propel-crm` \
`cd propel-crm` \
from `propel-crm` ... \
`cd server && npm install && npm run dev` \
`cd client && npm install && npm run dev` \
open up `http://localhost:5173/` in your browser

### With Docker (recommended)

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

- Docker

  - Containerizing both client and server separately
  - Writing separate configs for dev and prod
    - Trying to follow best practices as necessary
  - Using nginx as a reverse proxy server
  - Using docker-compose to sync app together

- Authentication

  - Differences between JWT and Session/Cookie based auth

## Successes

<!-- - Combine my knowledge of front end development -->

- Implemented Session/Cookie based user authentication
- Creating generic Shadcn (Radix) and React Hook Form Input components
  - text, textarea, select, date, etc

## Issues

- React Query and Forms.
  - Ran into issues where default values were not updated after invalidating queries on mutation success.
  - [this TK Dodo article](https://tkdodo.eu/blog/react-query-and-forms) really helped me out

## Notes

- Demo account listings are mostly seeded with data from faker js.
  - please see `/server/src/lib/faker.ts` to see how that was done
  - data in analytics and some listing details may not make 100% sense

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
- [ ] analytics-slice MVP
  - [ ] filterable performance analytics for listings sold by year, quarter, month

### Full Features

- animations

  - [ ] <-> page transition between <Public /> routes
  - [ ] contact, task, listing layout animation
  - [ ] page transition layout animation between dashboard and individual pages
  - [ ] any not from-center chart animations

- React Query

  - [ ] optimistic UI

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

  - [ ] full contacts page, grid layout, also like some game's ui
  - [ ] certain tasks may have associated contacts
  - [ ] sending follow up texts or emails to contacts, etc

  - [ ] members of same team can send contacts to eachother
  - [ ] infinite scroll pagination
  - [ ] filter sort by date added, alphabetical, etc
  - [ ] search for contacts

- tasks-slice

  - [ ] can use something like @<Name> and autocomplete based on your contacts in notes section
  - [ ] can tag listing by listingID
  - [ ] can tag contact by name or contactID

- listings-slice

  - [ ] tag interested contacts to listings
  - [ ] image upload, s3
  - [ ] tag contacts to listings
  - [ ] suggest contacts based on proximity?

- analytics-slice

  - [ ] generate pdf reports with email functionality ( resend )
  - [ ] lead conversion rates
  - [ ] avg days on market
  - [ ] price trends / fluctuations (hmm...)
  - [ ] # of listings handled, avg time to close lead, overall sales vol.

- mobile dialog components

  - [ ] detect purely mobile viewport and replace dialog components with [Vaul](https://github.com/emilkowalski/vaul)

- teams, team specifc admin, admin for all
