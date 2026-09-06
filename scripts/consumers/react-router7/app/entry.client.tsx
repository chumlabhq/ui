import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

/**
 * The default client entry, with `onRecoverableError` passed.
 *
 * This is the only template where a consumer owns the `hydrateRoot` call, so it
 * is the only one that can read React 19's hydration channel through the API
 * rather than through the global `reportError` React defaults to. A console spy
 * would see nothing here: React 19 routes mismatches to this callback, which is
 * how `hydration.contract` came back clean on markup that did not match.
 */
declare global {
  interface Window {
    __recoverable?: string[];
  }
}

hydrateRoot(document, <HydratedRouter />, {
  onRecoverableError(error) {
    (window.__recoverable ??= []).push(
      `onRecoverableError: ${error instanceof Error ? error.message : String(error)}`,
    );
  },
});
