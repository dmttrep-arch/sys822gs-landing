$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $Root
$utf8 = New-Object System.Text.UTF8Encoding $false

foreach ($f in @("index.html", "favicon.svg")) {
  [IO.File]::WriteAllText(
    (Join-Path $ProjectRoot "hosting\public\$f"),
    [IO.File]::ReadAllText((Join-Path $ProjectRoot $f), $utf8),
    $utf8
  )
}
Copy-Item (Join-Path $ProjectRoot "hero.png") (Join-Path $ProjectRoot "hosting\public\hero.png") -Force

$env:NODE_OPTIONS = "--use-system-ca"
Set-Location (Join-Path $ProjectRoot "hosting")
& .\node_modules\.bin\wrangler.cmd pages deploy public --project-name=sys822gs-landing --branch=main --commit-dirty=true
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root "smoke.ps1") -BaseUrl "https://sys822gs-landing.pages.dev"
Write-Host "Deployed. After DNS: run smoke with -BaseUrl https://sys822.ru"
