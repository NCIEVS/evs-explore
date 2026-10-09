# Repository Context

## Global Architecture

EVS Explore is a terminology browser with two primary modules:

- `frontend/`: Angular application for search, concept display, hierarchy browsing, subsets, mappings, documentation, and term suggestion workflows.
- `web/`: Spring Boot Java 17 web module packaged as a WAR. It serves the built Angular app and proxies `/api/v1/**` requests to EVSRESTAPI.

Production-style builds copy Angular output into `web/src/main/resources/static`, where the Java web module serves it as static content.

## Build/Test Commands

- `make build`: build the Java web module from `web/` without tests.
- `make frontend`: build the Angular app and copy output into `web/src/main/resources/static`.
- `make test`: run frontend Jest tests through `frontend`.
- `cd web && ./gradlew test`: run Java tests.
- `cd frontend && npm start`: run Angular locally against `proxy.config.json`.
- `cd frontend && npm run start:dev`: run Angular locally against the NCI dev EVSRESTAPI proxy.

## Global Coding Standards

- Keep generated or copied build output separate from source changes unless the task explicitly requires updating it.
- Prefer existing framework patterns already used in the target module.
- Keep cross-module details at the nearest common parent; put implementation details in the directory that owns them.
- When a child directory has its own `AGENTS.md`, parent files should describe that child's scope and link to it instead of repeating its rules.
- Do not add new dependencies or build tools without a clear module-level reason.

## Context Map

- [frontend/AGENTS.md](frontend/AGENTS.md): Angular module build, source layout, and frontend context map.
- [frontend/src/AGENTS.md](frontend/src/AGENTS.md): browser entry points, global styles, assets, and environment files.
- [frontend/src/app/AGENTS.md](frontend/src/app/AGENTS.md): Angular shell, routing, module registration, and app-level testing conventions.
- [frontend/src/app/component/AGENTS.md](frontend/src/app/component/AGENTS.md): shared component conventions and feature-component map.
- [frontend/src/app/service/AGENTS.md](frontend/src/app/service/AGENTS.md): API, configuration, loading, notification, and error service patterns.
- [frontend/src/app/model/AGENTS.md](frontend/src/app/model/AGENTS.md): frontend model and DTO wrapper patterns.
- [frontend/src/app/directive/AGENTS.md](frontend/src/app/directive/AGENTS.md): Angular directive context.
- [frontend/src/environments/AGENTS.md](frontend/src/environments/AGENTS.md): Angular environment replacements and runtime constants.
- [frontend/src/assets/AGENTS.md](frontend/src/assets/AGENTS.md): source assets copied by Angular builds.
- [frontend/cypress/AGENTS.md](frontend/cypress/AGENTS.md): Cypress e2e context.
- [web/AGENTS.md](web/AGENTS.md): Java web module, packaging, resources, and backend context map.
- [web/src/main/java/gov/nih/nci/evsexplore/web/AGENTS.md](web/src/main/java/gov/nih/nci/evsexplore/web/AGENTS.md): Java application package context.
- [web/src/test/java/gov/nih/nci/evsexplore/web/AGENTS.md](web/src/test/java/gov/nih/nci/evsexplore/web/AGENTS.md): Java test package context.
