# Java Test Context

## Scope

This package contains Java tests for the Spring Boot web module.

## Test Frameworks

Tests use JUnit Jupiter, Mockito, and AssertJ through `spring-boot-starter-webmvc-test`.

## Test Layout

Mirror production package names under `web/src/test/java`. Keep tests close to the Spring concern being verified, and prefer focused unit tests for MVC configuration, filters, and proxy behavior unless a full Spring context is needed.

## Context Map

- [configuration/AGENTS.md](configuration/AGENTS.md): tests for static resource and SPA route configuration.

## HTTP Regression Tests

WebApplicationTest starts embedded Tomcat and a local downstream HTTP stub to verify proxy behavior, license injection, JSON responses, Angular deep links, and static resource caching under a non-default context path.
