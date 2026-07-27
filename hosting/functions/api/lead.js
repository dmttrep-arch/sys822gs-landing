export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = corsHeaders();

  try {
    const data = await request.json();
    const name = String(data.name || "").trim();
    const company = String(data.company || "").trim();
    const contact = String(data.contact || "").trim();
    const message = String(data.message || "").trim() || "—";

    if (!name || !company || !contact) {
      return json({ ok: false, error: "required_fields" }, 400, headers);
    }
    if (name.length > 120 || company.length > 160 || contact.length > 160 || message.length > 2000) {
      return json({ ok: false, error: "too_long" }, 400, headers);
    }

    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return json({ ok: false, error: "telegram_not_configured" }, 500, headers);
    }

    const text = [
      "Новая заявка · SYS-822GS-NB3RT-01-G2",
      "",
      `Имя: ${name}`,
      `Компания: ${company}`,
      `Контакт: ${contact}`,
      `Комментарий: ${message}`,
      "",
      "Цена: от $1 000 000 · доставка в РФ · условия уточняйте",
    ].join("\n");

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
    const tgJson = await tg.json();
    if (!tgJson.ok) {
      return json(
        { ok: false, error: tgJson.description || "telegram_error" },
        502,
        headers
      );
    }

    return json({ ok: true }, 200, headers);
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) }, 500, headers);
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(payload, status, headers) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
