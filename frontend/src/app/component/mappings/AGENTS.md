# Mappings Component Context

## Scope

This component owns the mapset listing workflow.

## User Flow

The component loads available mapsets, renders list/table state, and links users to mapping detail pages.

## Service Dependencies

Use `MapsetService` for mapset retrieval. Use `ConfigurationService` only when terminology or source context is required by the existing workflow.

## State and URL Handling

Keep links aligned with `/mappings` and `/mappings/:code` routes from `app-routing.module.ts`.

## Entry Points

- `mappings.component.ts`
- `mappings.component.html`
- `mappings.component.spec.ts`
