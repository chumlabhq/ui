import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { readdirSync } from "fs";

// Components excluded from the npm library (site-only)
const EXCLUDED_COMPONENTS = new Set(["BrandLogo"]);

// Build per-component entry map: { "components/Button/index": "src/components/Button/index.ts", ... }
function getComponentEntries() {
  const componentsDir = resolve(__dirname, "src/components");
  const entries: Record<string, string> = {};
  for (const name of readdirSync(componentsDir, { withFileTypes: true })) {
    if (name.isDirectory() && !EXCLUDED_COMPONENTS.has(name.name)) {
      entries[`components/${name.name}/index`] = resolve(componentsDir, name.name, "index.ts");
    }
  }
  return entries;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    const componentEntries = getComponentEntries();
    return {
      plugins: [react(), tailwindcss()],
      publicDir: false,
      build: {
        sourcemap: false,
        cssMinify: true,
        lib: {
          entry: {
            index: resolve(__dirname, "src/index.ts"),
            ...componentEntries,
          },
        },
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "@tanstack/react-table",
            "date-fns",
            "clsx",
            "tailwind-merge",
          ],
          output: [
            {
              format: "es",
              chunkFileNames: "shared/[name]-[hash].js",
              assetFileNames: "style[extname]",
            },
            {
              format: "cjs",
              chunkFileNames: "shared/[name]-[hash].cjs",
              entryFileNames: "[name].cjs",
              assetFileNames: "style[extname]",
            },
          ],
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
        // Third-party allowlist:
        //   * Razorpay Standard Checkout - script (checkout.razorpay.com),
        //     XHR endpoints (api.razorpay.com, lumberjack-cx.razorpay.com),
        //     and the iframe it opens (api.razorpay.com).
        //   * Google OAuth - we use redirect-based flow so no script load,
        //     but `connect-src https:` is left wide-open for now.
        // X-Frame-Options: DENY above is overridden by frame-ancestors here
        // (CSP wins over the legacy header on supporting browsers).
        "Content-Security-Policy":
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src https://fonts.gstatic.com; " +
          "img-src 'self' https: data:; " +
          "connect-src 'self' https:; " +
          "frame-src https://api.razorpay.com https://checkout.razorpay.com; " +
          "frame-ancestors 'none'",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    },
  };
});
