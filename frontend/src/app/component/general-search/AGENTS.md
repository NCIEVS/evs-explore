# General Search Component Context

## Scope

This component owns the main search screen, including single-term search, multi-term search, facets, paging, selected columns, and search export behavior.

## User Flow

The component initializes configuration from route/query parameters, prepares search criteria, runs search requests, updates the URL query string, lazy-loads table pages, and exports selected display columns.

## Service Dependencies

Primary dependencies are `SearchTermService` for search/export requests and `ConfigurationService` for terminology, source, metadata, and multi-search state.

## State and URL Handling

Search state is represented by `SearchCriteria` plus component fields for selected sources, terminology, paging, table columns, and multi-term input. Keep URL query parameters synchronized through the existing component methods rather than adding parallel state.

## Entry Points

- `general-search.component.ts`
- `general-search.component.html`
- `general-search.component.spec.ts`
