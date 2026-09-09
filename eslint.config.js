import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // scripts/consumers holds another project's source: it imports the packed
  // package, which is not installed here, and follows each framework's idioms.
  { ignores: ["dist", "dist-site", "coverage", "scripts/consumers"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
    },
  },
  {
    // The public `cn` (src/utils/cn.ts) is re-exported from the package and
    // deliberately does NOT add the cl-s scope marker, because a consumer
    // calling it on their own markup must not have the library's confined
    // utilities start matching their elements. Library code needs the marking
    // variant or `asChild` silently renders unstyled — AUDIT-GAP.md §1.1.
    files: ["src/components/**/*.{ts,tsx}"],
    ignores: ["src/components/**/__tests__/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/utils/cn", "**/utils/cn.ts"],
              message:
                "Import { cn } from utils/scopedCn inside src/components — the public cn does not carry the cl-s marker.",
            },
          ],
        },
      ],
    },
  },
);
