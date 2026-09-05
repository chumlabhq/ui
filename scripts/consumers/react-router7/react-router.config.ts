import type { Config } from "@react-router/dev/config";

/**
 * `ssr` alone renders at request time, which would need the matrix to start a
 * server and hold a port. `prerender` runs the same server handler at build
 * time and leaves the HTML on disk, so the assertion is a file read: same code
 * path, nothing to tear down.
 */
export default {
  ssr: true,
  prerender: ["/"],
} satisfies Config;
