FROM maven:3.6.3-jdk-11-slim

WORKDIR /opt/api

COPY pom.xml .
COPY src .

CMD ["mvn", "spring-boot:run"]
