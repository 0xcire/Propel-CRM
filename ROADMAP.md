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

- Amazon S3

  - [ ] Avatar image upload
  - [ ] listing images upload

- auth / user-slice

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
