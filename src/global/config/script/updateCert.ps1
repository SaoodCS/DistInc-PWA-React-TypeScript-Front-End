$hasMkcert = [bool](Get-Command mkcert -ErrorAction SilentlyContinue)
$hasOpenSsl = [bool](Get-Command openssl -ErrorAction SilentlyContinue)

if (-not $hasMkcert) {
    Write-Host "Error: Please Install mkcert -> ensure it's added to PATH -> restart your terminal"
}

if (-not $hasOpenSsl) {
    Write-Host "Error: Please install openssl, ensure it's added to PATH, and restart your terminal"
}

if (-not $hasMkcert -or -not $hasOpenSsl) {
    exit
}

$mkcertCaRoot = mkcert -CAROOT
$mkcertRootCa = Join-Path $mkcertCaRoot 'rootCA.pem'

if (-not (Test-Path $mkcertRootCa)) {
    Write-Host 'Installing the mkcert root certificate...'
    mkcert -install
}
else {
    Write-Host 'mkcert root certificate already exists.'
}
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
                Write-Host 'PLEASE RESTART THE CMD OR CODE EDITOR AND RUN THE SCRIPT AGAIN.' -ForegroundColor Red
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
                    Write-Host 'PLEASE RESTART THE CMD OR CODE EDITOR AND RUN THE SCRIPT AGAIN.' -ForegroundColor Red
                }
                exit
            }
        }
        $domains = Get-CertificateDomains -certPath $certPath
        $domains = $domains -join ', '
        Write-Host 'The domains in the existing certificate are: ' $domains
        Write-Host 'the current IP address for this machine is: ' $ipAddress
        if ($domains -match $ipAddress) {
            Write-Host 'The existing active certificates include the current IP address and it has not expired, so exiting script.' -ForegroundColor Green
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
Write-Host 'The certificate(s) have been generated successfully.' -ForegroundColor Green

