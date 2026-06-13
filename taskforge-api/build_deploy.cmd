@echo off
REM Required: -Duser.timezone=UTC fixes Oracle JDBC timestamp timezone resolution
mvnw.cmd spring-boot:run -Dspring-boot.run.jvmArguments="-Duser.timezone=UTC"