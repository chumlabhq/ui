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

**`useHydrated` alone did not close that one, measured rather than assumed.** With the hook
in place the server still shipped the tip inline — `portal && portalTarget` fell back to
rendering inline whenever the target was not there yet — and the prerendered
`Tooltip__portal.html` still carried `role="tooltip"` inside `<main>`, with the tip in
`document.body` after hydration. What closed it was rendering **nothing** when a portal was
asked for and the target does not exist yet: the prerendered HTML now contains no tooltip at
all (0 occurrences), and the tip appears in the portal on the render after hydration. Two
trees that agree, and the surface arriving later, which is the rule below.

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

## The channel that cannot see this, and what replaced it

A hydration error is only reported when the server's markup and the FIRST client render
disagree. Everything after that is invisible to it: if both agree and an effect then moves a
subtree, React deletes and re-inserts without a word. That is not a Tooltip bug, it is a
blind spot with a shape — and it will happen again, so the matrix now compares the two trees
directly.

`compareTrees` in `verify-consumer-runtime.mjs` fetches the server's HTML for every route,
takes every landmark it rendered — an id, a role, or a tag that means something on its own —
and looks for each one in the DOM once it has settled. **Additions are fine**: a portal
appearing after hydration is exactly what this ADR asks for. A landmark that VANISHED or
MOVED is the fault. Classes and state attributes are deliberately not part of a landmark's
identity, because those are supposed to change.

It carries its own control, like the canary: `__mover` renders a node inline, hydrates
identically, and relocates it to a portal in an effect. Every pass must fault it, and every
pass records that React reported **0** recoverable errors for it — which is the whole
argument for the check existing. One route is declared as a legitimate replacement:
`Table__responsive`, where the server renders cards for a viewport it cannot measure and the
client renders the table. That is a correction, and it is indistinguishable from a defect
without a reason written down.

Current reading: **166 server landmarks across 38 routes, 0 moved or vanished**, in all three
server-rendered templates.

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
