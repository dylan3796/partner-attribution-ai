import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next. Depth-agnostic so build
  // output and generated code under apps/* and packages/* are not linted.
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/node_modules/**",
    "**/next-env.d.ts",
    "convex/_generated/**",
  ]),
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      // Dead imports are auto-removed; lingering unused vars are surfaced as
      // warnings (underscore-prefixed names are intentional and ignored).
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      // `'` and `"` in JSX text render correctly; this rule is pure noise.
      "react/no-unescaped-entities": "off",
      // Pre-existing `any` debt: tracked as warnings (needs proper typing),
      // not blocking. Do not add new `any`.
      "@typescript-eslint/no-explicit-any": "warn",
      // Advisory hints stay as warnings (not classic bugs; the React Compiler
      // optimization rules are informational). `rules-of-hooks` stays an ERROR
      // — those are genuine hook-ordering bugs and must be fixed, not silenced.
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
    },
  },
]);

export default eslintConfig;

