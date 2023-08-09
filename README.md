# evs-explore

EVS terminology browser application

## NPM Best Practices

See https://blog.risingstack.com/nodejs-at-scale-npm-best-practices/

* Run "npm outdated" from frontend to see whether versions are out of date
  * Some fixing of packages was done, but this is really finicky.
  * Sticking with Angular 8 for now.

### Building the Java Webapp

This is how things run in production.

Run `make clean build` from the top level or `./gradlew clean build -x test"` from the "web/" folder.

### Deploying to AWS servers

The built application has an application.yml file that drives the proxy endpoint for the redirected
calls to the teh API.  Make sure this environment variable is set correctly for the deployment env.


### Launching EVS-EXPLORE for development

Install npm, ideally the version specified in package.json

There are three ways to launch EVS-EXPLORE for development:

* If running a http://localhost:8082 EVSRESTAPI, use `npm start` from `web/frontend`
* To use the NCI dev deployment of EVSRESTAPI, use `npm run start:dev` from `web/frontend`
* To simulate the production environment, perform the gradle build and then launch the .war file.  For example:

```bash
cd web
java -Xmx4096M -jar build/libs/evsexplore-*.war
```

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
The application has been specifically tested on the following browsers:The application has been specifically tested on the following browsers:

* Google Chrome
* Mozilla Firefox
* Microsoft Edge
* Opera
