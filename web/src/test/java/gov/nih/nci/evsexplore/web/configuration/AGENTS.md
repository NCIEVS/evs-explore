# Configuration Tests Context

## Scope

This package tests Java static resource and SPA fallback configuration.

## Mocking Strategy

`StaticResourcesConfigurationTest` uses Mockito mocks for Spring MVC registry and registration objects. Keep these tests focused on verifying registered handlers, resource locations, cache setup, resource chains, and view-controller mappings.

## Behavior Under Test

The test verifies static resource extension registration, default static resource locations, cache-control registration, resource-chain enablement, and Angular route forwarding to `index.html`.

## Core Test Files

- `StaticResourcesConfigurationTest.java`
