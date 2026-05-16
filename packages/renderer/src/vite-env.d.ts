/// <reference types="vite/client" />
declare interface ViteTypeOptions {
  strictImportMetaEnv: true;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_BASE_URL: string;
}
