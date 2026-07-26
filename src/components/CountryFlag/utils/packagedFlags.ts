import { useState, useEffect } from "react";
import { FLAG_MODULES } from "../flags";

// A chunk that fails to load resolves to this instead of rejecting, so the
// browser fires a real error event on the <img> and the existing onError /
// fallback path runs unchanged rather than surfacing an unhandled rejection.
const FAILED_SRC = "data:,";

const cache = new Map<string, string>();

// data: URI rather than an inline <svg> so the rendered DOM stays an <img> -
// classes.image, onLoad/onError, alt and sizing all keep behaving as before.
function toDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

async function load(code: string): Promise<string> {
  const cached = cache.get(code);
  if (cached) return cached;

  const importFlag = FLAG_MODULES[code];
  if (!importFlag) return FAILED_SRC;

  const uri = toDataUri((await importFlag()).default);
  cache.set(code, uri);
  return uri;
}

/**
 * Resolves a packaged flag to a data URI. Returns null while the chunk is in
 * flight. Pass null to opt out entirely (the caller supplied its own basePath).
 */
export function usePackagedFlag(code: string | null): string | null {
  // Resolved chunks are read straight from the cache during render, so a flag
  // that has already loaded paints on the first pass with no effect round-trip.
  const [resolved, setResolved] = useState<{ code: string; src: string } | null>(null);

  useEffect(() => {
    if (!code || cache.has(code)) return;

    let active = true;
    load(code)
      .then((src) => active && setResolved({ code, src }))
      .catch(() => active && setResolved({ code, src: FAILED_SRC }));

    return () => {
      active = false;
    };
  }, [code]);

  if (!code) return null;
  return cache.get(code) ?? (resolved?.code === code ? resolved.src : null);
}
