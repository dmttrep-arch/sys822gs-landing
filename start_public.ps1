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

# QUIC works more reliably on this network than HTTP/2 (TLS/MITM issues)
Start-Process -FilePath $cf -ArgumentList @(
  "tunnel", "--url", "http://127.0.0.1:8765", "--no-autoupdate", "--protocol", "quic"
) -RedirectStandardOutput $out -RedirectStandardError $err -WindowStyle Minimized

# Backup tunnel via localhost.run (helps when trycloudflare is flaky for some clients)
Get-CimInstance Win32_Process -Filter "Name='ssh.exe'" |
  Where-Object { $_.CommandLine -match 'localhost\.run' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
$lhrErr = Join-Path $Root "lhr.log"
$lhrOut = Join-Path $Root "lhr.out.log"
Remove-Item $lhrErr, $lhrOut -ErrorAction SilentlyContinue
Start-Process -FilePath ssh -ArgumentList @(
  '-o','StrictHostKeyChecking=no','-o','ServerAliveInterval=30','-o','ExitOnForwardFailure=yes',
  '-R','80:127.0.0.1:8765','nokey@localhost.run'
) -RedirectStandardError $lhrErr -RedirectStandardOutput $lhrOut -WindowStyle Hidden

Write-Host "Waiting for public URL..."
$url = $null
$lhr = $null
for ($i = 0; $i -lt 45; $i++) {
  Start-Sleep 1
  if ((-not $url) -and (Test-Path $err)) {
    $m = Select-String -Path $err -Pattern 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' -AllMatches
    if ($m) {
      $url = $m.Matches.Value | Select-Object -Last 1
    }
  }
  if ((-not $lhr) -and (Test-Path $lhrOut)) {
    $m2 = Select-String -Path $lhrOut -Pattern 'https://[a-zA-Z0-9.-]+\.lhr\.life' -AllMatches
    if ($m2) { $lhr = $m2.Matches.Value | Select-Object -Last 1 }
  }
  if ($url -and $lhr) { break }
}

if (-not $url -and -not $lhr) { throw "No public URL from cloudflared or localhost.run" }
$primary = if ($url) { $url } else { $lhr }
$primary | Set-Content (Join-Path $Root "PUBLIC_URL.txt") -Encoding ascii
@(
  "PRIMARY=$primary"
  $(if ($url) { "CLOUDFLARE=$url" } else { $null })
  $(if ($lhr) { "LHR=$lhr" } else { $null })
) | Where-Object { $_ } | Set-Content (Join-Path $Root "PUBLIC_URLS.txt") -Encoding ascii

Write-Host "PUBLIC URL: $primary" -ForegroundColor Green
if ($lhr -and $url) { Write-Host "BACKUP URL: $lhr" -ForegroundColor Cyan }
Write-Host "Saved to PUBLIC_URL.txt"
try { Start-Process $primary } catch {}
