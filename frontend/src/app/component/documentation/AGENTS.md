# Documentation Components Context

## Scope

This directory contains metadata documentation pages for EVS terminologies.

## Metadata Documentation Pattern

Documentation components generally resolve the current terminology from routing/configuration state, call `ConfigurationService` metadata endpoints, and render the response as reference tables or static overview content.

## Terminology Route Parameters

Most documentation routes support `:terminology` and default redirects from route names without a terminology segment. Keep route behavior centralized in `app-routing.module.ts`.

## Core Components

- `associations`
- `properties`
- `qualifiers`
- `roles`
- `sources`
- `term-types`
- `definition-types`
- `synonym-types`
- `overview`
- `alldocs`
- `subset-ncit`
