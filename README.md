# evs-explore                                                                                                                          EVS terminology browser application                                                                                                                                                                                                                                           # BAC - Developer Instructions (Windows)                                                                                                                                                                                                                                      1. Install node.js - https://nodejs.org/en/download/                                                                                   2. Install the angluar cli - "npm install -g @angular/cli"                                                                             3.                                                                                                                                      # evs-explore
EVS terminology browser application

# BAC - Developer Instructions (Windows)

1. https://blog.risingstack.com/nodejs-at-scale-npm-best-practices/
  - Run "npm outdated" from frontend to see whether versions are out of dates
    Some fixing of packages was done, but this is really finicky.

2. Update dependencies and then run "./gradlew clean build" from "web"

3. Launch the application from "web/frontend" using "npm start"
OR Launch the application from "web" as a spring boot application