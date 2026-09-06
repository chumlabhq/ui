import { useSyncExternalStore } from "react";

/** Nothing changes, so the subscription is a no-op that never fires. */
const subscribe = (): (() => void) => () => {};

/**
 * False while a server renders and while the client hydrates; true from the
 * render after, and true immediately when there is no hydration at all.
 *
 * This is what makes a portal SSR-safe. A portal target decided during render —
 * `isBrowser ? document.body : null` — puts a subtree into the first client
 * render that the server never sent, and React reports the difference as a
 * hydration mismatch. React's own #418 text names the cause first: "a
 * server/client branch `if (typeof window !== 'undefined')`". Deferring by one
 * render makes the two trees identical and lets the portal appear afterwards.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`, for the reason
 * `useReducedMotion` uses it: the third argument is a server snapshot, so React
 * hydrates what the server rendered rather than correcting it afterwards. It
 * also costs a client-only application nothing — with no hydration React reads
 * `getSnapshot`, which is already true on the first render, so a Vite consumer
 * renders exactly what it rendered before.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
