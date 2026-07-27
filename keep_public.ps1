# Watchdog: keep landing + Cloudflare quick tunnel alive, refresh PUBLIC_URL.txt
$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$py = "C:\Users\User\AppData\Roaming\uv\python\cpython-3.11-windows-x86_64-none\python.exe"
$cf = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
if (-not (Test-Path $cf)) { $cf = "C:\Program Files\cloudflared\cloudflared.exe" }

function Ensure-Landing {
  try {
    $r = Invoke-WebRequest "http://127.0.0.1:8765/" -UseBasicParsing -TimeoutSec 4
    if ($r.StatusCode -eq 200) { return }
  } catch {}
  Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
    Where-Object { $_.CommandLine -match 'server\.py' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Get-Content (Join-Path $Root ".env") -Encoding UTF8 | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
    $k, $v = $_.Split('=', 2)
    Set-Item "Env:$($k.Trim())" $v.Trim().Trim('"')
  }
  $env:PYTHONUNBUFFERED = "1"
  $env:HOST = "0.0.0.0"
  $env:PORT = "8765"
  Start-Process $py -ArgumentList "-u", "server.py" -WorkingDirectory $Root -WindowStyle Hidden
  Start-Sleep 2
}

function Ensure-Tunnel {
  $alive = $false
  $urlFile = Join-Path $Root "PUBLIC_URL.txt"
  if (Test-Path $urlFile) {
    $u = (Get-Content $urlFile -Raw).Trim()
    if ($u) {
      try {
        $r = Invoke-WebRequest "$u/" -UseBasicParsing -TimeoutSec 12
        if ($r.StatusCode -eq 200) { $alive = $true }
      } catch { $alive = $false }
    }
  }
  if ($alive -and (Get-Process cloudflared -ErrorAction SilentlyContinue)) { return }
  & (Join-Path $Root "start_public.ps1")
}

Write-Host "keep_public running. Ctrl+C to stop."
while ($true) {
  Ensure-Landing
  Ensure-Tunnel
  Start-Sleep 45
}
