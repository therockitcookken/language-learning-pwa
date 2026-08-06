$ErrorActionPreference = 'Stop'
$AndroidHome = "C:\Android"
$CmdLineToolsDir = "$AndroidHome\cmdline-tools\latest"

Write-Host "Creating directories..."
New-Item -ItemType Directory -Force -Path $AndroidHome | Out-Null

$ZipPath = "$env:TEMP\commandlinetools.zip"

Write-Host "Downloading Android Command Line Tools..."
Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip" -OutFile $ZipPath

Write-Host "Extracting..."
Expand-Archive -Path $ZipPath -DestinationPath "$AndroidHome\cmdline-tools-temp" -Force

Write-Host "Moving to correct directory structure..."
New-Item -ItemType Directory -Force -Path "$AndroidHome\cmdline-tools" | Out-Null
if (Test-Path $CmdLineToolsDir) { Remove-Item -Recurse -Force $CmdLineToolsDir }
Rename-Item -Path "$AndroidHome\cmdline-tools-temp\cmdline-tools" -NewName "latest"
Move-Item -Path "$AndroidHome\cmdline-tools-temp\latest" -Destination "$AndroidHome\cmdline-tools\"
Remove-Item -Recurse -Force "$AndroidHome\cmdline-tools-temp"

Write-Host "Setting ANDROID_HOME environment variable..."
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $AndroidHome, "User")
$env:ANDROID_HOME = $AndroidHome

$SdkManager = "$CmdLineToolsDir\bin\sdkmanager.bat"

Write-Host "Accepting licenses..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/c yes | `"$SdkManager`" --licenses" -Wait -NoNewWindow

Write-Host "Installing platform-tools, platforms;android-34, build-tools;34.0.0..."
& $SdkManager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

Write-Host "Done! Android SDK installed at $AndroidHome"
