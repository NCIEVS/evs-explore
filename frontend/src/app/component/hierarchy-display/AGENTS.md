# Hierarchy Display Component Context

## Scope

This component owns the full hierarchy browser for concept tree paths and child expansion.

## User Flow

The component loads hierarchy paths for a selected concept, pages through multiple hierarchy positions, expands/collapses tree nodes, loads child nodes on demand, scrolls to the selected tree row, and filters display by selected sources.

## Service Dependencies

Primary dependencies are `ConceptDetailService` for hierarchy data and `ConfigurationService` for terminology/source state and popup triggers.

## State and URL Handling

Route parameters provide terminology and concept code. Query parameters can carry selected source filters. Keep hierarchy and concept links consistent with existing `hierarchyPart`, `conceptPart`, and URL target fields.

## Entry Points

- `hierarchy-display.component.ts`
- `hierarchy-display.component.html`
- `hierarchy-display.component.spec.ts`
