param(
  [string]$BaseUrl = "https://sys822gs-landing.pages.dev"
)
$BaseUrl = $BaseUrl.TrimEnd("/")
$fail = 0

function Check($name, $scriptblock) {
  try {
    & $scriptblock
    Write-Host "OK $name"
  } catch {
    Write-Host "FAIL $name :: $($_.Exception.Message)"
    $script:fail++
  }
}

Check "home" {
  $r = Invoke-WebRequest "$BaseUrl/" -UseBasicParsing -TimeoutSec 30
  if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
  if ($r.Content -notmatch "SYS-822GS") { throw "missing SKU" }
  if ($r.Content -notmatch "canonical") { throw "missing canonical SEO" }
  if ($r.Content -notmatch "persistUtm") { throw "missing UTM script" }
}

Check "robots" {
  $r = Invoke-WebRequest "$BaseUrl/robots.txt" -UseBasicParsing -TimeoutSec 20
  if ($r.Content -notmatch "Sitemap:") { throw "bad robots" }
  if ($r.Headers["Content-Type"] -notmatch "text/plain") { throw "robots content-type $($r.Headers['Content-Type'])" }
}

Check "sitemap" {
  $r = Invoke-WebRequest "$BaseUrl/sitemap.xml" -UseBasicParsing -TimeoutSec 20
  if ($r.Content -notmatch "<loc>https://sys822.ru/</loc>") { throw "bad sitemap" }
}

Check "hero" {
  $r = Invoke-WebRequest "$BaseUrl/hero.png" -UseBasicParsing -TimeoutSec 60
  if ($r.RawContentLength -lt 1000000) { throw "hero too small $($r.RawContentLength)" }
  if ($r.Headers["Content-Type"] -notmatch "image/png") { throw "hero not png" }
}

Check "favicon" {
  $r = $null
  for ($i = 0; $i -lt 3; $i++) {
    try {
      $r = Invoke-WebRequest "$BaseUrl/favicon.svg" -UseBasicParsing -TimeoutSec 20
      if ($r.Content -match "<svg") { break }
    } catch {}
    Start-Sleep 3
  }
  if (-not $r -or $r.Content -notmatch "<svg") { throw "bad favicon" }
}

Check "lead" {
  $body = @{
    name = "Smoke"
    company = "Test"
    contact = "smoke@test.local"
    message = "automated"
    attribution = @{
      utm_source = "smoke"
      utm_medium = "test"
      utm_campaign = "deploy"
      page_url = "$BaseUrl/?utm_source=smoke"
    }
  } | ConvertTo-Json -Compress
  $r = Invoke-WebRequest "$BaseUrl/api/lead" -Method POST -Body $body -ContentType "application/json; charset=utf-8" -UseBasicParsing -TimeoutSec 40
  if ($r.Content -notmatch '"ok"\s*:\s*true') { throw $r.Content }
}

if ($fail -gt 0) { exit 1 }
Write-Host "ALL CHECKS PASSED ($BaseUrl)"
