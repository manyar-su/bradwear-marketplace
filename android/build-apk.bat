@echo off
echo Starting Gradle Build... > build-output.txt
call gradlew.bat assembleRelease --stacktrace >> build-output.txt 2>&1
echo. >> build-output.txt
echo Build completed with exit code: %ERRORLEVEL% >> build-output.txt
type build-output.txt
