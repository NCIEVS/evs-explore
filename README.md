# evs-explore

EVS terminology browser application

## NPM Best Practices

See https://blog.risingstack.com/nodejs-at-scale-npm-best-practices/

* Run "npm outdated" from `frontend` to see whether versions are out of date
  * Check compatibility with the Angular version in `frontend/package.json` before upgrading.

### Building and running the Java Webapp

Gradle builds use JDK 25 and the checked-in Gradle 9.3.0 wrappers. The web module
uses Spring Boot 4.1.1. The frontend Gradle build downloads Node and npm;
development and Jest tests still run directly through npm without Java.

From the repository root, build the Angular assets first, then package the WAR:

```bash
make frontend
make build
cd web
java --add-opens=java.base/java.io=ALL-UNNAMED -jar build/libs/evsexplore-2.6.0.RELEASE.war
```

Open http://localhost:4200/evsexplore/welcome. `make build` skips Java tests and
does not rebuild Angular assets. Run `cd web && ./gradlew test` from the repository
root to run Java tests. The deployment ZIP is written to `web/build/distributions`.

### Deploying to AWS servers

Set `EVS_API_BASE_PATH` to the deployment's EVSRESTAPI base URL, such as
`http://localhost:8082`. The WAR reads this through `application.yml`.

Deployment hosts require Java 25. The packaged service launcher defaults to
`/usr/local/corretto-jdk25` and accepts a `JAVA_HOME` override. Adjust the matching
path in `evsexplore.service` for the host. The ZIP layout and start/stop commands
are unchanged.


### Launching EVS-EXPLORE for development

Use Node 22.14.0 and npm 10.9.2 to match the build tooling. Run `npm install` from
`frontend`. `make run` starts the local Angular server, and `make test` runs Jest;
both call npm directly and do not require Java.

There are three ways to launch EVS-EXPLORE for development:

* If running a http://localhost:8082 EVSRESTAPI, use `npm start` from `frontend`.
* To use the NCI dev deployment of EVSRESTAPI, use `npm run start:dev` from `frontend`. This method requires being connected to the NIH/NCI VPN.
* To simulate the production environment, perform the gradle build and then launch the .war file.  For example:

```bash
cd web
java -Xmx4096M -jar build/libs/evsexplore-2.6.0.RELEASE.war
```

When running in java mode like above, there is an endpoint to check the evs-explore version via

```
curl http://localhost:4200/evsexplore/version
```

### Making tag for deployment

There are a few steps to making a tag to deploy to the testing environments (dev, stage, qa, etc):
1. Build the frontend. Use the `make frontend` command from the top level directory.
2. Build the Java app. Use the `make build` command from the top level, or in `web` with the command `./gradlew clean build -x test`.
3. Test that the application works.
4. Push all changes to your branch.
5. Make the tag. Use the `make tag` command from the top level. This will require that you don't have any changes waiting to be pushed, otherwise it will fail.

### Updating frontend tooling

Keep CI's Node version and `frontend/build.gradle` aligned. Angular CLI is a local
dependency in `frontend/package.json`; npm scripts use that version, so a global
Angular CLI installation is unnecessary.

### Supported Browsers
The application has been specifically tested on the following browsers:

* Google Chrome
* Mozilla Firefox
* Microsoft Edge
* Opera
* Brave

### Setting up Prettier

- Download the official Prettier extension (version 10.1.0 or above).
- Make sure your ".prettierrc" file is in the root folder.
- Go to settings in the vscode menu.
- In the search bar, type "Prettier".
- Scroll down to "Prettier: Config Path"
- Type ".prettierrc" in the config path field.
- Now navigate to any typescript file.
- right click the code, and select "Format Document With...".
- If Prettier is not the default, select "Configure Default Formatter..." and select Prettier.
- Save your file, and and confirm that is prettier is working by checking the "prettier status" in the bottom right corner of the vsCode window.
- If it is red, observe the error and troubleshoot the problem by clicking the red icon.
