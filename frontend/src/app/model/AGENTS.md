# Model Context

## Scope

This directory owns TypeScript model classes, interfaces, and enums used to represent EVS API responses and UI display state.

## API Response Wrappers

Several models accept raw API objects in constructors and normalize fields for component display. Keep transformation logic here when it is reusable display-domain logic, especially for concepts, relationships, definitions, synonyms, history, and maps.

## Search and Table Models

Search and table state are represented by models such as `SearchCriteria`, `SearchResult`, `SearchResultTableFormat`, `Facet`, `FacetField`, `TableData`, and `TableHeader`.

## Concept Formatting Logic

`concept.ts` owns rich concept display helpers for preferred names, highlights, definitions, synonyms, relationships, maps, CDISC subset behavior, and text summaries. Avoid duplicating those helpers in components.

## Core Models

- `concept.ts`
- `searchCriteria.ts`
- `searchResult.ts`
- `searchResultTableFormat.ts`
- `relationship.ts`
- `definition.ts`
- `synonym.ts`
- `map.ts`
- `history.ts`
- `termFormData.model.ts`
