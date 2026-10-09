# Concept Display Component Context

## Scope

This component owns the full concept details page and the table/export logic derived from a loaded concept.

## User Flow

The component reads terminology/code route state, loads concept summary data, opens hierarchy views, optionally opens the term suggestion form with a concept code, filters selected sources, and builds display/export tables.

## Service Dependencies

Primary dependencies are `ConceptDetailService` for concept and hierarchy data and `ConfigurationService` for terminology, source, and hierarchy-popup state.

## State and URL Handling

Route parameters drive concept lookup. Selected sources are encoded through query parameters for concept and hierarchy links. Keep source filtering consistent with `getSelectedSourcesQueryParam()` and `keepSource()`.

## Entry Points

- `concept-display.component.ts`
- `concept-display.component.html`
- `concept-display.component.spec.ts`
