/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_AX_RECOGNIZE_URL?: string;
  readonly VITE_TOSS_CLIENT_KEY?: string;
  readonly VITE_PAYMENT_CONFIRM_URL?: string;
}
