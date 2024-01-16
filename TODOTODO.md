- [x] get passing tests first try without having to build docker env first

- [x] move away from self signed SSL for EB, install Certbot / LetsEncrypt on prem

- [x] ensure all scripts work with aws env's
  - [x] zip bean
  - [x] s3 sync
  <!--  -->
- [x] add necessary env secrets to gh repo to allow scripts to run

- [x] husky linst-staged

- [x] deployment github action that runs above scripts to deploy to s3 / EB
- [x] github action to run e2e tests

- [x] need a dev & prod db migrate script
- [x] also make sure tests running in ci vs locally is seamless
- [x] clean up docker compose, use extend from base

- local/testing/prod env
  - env.dev -> local postgres / local redis
  - env.testing -> neon branch postgres / local redis
  - env.prod -> neon postgres / upstash redis

##### ------------------

- [ ] View Demo w/ appropriate rate limit middleware.

  - [ ] just add simple feature so that once PR is created to complete branch, can ensure things are working

- [x] remove .docker/apps and volumes causing it

- [ ] redirect aws default urls to mine
