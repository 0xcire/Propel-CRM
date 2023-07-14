# Propel CRM

A CRM for real estate agents.

## Things to figure out for this project

- Landing page into web app flow like most apps
  - propel.onrender.com -> app.propel.onrender.com for example
  - limited funding so probably limited here
- React Router for query params
  - url component state necessary for this?
- TRPC || ts-rest, React Query
- [x] Rolling Authenticaion (OWASP, bcrypt, other security measures)
  - look at my ts rest repo for starting point
- Solidify Express comfortability
- PostgreSQL
- use for redis?
- Expand on limited testing experience
  - Mock Service Worker, React Testing Library, etc etc
- [x] Docker (Docker.client, Docker.server, docker-compose ?)
- better git, git squash, rebase?
- Improve CI/CD branches (prod, test, dev)
  - don't think this is possible on render free tier.
  - next project in next.js -> vercel. possible there.

## Features

- [emails](https://resend.com/)
- text service? try to find free tiers

## Architecture

---

### Client

- Tailwind / Shadcn UI (Radix)
  - `./client/src/components/ui` contain shadcn components and everything in
  - `./client/src/components` contain my extension / customization of them
- Vite
- React
- React Router
- React Query / React Context
- ts-rest

### Server

- Node
- Express
- ts-rest

### Database

- PostgreSQL (Neon) (Switch to PlanetScale mySQL if usage hours become an issue w/ Neon)
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

<!-- ## Issues -->

## Roadmap

- [x] adding **full** Docker support
- [] auth / middlewares
- [] then -> full stack slices for each api endpoint
