# Concept Detail Component Context

## Scope

This component owns compact concept detail rendering used by broader concept workflows.

## User Flow

The component receives or resolves a concept, renders high-value concept fields, and delegates detailed data retrieval to the concept service rather than duplicating API calls.

## Service Dependencies

Use `ConceptDetailService` for concept retrieval and `ConfigurationService` for terminology context when a lookup depends on the selected terminology.

## State and URL Handling

Keep route-derived state aligned with parent concept workflows. Avoid creating separate terminology selection behavior here.

## Entry Points

- `concept-detail.component.ts`
- `concept-detail.component.html`
- `concept-detail.component.spec.ts`
