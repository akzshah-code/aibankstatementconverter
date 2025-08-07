
interface ImportMetaEnv {
  readonly VITE_ADSENSE_CLIENT_ID: string;
  readonly VITE_ADSENSE_SLOT_ID: string;
  readonly VITE_RAZORPAY_KEY_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Allows process.env.API_KEY to be used in the client-side code
// for the Gemini API, as required by the coding guidelines. This
// variable is injected by Vite's 'define' config.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
