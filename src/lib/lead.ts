export type Lead = {
  name: string;
  phone: string;
  sphere: string;
};

export type FieldErrors = {
  name?: string;
  phone?: string;
  sphere?: string;
};

export type LeadInput = {
  name: unknown;
  phone: unknown;
  sphere: unknown;
};

function text(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    digits = `7${digits}`;
  }
  if (digits.length < 10 || digits.length > 15) return null;
  return `+${digits}`;
}

export function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  }
  return e164;
}

export function sheetSafe(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function parseLead(
  input: LeadInput,
): { ok: true; lead: Lead } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = text(input.name).trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 60 || !/\p{L}/u.test(name)) {
    errors.name = "Введите имя";
  }

  const phone = normalizePhone(text(input.phone));
  if (!phone) {
    errors.phone = "Введите номер телефона";
  }

  const sphere = text(input.sphere).trim().replace(/\s+/g, " ");
  if (sphere.length < 2 || sphere.length > 80) {
    errors.sphere = "Укажите сферу бизнеса";
  }

  if (errors.name || errors.phone || errors.sphere || !phone) {
    return { ok: false, errors };
  }

  return { ok: true, lead: { name, phone, sphere } };
}
