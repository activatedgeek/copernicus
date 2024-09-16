/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ASTRO_SITE: string;
  readonly GISCUS_REPO: string;
  readonly GISCUS_REPO_ID: string;
  readonly GISCUSS_CATEGORY: string;
  readonly GISCUSS_CATEGORY_ID: string;
  readonly GOATCOUNTER_SITE: string;
  readonly STATUS_SITE: string;
  readonly STATUS_SITE_ICON: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
