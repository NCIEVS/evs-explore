# Angular App Context

## Scope

This directory contains the Angular application shell, routing table, module declarations/providers, feature components, services, models, directives, and unit tests.

## Application Shell

`app.component.ts` owns app-level behavior such as route-change scrolling, Google Analytics page views, terminology license modal handling, and terminology-change subscription cleanup.

## Routing

`app-routing.module.ts` owns the primary route table. Routes map user workflows to components for search, concepts, hierarchy, subsets, mappings, documentation, contact, errors, API info, and term suggestions.

## Dependency Registration

`app.module.ts` registers Angular modules, PrimeNG modules, ng-bootstrap, app components, pipes, services, `APP_INITIALIZER`, global error handling, and the loading interceptor.

## Unit Test Conventions

Component and service specs are colocated with the files they test. Prefer focused TestBed setup and mock services over broad app-module imports when adding new tests.

## Context Map

- [component/AGENTS.md](component/AGENTS.md): component patterns and feature-component map.
- [service/AGENTS.md](service/AGENTS.md): API, configuration, loader, notification, and error services.
- [model/AGENTS.md](model/AGENTS.md): EVS DTO-style models and display helpers.
- [directive/AGENTS.md](directive/AGENTS.md): custom Angular directives.

## Core Files

- `app.component.ts`
- `app.module.ts`
- `app-routing.module.ts`
