import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/salesforce": {
        target: "https://piramal-realty--preprd.sandbox.my.salesforce.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/salesforce/, ""),
      },
    },
  },
});