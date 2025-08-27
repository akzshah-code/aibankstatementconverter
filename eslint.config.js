// eslint.config.js
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import refreshPlugin from "eslint-plugin-react-refresh";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", ".wrangler"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": hooksPlugin,
      "react-refresh": refreshPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      "react-refresh/only-export-components": "warn",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
        react: {
            version: "detect"
        }
    }
  }
);
