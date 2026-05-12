# Subsets Component Context

## Scope

This component owns the subset hierarchy browser.

## User Flow

The component loads top-level subset hierarchy data, expands/collapses tree nodes, reveals more children, supports subset tree search, and sorts NCIt-related nodes for display.

## Service Dependencies

Use `ConceptDetailService` for subset hierarchy retrieval and `ConfigurationService` for terminology context.

## State and URL Handling

The selected terminology comes from route/configuration state. Keep subset detail links consistent with `/subset/:terminology/:code` routing.

## Entry Points

- `subsets.component.ts`
- `subsets.component.html`
- `subsets.component.spec.ts`
