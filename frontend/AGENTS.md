# Frontend Module Context

## Scope

This module owns the Angular EVS Explore user interface, local Angular development server setup, frontend unit/e2e test configuration, and production build output copied into the Java web module.

## Angular Build and Test Commands

- `npm start`: serve locally through `proxy.config.json`.
- `npm run start:dev`: serve locally through `proxy.dev.config.json`.
- `npm run build`: standard Angular build.
- `npm run build:prod`: production build with `/evsexplore/` base href.
- `npm run test`: Jest unit tests.
- `npm run cypress:open` or `npm run cypress:run`: Cypress e2e workflows.
- `./gradlew build`: runs the Gradle Node build and copies `dist` into `../web/src/main/resources/static`.

## Frontend Architecture

The frontend is an Angular application using PrimeNG, ng-bootstrap, Angular forms, Angular routing, Jest, and Cypress. Application behavior is organized around components, services, models, directives, environment files, and source assets.

## Development Proxy Targets

Local API proxying is configured outside source code:

- `proxy.config.json`: `/api/v1/**` to local EVSRESTAPI on port 8082.
- `proxy.dev.config.json`: `/api/v1/**` to the NCI dev EVSRESTAPI endpoint.

## Context Map

- [src/AGENTS.md](src/AGENTS.md): browser entry points, styles, assets, and environments.
- [src/app/AGENTS.md](src/app/AGENTS.md): Angular app shell, routing, module registration, and child app contexts.
- [src/environments/AGENTS.md](src/environments/AGENTS.md): development and production environment constants.
- [src/assets/AGENTS.md](src/assets/AGENTS.md): source images, downloads, and custom PrimeNG CSS.
- [cypress/AGENTS.md](cypress/AGENTS.md): Cypress e2e setup.
