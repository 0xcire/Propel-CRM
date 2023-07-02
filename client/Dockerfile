FROM node:20-bullseye-slim AS build-stage

WORKDIR /usr/src/app
COPY package*.json package-lock*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

# -----

FROM nginx:stable-alpine3.17-slim

COPY --chown=node:node --from=build-stage /usr/src/app/dist /usr/share/nginx/html
