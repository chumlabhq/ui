# Guide claims the gate cannot check

`scripts/assert-guide-claims.mjs` checks five kinds of claim on the seven guide
pages against a source in this repo: component names against the real exports,
`@chumlab/ui/*` subpaths against `package.json`, prop names against every
component's `types.ts`, the WCAG level against `ACCESSIBILITY.md`, and any
component count against the export list.

Everything below is a claim those pages make that has no such source. Each is
here with the reason it cannot be derived, so that the gate's silence on it is
a recorded decision rather than an oversight.

## Process claims

**"Not tested with a screen reader. No NVDA, JAWS or VoiceOver run has ever
been done."** (Accessibility)

A claim about what people did, not about what the code is. Its source is
`RELEASE-READINESS.md` §4, which is prose as well — gating one against the
other would only move the trust from one unchecked sentence to another. It is
worth noting that this claim replaced its opposite: the page previously
advertised "Manual screen-reader sweeps (VoiceOver, NVDA)", which had never
happened. Prose that flatters is exactly the prose no gate was watching.

## Description claims

**"feels like a soft material"**, **"the same exit transition"**,
**"measured-free"**-style characterisations. (Animation)

Adjectives. The numbers beside them are now the real ones and a reader can
check those; the feel of a curve is not a derivable fact.

**"Both menus behave identically; only their position in the DOM differs."**
(Styling) — a behavioural claim about a live demo. The demo is on the page and
`e2e/menu-focus.spec.ts` covers the focus half, but "identically" is broader
than any assertion made about it.

## Claims about things the package does not contain

**The `animate-cursor` keyframe.** (AI & LLMs)

The page now states that this class is the site's rather than the package's,
and pastes the keyframe so a reader can copy it. That correction is prose: a
gate could check that `animate-cursor` is absent from `dist/styles.css` — it
is — but not that the surrounding sentence describes the absence honestly.
This is the class of claim most worth re-reading by eye, because the page is
describing a gap rather than a feature, and a gap has nothing to assert
against.

## Counts that are not the component count

The count rule fires on `<number> … primitives|components`. Any other figure on
these pages — "three ways to override", "2px offset", token counts in the
Theming table — is unchecked. They were read by hand for this pass and were
correct; nothing keeps them that way.
