# Environment Context

## Scope

This directory owns Angular environment constants and production file replacement behavior.

## Development Environment

`environment.ts` is used for local development. It sets `production: false`, local host expectations, the development Google Analytics code, and the dev Swagger URL.

## Production Environment

`environment.prod.ts` is substituted by Angular production builds. It sets `production: true`, production host expectations, the production Google Analytics code, and the production Swagger URL.

## Analytics and Swagger URLs

`AppComponent` reads environment analytics values for Google Analytics setup. API documentation links should use the environment Swagger value rather than hard-coded component URLs.
