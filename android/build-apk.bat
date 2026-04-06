@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0\.."

echo [1/3] Build web (Vite) + bump version... 
powershell -NoProfile -Command "npm run build" || exit /b !ERRORLEVEL!

echo [2/3] Sync assets to Android (Capacitor)...
powershell -NoProfile -Command "npx cap sync android" || exit /b !ERRORLEVEL!

echo [3/3] Gradle build (AAB + APK release)...
cd /d "%~dp0"
echo Starting Gradle Build... > build-output.txt
call gradlew.bat :app:bundleRelease :app:assembleRelease --stacktrace >> build-output.txt 2>&1
set EXITCODE=!ERRORLEVEL!
echo. >> build-output.txt
echo Build completed with exit code: !EXITCODE! >> build-output.txt
type build-output.txt
exit /b !EXITCODE!
