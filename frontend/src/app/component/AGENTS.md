# Component Context

## Scope

This directory contains Angular components for EVS Explore workflows and shared UI shell pieces.

## Shared Component Patterns

Most components pair a `.ts` controller with `.html`, `.css`, and `.spec.ts` files. Route-owned components usually read route/query parameters, interact with services, and render PrimeNG or Bootstrap UI structures.

## Routing-Owned Components

The route table in `../app-routing.module.ts` is the source of truth for which components own browser routes. Avoid duplicating route rules in component context files.

## Shell and Utility Components

Simple shell or utility components are covered here unless they receive their own child context. This includes header, footer, loader, notifications, error, contact, API info, page-not-found, source-stats, welcome, concept-history, and concept-relationship components.

## Context Map

- [general-search/AGENTS.md](general-search/AGENTS.md): main terminology search workflow.
- [concept-display/AGENTS.md](concept-display/AGENTS.md): full concept page and export behavior.
- [concept-detail/AGENTS.md](concept-detail/AGENTS.md): compact concept detail rendering.
- [hierarchy-display/AGENTS.md](hierarchy-display/AGENTS.md): full hierarchy browser.
- [hierarchy-popup/AGENTS.md](hierarchy-popup/AGENTS.md): popup hierarchy browser variant.
- [subsets/AGENTS.md](subsets/AGENTS.md): subset hierarchy browser.
- [subset-details/AGENTS.md](subset-details/AGENTS.md): subset member table and export workflow.
- [mappings/AGENTS.md](mappings/AGENTS.md): mapset listing workflow.
- [mapping-details/AGENTS.md](mapping-details/AGENTS.md): mapset mapping table workflow.
- [term-suggestion-form/AGENTS.md](term-suggestion-form/AGENTS.md): dynamic term suggestion form.
- [documentation/AGENTS.md](documentation/AGENTS.md): metadata documentation pages.
