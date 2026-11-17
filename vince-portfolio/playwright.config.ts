import { defineConfig, devices } from "@playwright/test";

// Each stream has its own port (CONTRACT 6.3). Requires a prior `npm run build`.
const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "e2e",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
