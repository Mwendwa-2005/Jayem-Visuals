# kill-ports.ps1
Write-Host "Killing processes on ports 5000 and 5001..." -ForegroundColor Yellow

# Kill port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "✅ Killed port 5000" -ForegroundColor Green
}

# Kill port 5001
$process = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "✅ Killed port 5001" -ForegroundColor Green
}

Write-Host "Done! You can now start the server." -ForegroundColor Green