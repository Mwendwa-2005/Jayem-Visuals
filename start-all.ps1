# start-all.ps1
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Willfred Photography - Start All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$projectPath = "C:\Users\Administrator\OneDrive\Desktop\JAYEM PHOTOGRAPHY\willfred-photography"

Write-Host ""
Write-Host "Starting Backend (http://localhost:5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\backend'; Write-Host 'Backend Server' -ForegroundColor Cyan; npm start"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Starting Frontend (http://localhost:3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\frontend'; Write-Host 'Frontend Server' -ForegroundColor Cyan; live-server --port=3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Admin: http://localhost:3000/admin.html" -ForegroundColor White
Write-Host "Backend: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop the services." -ForegroundColor Gray