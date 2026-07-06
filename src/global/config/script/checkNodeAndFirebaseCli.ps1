$nodeVersion = $null

if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
}

if ($nodeVersion -ne 'v20.12.2') {
    Write-Host 'Error: Please install/use node v20.12.2, ensure it (or nvm) is added to PATH, and restart your terminal'
}

if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Please install firebase-tools, ensure it's added to PATH, and restart your terminal"
}
