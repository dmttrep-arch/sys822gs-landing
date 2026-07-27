param(
  [string]$Source = "telegram",
  [string]$Medium = "organic",
  [string]$Campaign = "sys822",
  [string]$Content = "",
  [string]$Term = ""
)
$base = "https://sys822.ru/"
$q = @{
  utm_source = $Source
  utm_medium = $Medium
  utm_campaign = $Campaign
}
if ($Content) { $q.utm_content = $Content }
if ($Term) { $q.utm_term = $Term }
$qs = ($q.GetEnumerator() | ForEach-Object { "{0}={1}" -f $_.Key, [uri]::EscapeDataString($_.Value) }) -join "&"
Write-Output "$base`?$qs"
