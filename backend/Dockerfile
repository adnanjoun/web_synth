FROM gradle:8.10.2-jdk17 AS build

WORKDIR /app

COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle

RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon

COPY . .

RUN chmod +x gradlew
RUN ./gradlew bootJar --no-daemon


FROM amazoncorretto:17

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

ENV SYNTHEA_DIRECTORY=/synthea
ENV SYNTHEA_OUTPUT_DIRECTORY=/synthea/output

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
