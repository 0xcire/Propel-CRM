# TODO: dumb-init in gcr distroless?

FROM node:20-bullseye-slim AS build-stage

WORKDIR /usr/src/app
COPY package*.json package-lock*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -----

FROM node:20-bullseye-slim AS deps

WORKDIR /usr/src/app
COPY package*.json package-lock*.json ./
COPY --chown=node:node --from=build-stage /usr/src/app/dist ./
RUN npm ci --omit=dev

# -----

FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /usr/src/app
COPY --chown=node:node --from=deps /usr/src/app ./

EXPOSE 1337

ENV NODE_ENV="production"
CMD ["index.js"]


