# Term Suggestion Form Component Context

## Scope

This component owns the dynamic term suggestion form workflow, including form sections, validators, captcha state, loaded form display, and submission behavior.

## User Flow

The component builds reactive form controls from field/section definitions, validates required and length-constrained inputs, supports clearing/reset behavior, handles captcha success/expiry, and sends form data through the form service.

## Service Dependencies

Use `TermSuggestionFormService` for form submission and related API calls. Use Angular reactive forms for validation rather than manual DOM validation.

## State and URL Handling

Concept code or context can be passed from concept workflows. Keep incoming context handling compatible with links from `ConceptDisplayComponent`.

## Entry Points

- `term-suggestion-form.component.ts`
- `term-suggestion-form.component.html`
- `term-suggestion-form.component.spec.ts`
