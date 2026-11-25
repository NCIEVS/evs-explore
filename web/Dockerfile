ARG BUILDPLATFORM

# Package the Spring Boot WAR. The Angular bundle is not built here; the WAR serves the
# frontend assets already committed under src/main/resources/static (see `make frontend`).
FROM --platform=$BUILDPLATFORM gradle:9.3.0-jdk25 AS web-build
WORKDIR /workspace/web
COPY --chown=gradle:gradle web/ ./
RUN gradle --no-daemon bootWar -x test

# Run the Linux deployment image as an unprivileged user.
FROM eclipse-temurin:25-jre-jammy

WORKDIR /app

RUN groupadd --system evsexplore \
    && useradd --system --gid evsexplore --home-dir /app --shell /usr/sbin/nologin evsexplore

COPY --from=web-build --chown=evsexplore:evsexplore /workspace/web/build/libs/evsexplore-*.war /app/evsexplore.war

USER evsexplore

# Listen on 8080 inside the container; remap with `docker run -p <host-port>:8080`.
ENV NCI_EVSEXPLORE_SERVER_PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/evsexplore.war"]
