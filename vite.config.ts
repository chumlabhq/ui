import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { readdirSync, readFileSync } from "fs";

// Components excluded from the npm library (site-only). These are built for the
// marketing site and docs; shipping them bloats the tarball and, in ui/Button's
// case, publishes a SECOND Button that would confuse consumers.
const EXCLUDED_COMPONENTS = new Set(["BrandLogo", "Reveal", "ui"]);

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

// Each packaged flag is its own lazily-imported chunk. Keep them unhashed under
// flags/ so the output is greppable and the bundle guarantee can assert that
// none of them are reachable from the default entries.
function flagAwareChunkName(ext: string) {
  return (chunk: { facadeModuleId?: string | null }) =>
    chunk.facadeModuleId?.includes("/CountryFlag/flags/")
      ? `flags/[name].${ext}`
      : `shared/[name]-[hash].${ext}`;
}

// https://vite.dev/config/

// React Server Components boundary marker.
//
// Next.js App Router treats every module as a Server Component by default, so a
// consumer importing an interactive component into a server page gets a build
// error unless someone marks the boundary. Making the CONSUMER wrap every
// import is the common library failure; marking it here is what Radix, MUI and
// react-aria do.
//
// Only chunks that actually need it are marked - a directive on a purely
// presentational chunk would needlessly force it out of RSC. Hooks, context and
// DOM event props are what genuinely cannot cross the boundary.
const CLIENT_ONLY =
  /\b(useState|useEffect|useLayoutEffect|useReducer|useContext|useRef|useMemo|useCallback|createContext|useSyncExternalStore|useImperativeHandle)\b|\bon[A-Z]\w+\s*:/;

function useClientDirective(): Plugin {
  return {
    name: "chumlab-use-client",
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter((c) => c.type === "chunk");
      const needsDirective = new Set(
        chunks.filter((c) => CLIENT_ONLY.test(c.code)).map((c) => c.fileName),
      );

      // A per-component entry is usually a bare re-export of a shared chunk, so
      // it carries no hook of its own. Propagating up the import graph means the
      // module a CONSUMER names is itself the boundary, instead of depending on
      // their bundler to trace the re-export.
      for (let changed = true; changed; ) {
        changed = false;
        for (const chunk of chunks) {
          if (needsDirective.has(chunk.fileName)) continue;
          if (chunk.imports.some((i) => needsDirective.has(i))) {
            needsDirective.add(chunk.fileName);
            changed = true;
          }
        }
      }

      for (const chunk of chunks) {
        if (!needsDirective.has(chunk.fileName)) continue;
        // Must precede every import to be a valid directive prologue.
        chunk.code = `"use client";\n${chunk.code}`;
      }
      this.info(`use client: marked ${needsDirective.size} of ${chunks.length} chunks`);
    },
  };
}

// Copies the design tokens into dist as tokens.css, for consumers who run
// Tailwind themselves. Copied rather than compiled ON PURPOSE: the file's
// @theme block is what lets the consumer's Tailwind generate the cl-* utilities
// the components emit, and running Tailwind over it would consume @theme.
function copyTokens(): Plugin {
  return {
    name: "chumlab-copy-tokens",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "tokens.css",
        source: readFileSync(resolve(__dirname, "src/styles/tokens.css"), "utf8"),
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    const componentEntries = getComponentEntries();
    return {
      plugins: [
        // Compiles the library against src/jsx, which stamps a marker class on
        // every rendered DOM element so the utilities in dist/styles.css can be
        // scoped to our own markup. See src/jsx/jsx-runtime.ts.
        react({ jsxImportSource: resolve(__dirname, "src/jsx") }),
        tailwindcss(),
        useClientDirective(),
        copyTokens(),
      ],
      publicDir: false,
      build: {
        sourcemap: false,
        cssMinify: true,
        lib: {
          entry: {
            index: resolve(__dirname, "src/index.ts"),
            ...componentEntries,
            // Opt-in phone validators — kept out of the default component entry so
            // libphonenumber-js only loads when @chumlab/ui/phone-validators is imported.
            "components/InternationalPhoneInput/validators/index": resolve(
              __dirname,
              "src/components/InternationalPhoneInput/validators/index.ts",
            ),
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
              chunkFileNames: flagAwareChunkName("js"),
              assetFileNames: "style[extname]",
            },
            {
              format: "cjs",
              chunkFileNames: flagAwareChunkName("cjs"),
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
      // Not `dist`. Both builds defaulted there, so `npm run build` deleted the
      // library `npm run build:lib` had just produced — and every gate that
      // reads dist/ then measured the site instead. The snippet typechecker was
      // the one that showed it: with no library types to resolve, all but 35 of
      // 626 snippets failed to compile and it silently rewrote itself down to
      // the survivors, reporting success.
      outDir: "dist-site",
      sourcemap: false,
    },
    server: {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        // Third-party allowlist:
        //   * Razorpay Standard Checkout - script (checkout.razorpay.com),
        //     XHR endpoints (api.razorpay.com, lumberjack-cx.razorpay.com),
        //     and the iframe it opens (api.razorpay.com).
        //   * Google OAuth - we use redirect-based flow so no script load,
        //     but `connect-src https:` is left wide-open for now.
        //   * Local chumlab-be (http://localhost:5000) - dev-server-only
        //     headers, so this never reaches production responses.
        // The site frames only itself: the docs pages' phone-width frames
        // (PhoneFrame) load the site's own /preview routes, hence frame-src and
        // frame-ancestors 'self' and X-Frame-Options SAMEORIGIN. Same origin
        // only; framing by any other origin stays blocked. Restoring the
        // playground preview also needs script-src blob: (docs/playground-removal.md).
        "Content-Security-Policy":
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; " +
          "style-src 'self' 'unsafe-inline'; " +
          "font-src 'self'; " +
          "img-src 'self' https: data:; " +
          "connect-src 'self' https: http://localhost:5050; " +
          "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com; " +
          "frame-ancestors 'self'",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    },
  };
});
