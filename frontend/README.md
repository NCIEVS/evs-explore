# Frontend

The Angular UI is built and tested with the local dependencies in `package.json`.
Use Node 22.14.0 and npm 10.9.2. Run the commands below from `frontend`.

## Development

```bash
npm install
npm start
```

Open http://localhost:4200/. The server reloads when source files change and
proxies API requests to EVSRESTAPI at `http://localhost:8082`.
Use `npm run start:dev` for the NCI development API (requires VPN access).

## Build

- `npm run build:prod`: build the production bundle in `dist`.
- `./gradlew build`: build the production bundle and copy it into the Java web
  module. This command requires JDK 25 and downloads its own Node/npm tools.

See the [repository README](../README.md) for WAR packaging and deployment.

## Tests

```bash
npm test
npm run cypress:open
```

Unit tests use Jest. Start the Angular server before running Cypress.
`npm run cypress:run` runs the end-to-end tests
without the interactive runner. These npm commands do not require Java.

## Angular CLI

Use `npm run ng -- <command>` to run the project's Angular CLI, for example:

```bash
npm run ng -- generate component component-name
```
