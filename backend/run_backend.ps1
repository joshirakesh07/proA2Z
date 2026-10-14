$ErrorActionPreference = "Stop"
cd $PSScriptRoot
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}
.\venv\Scripts\Activate.ps1
Write-Host "Starting FastAPI backend..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
