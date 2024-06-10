## Description

This is a simple Treasure Hunt API that allows users to create a treasure hunt and add products to it.

## Tech Stack

- NestJS
- TypeORM
- Postgres

# System Requirements

- Node.js: v18
- Yarn: v1.22.5

## Api Documentation

Docs can be found at https://treasure-hunt-api.fly.dev/api

Note: On API I assumed endpoints get products and users allowed to be public, but in a real scenario, they should be private.

## Authentication

1. You need to create a user first using endpoint POST /users.
2. Use endpoint POST /auth/login to get a token.
3. Add the token on swagger Authorize button.

## Devops

- The API is hosted on https://treasure-hunt-api.fly.dev/api
- There is a ci/cd github action that runs tests and lints on every push to the main branch.
- For watch and query logs [Grafana](https://fly-metrics.net/d/fly-logs/fly-logs?from=now-15m&to=now&var-app=treasure-hunt-api&var-instance=0801935a664768&orgId=105342&var-query=) please i did not deploy grafana it is provided out of the box by fly.io.

## Installation with Docker

1. Build the image

```bash
docker build -f "Dockerfile.dev" -t treasure-hunt-api-dev:latest "." 
```

2. Run the container

```bash
docker run -p 3000:3000 treasure-hunt-api-dev:latest
```

## Installation without Docker

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
