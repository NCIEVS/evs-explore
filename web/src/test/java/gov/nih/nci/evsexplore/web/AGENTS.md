# Java Test Context

## Scope

This package contains Java tests for the Spring Boot web module.

## Test Frameworks

Tests use JUnit 5, Mockito, and AssertJ through `spring-boot-starter-test`.

## Test Layout

Mirror production package names under `web/src/test/java`. Keep tests close to the Spring concern being verified, and prefer focused unit tests for MVC configuration, filters, and proxy behavior unless a full Spring context is needed.

## Context Map

- [configuration/AGENTS.md](configuration/AGENTS.md): tests for static resource and SPA route configuration.
