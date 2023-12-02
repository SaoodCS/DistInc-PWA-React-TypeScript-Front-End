#Start-Process powershell.exe -ArgumentList "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -Verb RunAs -Wait
#Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Get the current user's profile folder name
$windowsUserName = $env:USERNAME

# Get the Chrome profile name (if you haven't created seperate Chrome profiles, this will be "Default")
$chromeProfileName = "Profile 1"

# Build the folder path with the extracted username and Chrome profile name
$folderPath = "C:\Users\$windowsUserName\AppData\Local\Google\Chrome\User Data\$chromeProfileName\Service Worker"

# Check if the folder exists before attempting to delete
if (Test-Path $folderPath -PathType Container) {
    # Remove the folder and its contents
    Remove-Item -Path $folderPath -Recurse -Force
    Write-Host "Browser cache deleted..."
} else {
    Write-Host "delBrowserCache.ps1: Folder '$folderPath' not found."
}