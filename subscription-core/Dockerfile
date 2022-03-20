# Common build stage
FROM node:14.15.0-alpine as common-build-stage

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["yarn", "run", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["yarn", "run", "start"]
