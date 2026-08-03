@echo off
title AI Based Student Performance Analytics System

echo =====================================================
echo Starting AI Based Student Performance Analytics System
echo =====================================================

:: Start ASP.NET Core Backend
start "Backend API" cmd /k "cd /d "%~dp0backend" && dotnet run --project src\Infrastructure\StudentPerformanceAnalytics.Api\StudentPerformanceAnalytics.Api.csproj"

:: Wait for backend
timeout /t 5 >nul

:: Start Flask ML Service
start "Flask ML Service" cmd /k "cd /d "%~dp0ml-service\StudentAnalytics_API" && python app.py"

:: Wait for Flask
timeout /t 5 >nul

:: Start React Frontend
start "React Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Wait for frontend
timeout /t 8 >nul

:: Open browser
start http://localhost:3000

echo.
echo =====================================================
echo All services started successfully!
echo Backend  : http://localhost:5056
echo Frontend : http://localhost:3000
echo Swagger  : http://localhost:5056/swagger
echo =====================================================

pause