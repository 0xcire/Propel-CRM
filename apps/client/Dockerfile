# TODO: revert to node:20 when possible
# look out for TypeError: Cannot redefine property: File

FROM node:18-alpine as base

# ----- build -----

FROM base as builder

WORKDIR /app
RUN npm install -g add turbo
COPY . .
RUN turbo prune client --docker

# ----- install -----

FROM base as installer

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN npx turbo build --filter=client...

# ----- nginx -----

FROM nginx:stable-alpine3.17-slim

EXPOSE 80

COPY /apps/client/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --chown=node:node --from=installer /app/apps/client/dist /usr/share/nginx/html