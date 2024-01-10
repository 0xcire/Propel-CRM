- [x] get passing tests first try without having to build docker env first

- [x] move away from self signed SSL for EB, install Certbot / LetsEncrypt on prem

- [x] ensure all scripts work with aws env's
  - [x] zip bean
  - [x] s3 sync
  <!--  -->
- [x] add necessary env secrets to gh repo to allow scripts to run

- [x] husky linst-staged

- [x] deployment github action that runs above scripts to deploy to s3 / EB
- [ ] github action to run e2e tests

- [ ] need a dev & prod db migrate script

- local/testing/prod env
  - env.dev -> local postgres / local redis
  - env.testing -> neon branch postgres / local redis
  - env.prod -> neon postgres / upstash redis

##### ------------------

- [ ] View Demo w/ appropriate rate limit middleware.

  - [ ] just add simple feature so that once PR is created to complete branch, can ensure things are working

- [ ] remove .docker/apps and whatever is causing that to happen in Dockerfile

- [ ] redirect aws default urls to mine
