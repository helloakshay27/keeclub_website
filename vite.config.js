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
        onProxyReq(proxyReq) {
          proxyReq.setHeader(
            "Authorization",
            "Bearer 00De10000006JPl!AQEAQATuKY05AsQzxPHBgCHFA4Z7s5f.lZnSXT6_RtX3RJT_2gxj4OBkF0jECWtZGFEVXCwrUagII1gCNE.6G..0sP.cbWfA"
          );
        },
      },
    },
  },
});