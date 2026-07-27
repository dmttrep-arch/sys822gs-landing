# Start public Cloudflare quick tunnel to local landing :8765
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cf = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
if (-not (Test-Path $cf)) { $cf = "C:\Program Files\cloudflared\cloudflared.exe" }
if (-not (Test-Path $cf)) { throw "cloudflared not found. Install: winget install Cloudflare.cloudflared -e --source winget" }

# Ensure landing is up
try {
  Invoke-WebRequest "http://127.0.0.1:8765/" -UseBasicParsing -TimeoutSec 3 | Out-Null
} catch {
  Write-Host "Landing is down. Starting start.ps1 first..." -ForegroundColor Yellow
  & "$Root\start.ps1"
  Start-Sleep 3
}

Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep 1

$err = Join-Path $Root "tunnel.err.log"
$out = Join-Path $Root "tunnel.log"
Remove-Item $err, $out -ErrorAction SilentlyContinue

Start-Process -FilePath $cf -ArgumentList @(
  "tunnel", "--url", "http://127.0.0.1:8765", "--no-autoupdate", "--protocol", "http2"
) -RedirectStandardOutput $out -RedirectStandardError $err -WindowStyle Minimized

Write-Host "Waiting for public URL..."
$url = $null
for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep 1
  if (Test-Path $err) {
    $m = Select-String -Path $err -Pattern 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' -AllMatches
    if ($m) {
      $url = $m.Matches.Value | Select-Object -Last 1
      break
    }
  }
}

if (-not $url) { throw "No public URL in tunnel.err.log" }

$url | Set-Content (Join-Path $Root "PUBLIC_URL.txt") -Encoding UTF8
Write-Host "PUBLIC URL: $url" -ForegroundColor Green
Write-Host "Saved to PUBLIC_URL.txt"
Write-Host "Open on phone (4G/Wi-Fi): $url"
