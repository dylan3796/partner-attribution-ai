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
      // Type-strictness preference this codebase never enforced. Off rather than
      // tracked-as-debt; typing it is a separate, dedicated effort. Don't add
      // new `any` gratuitously.
      "@typescript-eslint/no-explicit-any": "off",
      // Advisory only and unsafe to auto-fix (adding deps can cause render
      // loops); the React Compiler optimization hints are informational. Off so
      // the lint baseline is clean. `rules-of-hooks` stays an ERROR — those are
      // genuine bugs.
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      // Perf hint, not a bug; a handful of intentional plain <img> usages.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;

