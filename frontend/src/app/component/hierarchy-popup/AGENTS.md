# Hierarchy Popup Component Context

## Scope

This component owns the popup-oriented hierarchy browser variant.

## User Flow

The component mirrors the hierarchy tree loading and source-filter behavior used by the full hierarchy display while adapting close behavior, route naming, and target handling for popup use.

## Service Dependencies

Use `ConceptDetailService` for hierarchy data and `ConfigurationService` for terminology, source, and popup status state.

## State and URL Handling

Keep popup route handling aligned with the route table and the full hierarchy component. Avoid changing popup close behavior without checking how `ConfigurationService` popup flags are used by concept pages.

## Entry Points

- `hierarchy-popup.component.ts`
- `hierarchy-popup.component.html`
- `hierarchy-popup.component.spec.ts`
