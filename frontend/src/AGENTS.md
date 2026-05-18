# Frontend Source Context

## Scope

This directory contains browser source files consumed by Angular CLI builds.

## Browser Entry Points

`main.ts` bootstraps `AppModule` and enables production mode based on the active environment file. `index.html` is the browser document entry point. `polyfills.ts` contains Angular browser polyfills.

## Global Styles and Assets

Global CSS is loaded through `angular.json`, including PrimeNG, Font Awesome, Bootstrap, `src/assets/primeng.custom.css`, and `src/styles.css`. Component styles should stay with their component unless they intentionally affect global application styling.

## Runtime Environments

Angular file replacement swaps `src/environments/environment.ts` for `src/environments/environment.prod.ts` in production builds.

## Context Map

- [app/AGENTS.md](app/AGENTS.md): Angular app code.
- [environments/AGENTS.md](environments/AGENTS.md): environment constants and replacement behavior.
- [assets/AGENTS.md](assets/AGENTS.md): source assets copied by Angular builds.
