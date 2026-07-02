# syntax=docker/dockerfile:1

FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace

COPY gradlew build.gradle settings.gradle ./
COPY gradle ./gradle
RUN chmod +x gradlew
RUN ./gradlew dependencies --configuration runtimeClasspath --no-daemon > /dev/null

COPY src ./src
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app

RUN mkdir -p /opt/datadog
ADD https://dtdg.co/latest-java-tracer /opt/datadog/dd-java-agent.jar

COPY --from=build /workspace/build/libs/*.jar app.jar

EXPOSE 8080
ENV SERVER_PORT=8080
ENV JAVA_TOOL_OPTIONS="-javaagent:/opt/datadog/dd-java-agent.jar"

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
