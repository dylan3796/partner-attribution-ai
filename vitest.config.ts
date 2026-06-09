import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@covant/engine": fileURLToPath(
        new URL("./engine/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts", "engine/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["engine/src/**/*.ts"],
    },
  },
});
