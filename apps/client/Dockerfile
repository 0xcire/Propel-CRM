# TODO: revert to node:20 when possible
# look out for TypeError: Cannot redefine property: File

FROM node:18-alpine as base

# ----- prune -----

FROM base as prune

WORKDIR /app
RUN npm install -g add turbo
COPY . .
RUN turbo prune client --docker

# ----- builder -----

FROM base as builder

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=prune /app/out/full/ .
COPY turbo.json turbo.json

# [ ]: any way of getting cache hits in docker container? works locally.
# [ ]: would need <root>/node_modules/.cache
RUN npx turbo build --filter=client...

# ----- nginx -----

FROM nginx:stable-alpine3.17-slim

EXPOSE 80

COPY /apps/client/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=node:node --from=builder /app/apps/client/dist /usr/share/nginx/html