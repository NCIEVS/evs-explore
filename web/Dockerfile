ARG BUILDPLATFORM

# Build the Angular production bundle with the repository's Gradle-managed Node/npm versions.
FROM --platform=$BUILDPLATFORM gradle:8.14.2-jdk17 AS frontend-build
WORKDIR /workspace/frontend
COPY --chown=gradle:gradle frontend/ ./
RUN gradle npmBuild --no-daemon

# Package the Spring Boot WAR with the freshly built frontend assets.
FROM --platform=$BUILDPLATFORM gradle:8.14.2-jdk17 AS web-build
WORKDIR /workspace/web
COPY --chown=gradle:gradle web/ ./
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build --chown=gradle:gradle /workspace/frontend/dist/ ./src/main/resources/static/
RUN gradle build -x test --no-daemon

# Run the Linux deployment image as an unprivileged user.
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

RUN groupadd --system evsexplore \
    && useradd --system --gid evsexplore --home-dir /app --shell /usr/sbin/nologin evsexplore

COPY --from=web-build --chown=evsexplore:evsexplore /workspace/web/build/libs/evsexplore-*.war /app/evsexplore.war

USER evsexplore

EXPOSE 4200

ENTRYPOINT ["java", "-jar", "/app/evsexplore.war"]