# Start SYS-822GS landing + Telegram sales bot
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

$env:PYTHONUNBUFFERED = "1"
$env:PYTHONIOENCODING = "utf-8"
$env:LLM_PROVIDER = "ollama"
$env:OLLAMA_MODEL = "hermes3-agent:latest"

$envFile = Join-Path $Root ".env"
if (Test-Path $envFile) {
  Get-Content $envFile -Encoding UTF8 | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
    $k, $v = $_.Split('=', 2)
    [Environment]::SetEnvironmentVariable($k.Trim(), $v.Trim().Trim('"'), "Process")
  }
}

function Test-Ollama {
  try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:11434/api/tags" -UseBasicParsing -TimeoutSec 3
    return $r.StatusCode -eq 200
  } catch { return $false }
}

if (-not (Test-Ollama)) {
  Write-Host "WARN: Ollama is down on :11434 - sales agent will use rule fallback." -ForegroundColor Yellow
}

Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
  Where-Object { $_.CommandLine -and ($_.CommandLine -like '*landing-sys-822gs*server.py*' -or $_.CommandLine -like '*landing-sys-822gs*sales_bot.py*') } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 1

$pyCandidates = @(
  "$env:USERPROFILE\AppData\Roaming\uv\python\cpython-3.11-windows-x86_64-none\python.exe",
  (Get-Command python -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source)
) | Where-Object { $_ -and (Test-Path $_) }
$py = $pyCandidates | Where-Object { $_ -notmatch 'hermes' } | Select-Object -First 1
if (-not $py) { $py = $pyCandidates | Select-Object -First 1 }
if (-not $py) { throw "python not found in PATH" }
Write-Host "Python: $py"

Start-Process -FilePath $py -ArgumentList @("-u", "server.py") -WorkingDirectory $Root -WindowStyle Minimized
Start-Sleep -Seconds 1
Start-Process -FilePath $py -ArgumentList @("-u", "sales_bot.py") -WorkingDirectory $Root -WindowStyle Minimized

Start-Sleep -Seconds 2
try {
  $code = (Invoke-WebRequest -Uri "http://127.0.0.1:8765/" -UseBasicParsing -TimeoutSec 5).StatusCode
  Write-Host "Landing OK ($code): http://127.0.0.1:8765/" -ForegroundColor Green
} catch {
  Write-Host "Landing FAILED: $_" -ForegroundColor Red
}

$lan = (Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -like '192.168.*' } |
  Select-Object -First 1 -ExpandProperty IPAddress)
if ($lan) {
  Write-Host "Phone Wi-Fi URL: http://${lan}:8765/" -ForegroundColor Cyan
}
Write-Host "Telegram bot: https://t.me/innvaAI_bot" -ForegroundColor Cyan
Write-Host "Stop: stop.bat" -ForegroundColor DarkGray
