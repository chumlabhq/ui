import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Unminified: the assertion reads the emitted JS for markers of the components
// that must not be in it, and a mangled build hides which module they came from.
export default defineConfig({ build: { minify: false }, plugins: [react()] });
