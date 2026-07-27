Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
  Where-Object {
    $_.CommandLine -and (
      $_.CommandLine -like '*landing-sys-822gs*server.py*' -or
      $_.CommandLine -like '*landing-sys-822gs*sales_bot.py*'
    )
  } |
  ForEach-Object {
    Write-Host "Stopping PID $($_.ProcessId)"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }

Write-Host "Stopped."
