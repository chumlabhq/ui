import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `base: "./"` keeps the emitted asset paths relative, so the built app can be
// served from a throwaway static server rather than the consumer's dev server.
export default defineConfig({ base: "./", plugins: [react(), tailwindcss()] });
