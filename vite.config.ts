import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [react(), tailwindcss()],
      build: {
        sourcemap: false,
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "ChumlabUI",
          formats: ["es", "cjs"],
          fileName: "chumlab-ui",
        },
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "@tanstack/react-table",
            "date-fns",
          ],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
        },
      },
    };
  }

  return {
    plugins: [react(), tailwindcss()],
    build: {
      sourcemap: false,
    },
    server: {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https:",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    },
  };
});
