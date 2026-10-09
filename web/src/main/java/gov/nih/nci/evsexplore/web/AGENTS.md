# Java Web Application Context

## Scope

This package is the root Java package for the EVS Explore Spring Boot web application.

## Application Entry Point

`EVSWebApplication.java` bootstraps Spring Boot, excludes datasource auto-configuration, enables `WebProperties`, and starts the application.

## Spring Composition

Spring components are organized by concern:

- `controllers`: request handling and EVSRESTAPI proxying.
- `configuration`: static resources and SPA route forwarding.
- `filters`: servlet request mutation before controller handling.
- `properties`: configuration binding for EVS Explore web settings.

## Package Map

- [controllers/AGENTS.md](controllers/AGENTS.md): proxy controller and service behavior.
- [configuration/AGENTS.md](configuration/AGENTS.md): static asset handlers and route forwarding.
- [filters/AGENTS.md](filters/AGENTS.md): license-header request filter behavior.
- [properties/AGENTS.md](properties/AGENTS.md): bound web properties and their consumers.

## Core Files

- `EVSWebApplication.java`
