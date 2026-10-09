# Web Module Context

## Scope

This module owns the Spring Boot web application, Java backend proxy behavior, WAR packaging, runtime configuration, and static hosting of the built Angular app.

## Module Architecture

The module is a Java 17 Spring Boot application using Gradle. It disables JDBC datasource auto-configuration, binds EVS Explore web properties from `application.yml`, serves static Angular assets from `src/main/resources/static`, and forwards API calls to EVSRESTAPI through Java request handling.

## Build and Runtime Notes

- `build.gradle` defines Spring Boot, Spring Cloud Gateway MVC dependencies, dependency locking, WAR packaging, and zip packaging.
- `src/main/resources/application.yml` defines the servlet context path, server port, logging levels, and `gov.nih.nci.evsexplore.web` property namespace.
- `src/main/resources/static` is build output copied from `frontend/dist`; do not treat hashed JS/CSS files there as source files.
- `src/main/bin/evsexplore` is packaged into the distribution zip as an executable helper script.

## Configuration and Resources

Runtime values are environment-backed through `application.yml`, including server port, context path, EVS API base path, UI license, and logging levels. Logging is configured by `src/main/resources/logback.xml`.

## Context Map

- [src/main/java/gov/nih/nci/evsexplore/web/AGENTS.md](src/main/java/gov/nih/nci/evsexplore/web/AGENTS.md): Java application package and child package map.
- [src/test/java/gov/nih/nci/evsexplore/web/AGENTS.md](src/test/java/gov/nih/nci/evsexplore/web/AGENTS.md): Java test package and child package map.
