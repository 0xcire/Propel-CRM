# TODO: dumb-init in gcr distroless?

FROM node:20-bullseye-slim as base

# ----- prune -----

FROM base as prune

WORKDIR /app
RUN npm install -g add turbo
COPY . .
RUN turbo prune server --docker

# ----- build -----

FROM base as build-stage

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=prune /app/out/full/ .
COPY turbo.json turbo.json

RUN npx turbo build --filter=server...

# ----- production dependencies -----

FROM base as prod-deps

WORKDIR /app
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/package-lock.json ./package-lock.json

COPY --from=build-stage /app/apps/server/dist ./apps/server
COPY --from=build-stage /app/packages/redis/dist ./packages/redis
COPY --from=build-stage /app/packages/drizzle/dist ./packages/drizzle
COPY --from=build-stage /app/packages/lib/dist ./packages/lib

RUN npm pkg delete scripts.prepare
RUN npm install --omit=dev --workspace=server

# ----- runner -----

FROM gcr.io/distroless/nodejs20-debian11

COPY --chown=node:node --from=prod-deps /app ./app
EXPOSE 1337
WORKDIR /app/apps/server

ENV NODE_ENV="production"
CMD ["index.js"]