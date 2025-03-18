# Features

- Production ready Docker configuration
  - Nginx rate limiting, SSL, proxy
- Session based cookie authentication
  - password salt & hashing w/ bcrypt
  - Login in rate limiting via email
  - Client side idle timeout reset notifications
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
  - GCI (Gross Commission Income)
  - average days to close lead
  - average days on market
  - sale to list ratio

- Debouncing on search queries to minimize amount of requests made

- Custom hooks for a variety of commmon logic including:

  - React Query queries and mutations
  - (re)setting default search params
  - setting document.title on routes
  - idle timeout toast/reset & account verification toast

- Playwright e2e tests
- Unit tests for pure util functions
- Supertest for API level integration tests

- Email service to verify account email, recover account password and create / send analytics reports ( WIP )

- Authentication & Security (following OWASP standards)

  - XSS validation
  - CSRF protection using the cookie to header pattern
  - Idle / Absolute session management
  - (to implement) authentication in terms of secure password resets, etc

- Shell scripts to automate build processes
  - build/deploy docker images
  - sync client build with s3 and invalidate
  - package docker compose and .ebextensions in zip file for server deployment
