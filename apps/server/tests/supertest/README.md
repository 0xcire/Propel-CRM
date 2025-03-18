# notes

- run these tests in pre-push husky hook
- playwright API testing was an option
- Currently used as a form of documentation for api functionality

  - Ideally this is handled using Nest openAPI plugins or something similar

- running `npm run preview` mainly for local postgres and redis images
  - supertest allows you to run `request(app)` where app is imported from `index.ts` or `server.ts` etc
  - but since I am running this env already, can also run `request(local_url)`
