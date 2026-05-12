# Cypress Context

## Scope

This directory owns Cypress e2e configuration, tests, fixtures, and support files for the Angular frontend.

## E2E Configuration

`cypress.config.ts` sets the e2e base URL to the local Angular server. Start the frontend before running Cypress unless the chosen workflow starts it for you.

## Test Entry Points

- `e2e/spec.cy.ts`
- `support/e2e.ts`
- `support/commands.ts`
