// The original triple-slash reference to "vite/client" was causing a type resolution error.
// This can happen in projects with complex or misconfigured TypeScript settings.
// Using a direct import statement achieves the same goal of including Vite's client-side
// type definitions for features like `import.meta.env` and static asset imports.
import 'vite/client';
