- [x] get passing tests first try without having to build docker env first

- [x] move away from self signed SSL for EB, install Certbot / LetsEncrypt on prem

- [ ] ensure all scripts work with aws env's
  - [x] zip bean
  - [x] s3 sync
  <!--  -->
- [ ] add necessary env secrets to gh repo to allow scripts to run

- [ ] husky precommit tests, lints, typecheck

  - [ ] will take adv of turbo cache (?)

- [ ] deployment github action that runs above scripts to deploy to s3 / EB

##### ------------------

- [ ] View Demo w/ appropriate rate limit middleware.

  - [ ] just add simple feature so that once PR is created to complete branch, can ensure things are working

- [ ] remove .docker/apps and whatever is causing that to happen in Dockerfile

- [ ] redirect aws default urls to mine
