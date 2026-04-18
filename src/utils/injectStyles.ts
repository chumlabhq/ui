/**
 * Injects a <style> block into <head> once per unique id.
 * Used to inline critical CSS that would otherwise require a separate stylesheet import.
 */
const injected = new Set<string>();

export function injectStyles(id: string, css: string): void {
  if (injected.has(id) || typeof document === "undefined") return;
  injected.add(id);
  const style = document.createElement("style");
  style.setAttribute("data-chumlab", id);
  style.textContent = css;
  document.head.appendChild(style);
}
