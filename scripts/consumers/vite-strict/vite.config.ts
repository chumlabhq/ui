import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Not minified, so a React warning names the component it came from rather
// than a mangled identifier. `base: "./"` so the build opens from file://.
export default defineConfig({ base: "./", build: { minify: false }, plugins: [react()] });
