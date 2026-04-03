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
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "ChumlabUI",
          formats: ["es", "cjs"],
          fileName: "chumlab-ui",
        },
        rollupOptions: {
          external: ["react", "react-dom", "react/jsx-runtime"],
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
  };
});
