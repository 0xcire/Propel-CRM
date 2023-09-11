# TODO: revert to node:20 when possible
# look out for TypeError: Cannot redefine property: File

# FROM node:20-bullseye-slim AS build-stage

FROM node:18-bullseye-slim AS build-stage

WORKDIR /usr/src/app
COPY package*.json package-lock*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

# -----

FROM nginx:stable-alpine3.17-slim

EXPOSE 80

COPY /nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --chown=node:node --from=build-stage /usr/src/app/dist /usr/share/nginx/html
