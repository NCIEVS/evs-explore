# Subset Details Component Context

## Scope

This component owns subset member detail pages, including lazy loading, sorting, searching, CDISC-specific display helpers, and export formatting.

## User Flow

The component loads subset metadata and member rows, responds to table lazy-load events, searches within subset members, and formats export rows using concept properties and synonyms.

## Service Dependencies

Use `ConceptDetailService` for subset info, members, and export retrieval. Use `ConfigurationService` for terminology context and export limits.

## State and URL Handling

Route parameters identify the subset terminology and code. Keep paging, sort, and search state in the component table workflow so exports match the visible query.

## Entry Points

- `subset-details.component.ts`
- `subset-details.component.html`
- `subset-details.component.spec.ts`
