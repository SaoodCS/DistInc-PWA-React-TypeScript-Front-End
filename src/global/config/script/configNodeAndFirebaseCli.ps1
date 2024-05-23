if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host 'chocolatey is not installed. Installing choco...'
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    Write-Host 'chocolatey has been installed. PLEASE RESTART THE CMD OR CODE EDITOR and run this script again.' -ForegroundColor Cyan
    exit
}
if (-not (Get-Command nvm -ErrorAction SilentlyContinue)) {
    Write-Host 'nvm is not installed. Installing nvm using choco...'
    choco install nvm -y
    Write-Host 'nvm has been installed. PLEASE RESTART THE CMD OR CODE EDITOR and run this script again.' -ForegroundColor Cyan
    exit
}

Write-Host 'Installing node version 20.12.2 through nvm if not already installed...'
nvm install 20.12.2

Write-Host 'Using node version 20.12.2...'
nvm use 20.12.2

Write-Host 'Installing the latest firebase-tools version if not already installed...'
npm install -g firebase-tools@latest

Write-Host 'Env setup is complete' -ForegroundColor Green
