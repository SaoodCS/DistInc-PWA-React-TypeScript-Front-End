if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host 'choco is not installed. Installing choco...'
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    Write-Host 'choco has been installed. PLEASE RESTART THE CMD OR CODE EDITOR and run this script again.'
    exit
}
if (-not (Get-Command mkcert -ErrorAction SilentlyContinue)) {
    Write-Host 'mkcert is not installed. Installing mkcert using choco...'
    choco install mkcert -y
    Write-Host 'mkcert has been installed. PLEASE RESTART THE CMD OR CODE EDITOR and run this script again.'
    exit
}
if (-not (Get-Command openssl -ErrorAction SilentlyContinue)) {
    Write-Host 'OpenSSL is not installed. Installing OpenSSL using choco...'
    choco install openssl -y
    Write-Host 'openssl has been installed. PLEASE RESTART THE CMD OR CODE EDITOR and run this script again.'
    exit
}
Write-Host 'Installing the mkcert root certificate...'
mkcert -install
#
Write-Host 'Getting the IPv4 address for this machine...'
$ipAddress = (Get-NetIPAddress | Where-Object { $_.AddressFamily -eq 'IPv4' -and $_.InterfaceAlias -like '*Wi*Fi*' }).IPAddress
Write-Host 'The IP address of this machine is: ' $ipAddress
#
if (Test-Path -Path .\.cert\cert.pem) {
    Write-Host 'There are certificates that already exist in the .cert directory.'
    #
    Write-Host 'Checking if the existing certificates have expired...'
    function Get-CertificateExpiration {
        param (
            [string]$certPath
        )
        try {
            $expirationDate = & openssl x509 -in $certPath -noout -enddate 2>&1
            if ($LASTEXITCODE -ne 0) {
                throw 'Failed to read the certificate expiration date.'
            }
            $expirationDate = $expirationDate -replace 'notAfter=', ''
            $expirationDate = [DateTime]::ParseExact($expirationDate, 'MMM d HH:mm:ss yyyy GMT', [System.Globalization.CultureInfo]::InvariantCulture)
            return $expirationDate
        }
        catch {
            Write-Host "Error: $_"
            if ($_ -match 'openssl is not recognized') {
                Write-Host 'PLEASE RESTART THE CMD OR CODE EDITOR.'
            }
            exit
        }
    }
    $certPath = '.\.cert\cert.pem'
    $expirationDate = Get-CertificateExpiration -certPath $certPath
    $currentDate = Get-Date
    Write-Host 'The existing certificates expire on: ' $expirationDate.ToString('dd/MM/yyyy HH:mm:ss')
    Write-Host 'The current date is: ' $currentDate.ToString('dd/MM/yyyy HH:mm:ss')
    if ($currentDate -ge $expirationDate) {
        Write-Host 'Thus existing certificate has expired, so will replace the existing certificate with a new one...'
    }
    else {
        Write-Host 'The existing certificate has not expired...'
        #
        Write-Host 'Checking if the active certificate matches the IPv4 address for this machine...'
        function Get-CertificateDomains {
            param (
                [string]$certPath
            )
            try {
                $domains = & openssl x509 -in $certPath -noout -text 2>&1
                if ($LASTEXITCODE -ne 0) {
                    throw 'Failed to read the certificate domains.'
                }
                $domains = $domains -split "`n" | Where-Object { $_ -match 'DNS:' } | ForEach-Object { $_ -replace 'DNS:', '' }
                return $domains
            }
            catch {
                Write-Host "Error: $_"
                if ($_ -match 'openssl is not recognized') {
                    Write-Host 'PLEASE RESTART THE CMD OR CODE EDITOR.'
                }
                exit
            }
        }
        $domains = Get-CertificateDomains -certPath $certPath
        $domains = $domains -join ', '
        Write-Host 'The domains in the existing certificate are: ' $domains
        Write-Host 'the current IP address for this machine is: ' $ipAddress
        if ($domains -match $ipAddress) {
            Write-Host 'The existing active certificates include the current IP address and it has not expired, so exiting script...'
            exit
        }
        else {
            Write-Host 'The existing active certificates do not include the current IP address, so will delete the existing certificate and create a new one...'
        }
    }
}
#
if (Test-Path -Path .\.cert) {
    Write-Host 'Deleting the existing .cert directory...'
    Remove-Item -Recurse -Force .\.cert
}
#
if (!(Test-Path -Path .\.cert)) {
    Write-Host 'Creating a new .cert directory...'
    New-Item -ItemType Directory -Path .\.cert
}
#
Write-Host 'Running the mkcert command to generate the certificate(s)...'
$mkcertCommand = "mkcert -key-file .\.cert\key.pem -cert-file .\.cert\cert.pem localhost $ipAddress"
Invoke-Expression $mkcertCommand

