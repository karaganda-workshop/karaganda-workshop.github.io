import { formatPhone, parseLead, sheetSafe, type FieldErrors } from "./lead";

const GOOGLE_SHEETS_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbzKJo3H8BBKKPcjCfs9Hzk3_wNDhJ1j4KSbXR2pOHI3vwiEGVLqm-q9vZdYbtLZv5-HoA/exec";

/** Ссылка на бота, куда уходит гость после сохранения заявки. */
const TELEGRAM_BOT_URL = "https://t.me/gdhryhtrh_bot";

export type LeadResult =
  | { ok: true; telegramUrl: string }
  | { ok: false; message: string; errors?: FieldErrors };

function telegramUrl(): string {
  const raw = TELEGRAM_BOT_URL.trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return "";
    if (url.hostname !== "t.me" && url.hostname !== "telegram.me") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export async function saveLead(input: unknown): Promise<LeadResult> {
  const record =
    input && typeof input === "object"
      ? (input as { name?: unknown; phone?: unknown; sphere?: unknown })
      : {};

  const parsed = parseLead({
    name: record.name,
    phone: record.phone,
    sphere: record.sphere,
  });

  if (!parsed.ok) {
    return { ok: false, message: "Проверьте поля формы.", errors: parsed.errors };
  }

  const hook = GOOGLE_SHEETS_WEBHOOK.trim();
  if (!hook) {
    return { ok: false, message: "Таблица Google ещё не подключена." };
  }

  const payload = {
    name: sheetSafe(parsed.lead.name),
    phone: sheetSafe(formatPhone(parsed.lead.phone)),
    sphere: sheetSafe(parsed.lead.sphere),
    pain: "",
    age: "",
    event: sheetSafe(`Сфера: ${parsed.lead.sphere}`),
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const body = await response.text();
    if (!response.ok) {
      console.error("sheets status", response.status);
      return { ok: false, message: "Не удалось сохранить заявку. Попробуйте ещё раз." };
    }
    try {
      const json = JSON.parse(body) as { ok?: boolean };
      if (json && json.ok === false) {
        return { ok: false, message: "Не удалось сохранить заявку. Попробуйте ещё раз." };
      }
    } catch {
      // Успешная запись Apps Script часто приходит не JSON-ом.
    }
    return { ok: true, telegramUrl: telegramUrl() };
  } catch (error) {
    console.error("sheets request failed", error instanceof Error ? error.name : "error");
    return { ok: false, message: "Не удалось сохранить заявку. Попробуйте ещё раз." };
  }
}
