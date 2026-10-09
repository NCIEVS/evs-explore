# Mapping Details Component Context

## Scope

This component owns mapset detail and mapping row display.

## User Flow

The component reads the mapset code from the route, loads mapset details and mapping rows, handles paging/search/sort behavior, and renders map relationships for users.

## Service Dependencies

Use `MapsetService` for mapset and mapping retrieval. Keep shared terminology metadata behavior in `ConfigurationService` if needed.

## State and URL Handling

Route parameter `:code` identifies the mapset. Keep paging and filter state coordinated with the service request parameters.

## Entry Points

- `mapping-details.component.ts`
- `mapping-details.component.html`
- `mapping-details.component.spec.ts`
