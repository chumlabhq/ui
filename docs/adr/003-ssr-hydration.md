# ADR 003 — What "SSR safe" means, and how it is proved

**Date:** 2026-09-07 · **Status:** accepted · **Record:** `003-ssr-hydration.json`

## The claim that was not one

`ai/component-index.json` recorded `"ssr": "safe"` for all thirty components. Nothing
derived it. `ssr.contract` asks whether `renderToString` throws — a component that renders
nothing on a server does not throw — and `hydration.contract` hydrates under jsdom, where
`window` exists during the "server" render too, so a `typeof window` branch takes the same
path on both sides and the mismatch it exists to find cannot occur there.

The consumer matrix, which has a real Node server and a real browser, found five instances
of one defect on 2026-09-07:

| | |
|---|---|
| `ToastProvider` | `const portalTarget = isBrowser ? document.body : null` — failed on every page that mounted one |
| `Modal`, `Drawer` | `if (!isBrowser) return null` before a portal — failed as soon as either was open at first paint |
| `MenuSurface` | the same, for the nine components that portal through it — failed open, and failed closed with `keepMounted` |
| `Table` | `useState(() => isBrowser ? window.innerWidth : 1024)` — failed with `responsiveBreakpoint` and `renderMobileCard` set |
| `Accordion` | `useState(() => readFromStorage())` — failed once `storageKey` had a stored value |

All five produce the same thing: a first client render the server never sent. React reports
it as #418, whose own text names the cause before anything else — *"a server/client branch
`if (typeof window !== 'undefined')`"*.

`Tooltip` held a sixth, which reported nothing: the server shipped the tip **inline** inside
`<main>` and the client relocated it to a portal. React deletes an unmatched trailing node
without a recoverable error, so the divergence was real and silent.

## The decision

**SSR safe means the portal is absent from the server HTML and from the first client render,
and appears on a later render.** Safe-while-closed is not safe: a consumer opening a dialog
on page load is ordinary, and it was the case that failed.

One hook, `useHydrated()`, is the sanctioned way to ask:

```ts
useSyncExternalStore(subscribe, () => true, () => false)
```

The third argument is the point, and it is the same reason `useReducedMotion` is written this
way: it gives React a server snapshot, so hydration renders what the server rendered and
corrects afterwards. It costs a client-only application nothing — with no hydration React
reads `getSnapshot`, which is already `true` on the first render, so a Vite consumer renders
exactly what it rendered before. The e2e suite was unchanged by the fix for that reason:
438 passed before and after.

Where a value rather than a portal is at stake, the same rule applies by other means: `Table`
seeds its width with what a server assumes and measures in a layout effect; `Accordion` reads
storage in a layout effect rather than in a state initializer, with the write-back paused
until it has, so the default it is about to replace is not written over the stored value.

## Two gates, because one was not enough

**`ssr-branch.contract`** reads source. No component may ask `isBrowser`, `typeof window` or
`typeof document` while it renders — in an effect, a callback, a handler or a
`useSyncExternalStore` argument is fine; in a component body, a `useState` initializer or a
`useMemo` is the defect. It also follows one hop, because one of the five hid there:
Accordion's branch was in a `useCallback`, which is allowed, and the *call* was in an
initializer. The suite runs the five defects as they were written and requires each to be
caught.

**`assert-ssr-record.mjs`** ties the claim to a measurement. The matrix writes
`003-ssr-hydration.json` — every component, every route, three frameworks — and the gate
fails if `ai/component-index.json` says something the record does not, if a shipped component
has no evidence, or if the source has changed since the record was written. That last one is
the dist-record lesson from GATE-HONESTY 1.1: numbers outlive the artifact they measured
unless something ties them to it.
