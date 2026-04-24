import { useEffect } from "react";

/**
 * Injects a Schema.org JSON-LD `<script type="application/ld+json">` into
 * `<head>` while the caller is mounted and removes it on unmount, so the
 * client-rendered route contributes structured data crawlers can index.
 *
 * Pass a unique `id` so updates to the same schema on a route replace
 * instead of duplicating.
 */
export function useJsonLd(
  id: string,
  data: Record<string, unknown> | Record<string, unknown>[] | null,
) {
  useEffect(() => {
    if (!data) return;
    const existing = document.getElementById(id);
    const script =
      existing instanceof HTMLScriptElement
        ? existing
        : Object.assign(document.createElement("script"), {
            id,
            type: "application/ld+json",
          });
    script.textContent = JSON.stringify(data);
    if (!existing) document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [id, data]);
}

/**
 * Upserts a `<meta property|name="...">` tag in `<head>`. Used for per-route
 * OpenGraph, Twitter, and canonical metadata that shouldn't live statically
 * in index.html (because values differ per blog post, FAQ, etc).
 */
export function usePageMeta(
  tags: Array<{ name?: string; property?: string; content: string }>,
) {
  useEffect(() => {
    const elements: HTMLElement[] = [];
    const originals: Array<{ el: HTMLMetaElement; prev: string }> = [];

    for (const tag of tags) {
      const attr = tag.name ? "name" : "property";
      const key = tag.name ?? tag.property!;
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`,
      );
      if (el) {
        originals.push({ el, prev: el.getAttribute("content") ?? "" });
        el.setAttribute("content", tag.content);
      } else {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        el.setAttribute("content", tag.content);
        document.head.appendChild(el);
        elements.push(el);
      }
    }

    return () => {
      for (const { el, prev } of originals) el.setAttribute("content", prev);
      for (const el of elements) el.remove();
    };
  }, [tags]);
}

/**
 * Sets `<link rel="canonical">` to the given URL for the duration of mount.
 * Restores the previous value on unmount (or removes the tag if none existed).
 */
export function useCanonical(url: string) {
  useEffect(() => {
    let link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const created = !link;
    const prev = link?.getAttribute("href") ?? "";
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
    return () => {
      if (!link) return;
      if (created) link.remove();
      else link.setAttribute("href", prev);
    };
  }, [url]);
}
