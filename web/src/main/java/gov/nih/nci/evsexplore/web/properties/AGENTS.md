# Properties Context

## Scope

This package owns configuration binding classes for the Java web module.

## Configuration Binding

`WebProperties` binds values from the `gov.nih.nci.evsexplore.web` prefix in `application.yml`. The class is enabled from the application entry point.

## Environment-Backed Properties

`application.yml` maps these properties to environment variables with defaults:

- `evsApibasePath`: defaults to local EVSRESTAPI.
- `uiLicense`: defaults to `ui-license`.

## Consumers

`ProxyService` uses the EVS API base path to build downstream request URIs. `UiHeaderPreFilter` uses the UI license to inject the EVSRESTAPI license header.

## Entry Points

- `WebProperties.java`
