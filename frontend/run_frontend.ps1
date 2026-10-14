$ErrorActionPreference = "Stop"
cd $PSScriptRoot
Write-Host "Starting React frontend..."
npm run dev -- --host
