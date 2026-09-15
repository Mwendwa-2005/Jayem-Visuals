@echo off
title Willfred Photography Website
echo ========================================
echo Willfred Photography - Starting Website
echo ========================================
echo.

echo [1/2] Starting Backend Server...
cd "C:\Users\Willfred Jayem\Desktop\willfred-photography\backend"
start /min cmd /k "node server.js"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server...
cd "C:\Users\Willfred Jayem\Desktop\willfred-photography\frontend"
start /min cmd /k "live-server --port=3000"

echo.
echo ========================================
echo ✅ Website is now running!
echo ========================================
echo.
echo 📍 Frontend: https://jayem-visuals.vercel.app
echo 📍 Admin:    https://jayem-visuals.vercel.app/admin.html
echo 📍 Backend:  http://localhost:5000
echo.
echo Close this window to stop the servers.
pause