/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional booking link override; must be https://wa.me/<digits>. */
  readonly VITE_WHATSAPP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
