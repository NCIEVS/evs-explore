FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

RUN groupadd --system evsexplore \
    && useradd --system --gid evsexplore --home-dir /app --shell /usr/sbin/nologin evsexplore

COPY build/libs/evsexplore-*.war /app/evsexplore.war

USER evsexplore

EXPOSE 4200

ENTRYPOINT ["java", "-jar", "/app/evsexplore.war"]