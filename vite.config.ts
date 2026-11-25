import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served at https://trading.all-path.com/game (files live under /trading/game/ in the site's public dir).
export default defineConfig({
  base: "/trading/game/",
  plugins: [react()],
  build: { outDir: "dist", assetsInlineLimit: 0 }
});
