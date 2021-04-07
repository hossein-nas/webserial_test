# we will use openjdk 8 with alpine as it is a very small linux distro
FROM adoptopenjdk/openjdk11

# copy the packaged jar file into our docker image
COPY bisarcore-0.0.1-SNAPSHOT.jar /bisar.jar

EXPOSE 443

# set the startup command to execute the jar
CMD ["java", "-jar", "/bisar.jar"]
