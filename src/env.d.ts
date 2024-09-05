/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ASTRO_SITE: string;
  readonly STATUS_PAGE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
