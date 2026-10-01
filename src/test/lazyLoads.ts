/**
 * Every lazy load a component has started and not yet finished, for the
 * contract tier.
 *
 * `./setup.contracts.ts` mocks `useLazyComponent` so that each `load`
 * it is handed goes through `trackLoad`, and `applyAct` waits on `settled`. The
 * wait is on the component's own promise — the one its effect is waiting on —
 * not on the module behind it: a load is free to do more than import, and the
 * module resolving first is not the load finishing. Waiting on the module was
 * the 2h wait, and an injected 200 ms delay on the four loads failed the
 * clock-face rows in two contracts while it was in place.
 *
 * Test code only. Nothing here or in the mock is reachable from `src/` outside
 * `__tests__` and `test/`, so none of it can reach `dist/`.
 */

const pending = new Set<Promise<unknown>>();

/**
 * A delay injected in front of every load, for the self-check that proves the
 * wait. `CHUMLAB_LAZY_DELAY_MS` sets it for a whole run; `setLazyDelay` for one
 * test.
 */
let delayMs = Number(process.env.CHUMLAB_LAZY_DELAY_MS ?? 0);

export const setLazyDelay = (ms: number) => {
  delayMs = ms;
};

/**
 * The same wrapped function for the same `load`, every time: `useLazyComponent`
 * caches by function identity, and a fresh wrapper per render would miss the
 * cache and re-enter its effect forever.
 */
const wrapped = new WeakMap<() => Promise<unknown>, () => Promise<unknown>>();

export function trackLoad<T>(load: () => Promise<T>): () => Promise<T> {
  let tracked = wrapped.get(load) as (() => Promise<T>) | undefined;
  if (!tracked) {
    tracked = () => {
      const delay = delayMs;
      const promise = (delay > 0 ? new Promise((resolve) => setTimeout(resolve, delay)).then(load) : load()) as Promise<T>;
      pending.add(promise);
      void promise.finally(() => pending.delete(promise)).catch(() => {});
      return promise;
    };
    wrapped.set(load, tracked);
  }
  return tracked;
}

export const pendingLoads = () => pending.size;

/**
 * Until no load is in flight: each round waits for the ones pending, then
 * `flush` lets the component render what arrived — which can start another.
 */
export async function loadsSettled(flush: () => Promise<void>): Promise<void> {
  while (pending.size > 0) {
    await Promise.allSettled([...pending]);
    await flush();
  }
}
