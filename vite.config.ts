import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Local dev: base = "/". GitHub Pages: set VITE_BASE_PATH=/<repo-name>/ before building.
  base: process.env.VITE_BASE_PATH ?? "/",
  server: {
    host: "127.0.0.1",
    port: 3013,
    strictPort: true
  },
  preview: {
    host: "127.0.0.1",
    port: 3013,
    strictPort: true
  },
  test: {
    environment: "jsdom"
  }
});
