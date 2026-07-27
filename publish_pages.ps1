# Publish GitHub Pages (UTF-8 no BOM) + print working mirror URLs
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $Root ".env"
$tmp = Join-Path $env:TEMP "sys822gs-pages-publish"

$token = ""; $chat = ""
Get-Content $envFile -Encoding UTF8 | ForEach-Object {
  if ($_ -match '^TELEGRAM_BOT_TOKEN=(.+)$') { $token = $Matches[1].Trim().Trim('"') }
  if ($_ -match '^TELEGRAM_CHAT_ID=(.+)$') { $chat = $Matches[1].Trim().Trim('"') }
}
if (-not $token -or -not $chat) { throw "Missing Telegram credentials in .env" }

$utf8 = New-Object System.Text.UTF8Encoding $false
$html = [IO.File]::ReadAllText((Join-Path $Root "index.html"), $utf8)

# Absolute asset URLs for CDN mirrors
$html = $html -replace 'src="hero\.png"', 'src="https://cdn.jsdelivr.net/gh/dmttrep-arch/sys822gs-landing@gh-pages/hero.png"'

$inject = @"
<script>
window.LEAD_TG = { token: "$token", chatId: "$chat" };
</script>
"@
if ($html -notmatch 'window\.LEAD_TG') {
  $html = $html.Replace('</head>', "$inject`n</head>")
} else {
  $html = [regex]::Replace($html, '(?s)<script>\s*window\.LEAD_TG\s*=\s*\{.*?\};\s*</script>', $inject.Trim())
}

$handler = @'
<script>
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
}, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".reveal, .value-item").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 70 + "ms";
  io.observe(el);
});
async function sendToTelegram(text) {
  const cfg = window.LEAD_TG || {};
  if (!cfg.token || !cfg.chatId) throw new Error("telegram_not_configured");
  const endpoint = "https://api.telegram.org/bot" + cfg.token + "/sendMessage";
  const payload = { chat_id: cfg.chatId, text: text, disable_web_page_preview: true };
  try {
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { const j = await res.json().catch(() => ({ ok: true })); if (j.ok !== false) return true; }
  } catch (e) {}
  const proxies = [
    function(u){ return "https://corsproxy.io/?" + encodeURIComponent(u); },
    function(u){ return "https://api.allorigins.win/raw?url=" + encodeURIComponent(u); }
  ];
  for (var i = 0; i < proxies.length; i++) {
    try {
      const res = await fetch(proxies[i](endpoint), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) return true;
    } catch (e) {}
  }
  return await new Promise(function(resolve) {
    var iframe = document.getElementById("tg-lead-frame");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "tg-lead-frame";
      iframe.name = "tg-lead-frame";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }
    var form = document.createElement("form");
    form.method = "GET";
    form.target = "tg-lead-frame";
    form.action = endpoint;
    var fields = { chat_id: String(cfg.chatId), text: text.slice(0, 3500), disable_web_page_preview: "true" };
    Object.keys(fields).forEach(function(k) {
      var input = document.createElement("input");
      input.type = "hidden"; input.name = k; input.value = fields[k]; form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    setTimeout(function(){ form.remove(); resolve(true); }, 1200);
  });
}
document.getElementById("lead-form").addEventListener("submit", async function(event) {
  event.preventDefault();
  var form = event.currentTarget;
  var btn = form.querySelector('button[type="submit"]');
  var note = document.getElementById("form-note");
  var data = new FormData(form);
  var name = String(data.get("name") || "").trim();
  var company = String(data.get("company") || "").trim();
  var contact = String(data.get("contact") || "").trim();
  var message = String(data.get("message") || "").trim() || "—";
  btn.disabled = true;
  note.textContent = "Отправляем…";
  var text = [
    "Новая заявка · SYS-822GS-NB3RT-01-G2", "",
    "Имя: " + name, "Компания: " + company, "Контакт: " + contact, "Комментарий: " + message, "",
    "Цена: от $1 000 000 · доставка в РФ · условия уточняйте",
    "Источник: " + location.href
  ].join("\n");
  try {
    await sendToTelegram(text);
    note.textContent = "Заявка принята. Свяжемся с вами.";
    form.reset();
  } catch (err) {
    note.textContent = "Не удалось отправить. Попробуйте ещё раз чуть позже.";
    console.error(err);
  } finally {
    btn.disabled = false;
  }
});
</script>
'@

$html = [regex]::Replace($html, '(?s)\s*<script>.*?</script>\s*</body>', "`n$handler`n</body>")

Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tmp | Out-Null
[IO.File]::WriteAllText((Join-Path $tmp "index.html"), $html, $utf8)
Copy-Item (Join-Path $Root "hero.png") (Join-Path $tmp "hero.png") -Force

Set-Location $tmp
git init -b gh-pages | Out-Null
git add index.html hero.png
git -c user.email="deploy@local" -c user.name="deploy" commit -m "UTF-8 mirror-ready landing" | Out-Null
git remote add origin https://github.com/dmttrep-arch/sys822gs-landing.git
git push -f origin gh-pages

$mirror = "https://cdn.jsdelivr.net/gh/dmttrep-arch/sys822gs-landing@gh-pages/index.html"
Set-Content (Join-Path $Root "PUBLIC_URL.txt") $mirror -Encoding ascii
Write-Host "MIRROR: $mirror"
Write-Host "GITHUB: https://dmttrep-arch.github.io/sys822gs-landing/"
Write-Host "LOCAL:  http://127.0.0.1:8765/"
Write-Host "LAN:    http://192.168.68.117:8765/"
