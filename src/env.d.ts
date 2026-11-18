/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional booking link override; must be https://wa.me/<digits>. */
  readonly VITE_WHATSAPP_URL?: string;
  /** Meta Pixel ID (public, numeric). Tracking is off when empty. */
  readonly VITE_META_PIXEL_ID?: string;
  /** Yandex Metrika counter ID override (public, numeric). */
  readonly VITE_YANDEX_METRIKA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
