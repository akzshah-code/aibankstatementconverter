// eslint.config.js
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import refreshPlugin from "eslint-plugin-react-refresh";

export default [
  // Global ignores
  {
    ignores: ["dist/", "node_modules/", "functions/", "*.js", "*.cjs", "*.mjs"],
  },
  
  // Base TypeScript configuration
  ...tseslint.configs.recommended,
  
  // React-specific configuration
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "react-refresh": refreshPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Recommended rules from plugins
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      
      // Customizations and overrides
      "react/react-in-jsx-scope": "off", // Not needed with modern React
      "react/prop-types": "off", // Not needed with TypeScript
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
];
