# evs-explore

EVS terminology browser application

## NPM Best Practices

See https://blog.risingstack.com/nodejs-at-scale-npm-best-practices/

* Run "npm outdated" from `frontend` to see whether versions are out of date
  * Some fixing of packages was done, but this is really finicky.
  * Sticking with Angular 16 for now.

### Building the Java Webapp

This is how things run in production.

Run `make clean build` from the top level or `./gradlew clean build -x test"` from the "web/" folder.

### Deploying to AWS servers

The built application has an application.yml file that drives the proxy endpoint for the redirected
calls to the the API.  Make sure this environment variable is set correctly for the deployment env.


### Launching EVS-EXPLORE for development

Install npm, ideally the version specified in package.json. Then run `npm install` from `frontend`.

There are three ways to launch EVS-EXPLORE for development:

* If running a http://localhost:8082 EVSRESTAPI, use `npm start` from `frontend`
* To use the NCI dev deployment of EVSRESTAPI, use `npm run start:dev` from `frontend`
* To simulate the production environment, perform the gradle build and then launch the .war file.  For example:

```bash
cd web
java -Xmx4096M -jar build/libs/evsexplore-*.war
```

### Making tag for deployment

There are three main steps to making a tag to deploy to the testing environments (dev, stage, qa, etc):
1. Build the frontend. Use the `make frontend` command from the top level directory.
2. Build the Java app. Use the `make build` command from the top level, or in `web` with the command `./gradlew clean build -x test`.
3. Make the tag. Use the `make tag` command from the top level. This will require that you don't have any changes waiting to be pushed, otherwise it will fail.

### Upgrading to latest

This should work on Linux and the Mac.

```
npm install -g n
n lts
```

Windows, run PowerShell as Administrator:

To update NPM:

```
Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force
npm install -g npm-windows-upgrade
npm-windows-upgrade
```

To update Node/ng, first install `nvm`:

```
# node version (google "windows install nvm" for how to install "nvm")
nvm install 18.16.0
nvm use 18.16.0
# ng version
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
```

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
