// FIX: Moved ImportMeta and ImportMetaEnv interfaces into the `declare global`
// block. When `import` is used, this file becomes a module, and global type
// augmentations must be explicitly declared in the global scope to be applied
// project-wide. This resolves the error "Property 'env' does not exist on type 'ImportMeta'".
import 'vite/client';

declare global {
  // Define the structure of `import.meta.env` for type safety.
  interface ImportMetaEnv {
    readonly VITE_RAZORPAY_KEY_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

// This empty export is required to ensure this file is treated as a module.
export {};
