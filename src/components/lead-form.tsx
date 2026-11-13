import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { parseLead, type FieldErrors } from "@/lib/lead";
import { submitLead } from "@/lib/submit-lead";

const fieldClass =
  "mt-1 w-full bg-transparent text-base text-ink outline-none placeholder:text-quiet";

export function LeadForm() {
  const send = useServerFn(submitLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sphere, setSphere] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [telegramUrl, setTelegramUrl] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const parsed = parseLead({ name, phone, sphere });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    setStatus("saving");
    try {
      const result = await send({ data: { name, phone, sphere } });
      if (!result.ok) {
        setStatus("idle");
        if (result.errors) setErrors(result.errors);
        setFormError(result.message);
        return;
      }
      setTelegramUrl(result.telegramUrl);
      setStatus("saved");
    } catch {
      setStatus("idle");
      setFormError("Не удалось отправить заявку. Попробуйте ещё раз.");
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="mt-8">
        <div className="overflow-hidden rounded-2xl bg-snow">
          <div className="px-4 py-3">
            <label htmlFor="lead-name" className="block text-xs text-quiet">
              Имя
            </label>
            <input
              id="lead-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Как к вам обращаться"
              aria-invalid={Boolean(errors.name)}
              className={fieldClass}
            />
            {errors.name ? <p className="mt-1 text-sm text-danger">{errors.name}</p> : null}
          </div>
          <div className="mx-4 border-t border-line" />
          <div className="px-4 py-3">
            <label htmlFor="lead-phone" className="block text-xs text-quiet">
              Телефон / WhatsApp
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              placeholder="+7 700 000 00 00"
              aria-invalid={Boolean(errors.phone)}
              className={fieldClass}
            />
            {errors.phone ? <p className="mt-1 text-sm text-danger">{errors.phone}</p> : null}
          </div>
          <div className="mx-4 border-t border-line" />
          <div className="px-4 py-3">
            <label htmlFor="lead-sphere" className="block text-xs text-quiet">
              Сфера бизнеса
            </label>
            <input
              id="lead-sphere"
              name="sphere"
              value={sphere}
              onChange={(event) => {
                setSphere(event.target.value);
                setErrors((prev) => ({ ...prev, sphere: undefined }));
              }}
              placeholder="Например, кафе или онлайн-школа"
              aria-invalid={Boolean(errors.sphere)}
              className={fieldClass}
            />
            {errors.sphere ? <p className="mt-1 text-sm text-danger">{errors.sphere}</p> : null}
          </div>
        </div>

        {formError ? (
          <p role="alert" className="mt-4 text-sm text-danger">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status !== "idle"}
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-blue px-7 text-base font-medium text-snow transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:opacity-80 disabled:opacity-40"
        >
          {status === "saving" ? "Сохраняем…" : "Забронировать"}
        </button>
        <p className="mt-4 text-sm leading-normal text-quiet">
          После отправки формы с вами свяжутся и подтвердят участие. Материалы после семинара
          придут в Telegram-бот.
        </p>
      </form>

      {status === "saved" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 px-6">
          <div
            role="status"
            className="w-full max-w-sm rounded-3xl bg-snow px-8 py-10 text-center text-ink"
          >
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue text-snow">
              <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold">Ваши данные были сохранены</h2>
            <p className="mt-3 text-base leading-normal text-quiet">
              С вами свяжутся и подтвердят участие. Материалы после семинара придут в Telegram-бот.
            </p>
            {telegramUrl ? (
              <a
                href={telegramUrl}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-blue px-7 text-base font-medium text-snow"
              >
                Открыть Telegram
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
