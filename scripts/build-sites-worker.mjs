import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = await readFile(join(root, "index.html"), "utf8");
const page = source.replace(
  /src="hero\.png"/g,
  'src="https://cdn.jsdelivr.net/gh/dmttrep-arch/sys822gs-landing@gh-pages/hero.png"'
);

const serverDir = join(root, "dist", "server");
await mkdir(serverDir, { recursive: true });
await writeFile(
  join(serverDir, "index.js"),
  `const PAGE = ${JSON.stringify(page)};

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/lead") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "method_not_allowed" }, 405);
      }

      let data;
      try {
        data = await request.json();
      } catch {
        return json({ ok: false, error: "invalid_json" }, 400);
      }

      const name = String(data?.name || "").trim();
      const company = String(data?.company || "").trim();
      const contact = String(data?.contact || "").trim();
      const message = String(data?.message || "").trim() || "—";

      if (!name || !company || !contact) {
        return json({ ok: false, error: "required_fields" }, 400);
      }
      if (name.length > 120 || company.length > 160 || contact.length > 160 || message.length > 2000) {
        return json({ ok: false, error: "too_long" }, 400);
      }
      if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        return json({ ok: false, error: "service_not_configured" }, 503);
      }

      const text = [
        "Новая заявка · SYS-822GS-NB3RT-01-G2",
        "",
        "Имя: " + name,
        "Компания: " + company,
        "Контакт: " + contact,
        "Комментарий: " + message,
        "",
        "Цена: от $1 000 000 · условия уточняйте"
      ].join("\\n");

      const telegramResponse = await fetch(
        "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text,
            disable_web_page_preview: true
          })
        }
      );

      if (!telegramResponse.ok) {
        return json({ ok: false, error: "delivery_failed" }, 502);
      }
      return json({ ok: true });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    return new Response(request.method === "HEAD" ? null : PAGE, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
        "content-security-policy": "default-src 'self'; img-src 'self' https://cdn.jsdelivr.net data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
        "referrer-policy": "strict-origin-when-cross-origin",
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY"
      }
    });
  }
};
`,
  "utf8"
);

await mkdir(join(root, "dist", ".openai"), { recursive: true });
await writeFile(
  join(root, "dist", ".openai", "hosting.json"),
  await readFile(join(root, ".openai", "hosting.json"), "utf8"),
  "utf8"
);
