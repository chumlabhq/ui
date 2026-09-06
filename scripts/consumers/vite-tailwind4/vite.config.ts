import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `base: "./"` so the built app opens from file:// — the checks drive it in a
// real browser, which is the only place "did anything disappear" can be asked.
export default defineConfig({ base: "./", plugins: [react(), tailwindcss()] });
