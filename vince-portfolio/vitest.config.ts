import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests sit next to their source (`lib/theme.test.ts`, …). e2e specs run under Playwright.
export default defineConfig({
  test: {
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    environment: "node",
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
