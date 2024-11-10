import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  define: {
    "import.meta.env.VERCEL_URL": JSON.stringify(process.env.VERCEL_URL),
    "import.meta.env.VERCEL_PROJECT_PRODUCTION_URL": JSON.stringify(
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ),
  },
});
