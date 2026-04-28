# 11 — README

You are a PRINCIPAL OPEN SOURCE ENGINEER and TECHNICAL WRITER.

This step generates the top-level `README.md` — the file every visitor sees on GitHub and npm. It has 30 seconds to convert a visitor into a user.

---

## INPUTS

- Entire repository
- `/ai/system-state.json`
- `/ai/component-index.json` (from step 13 — for the components list; if not yet generated, list components from `system-state.components`)
- `package.json`

---

## OBJECTIVE

A README that:

- Converts visitors → users in under 30 seconds
- Ranks well on GitHub search and Google
- Is parseable by AI / LLMs (clear structure, semantic headings)
- Is beginner-friendly and copy-paste usable
- Communicates differentiation clearly

---

## STRICT STRUCTURE

```markdown
# Chumlab UI

A free, open source React component library with 30+ accessible primitives, an AI playground that ships React from prompts, and one token system for any brand.

[![npm](https://img.shields.io/npm/v/@chumlab/ui)](https://www.npmjs.com/package/@chumlab/ui)
[![License](https://img.shields.io/npm/l/@chumlab/ui)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/chumlab/ui)](https://github.com/chumlab/ui)

[Documentation](https://chumlab.com) · [Components](https://chumlab.com/components) · [AI Playground](https://chumlab.com/playground)

---

## 30-second example

```bash
npm i @chumlab/ui
```

```tsx
import { Button, Input } from "@chumlab/ui";

export default function App() {
  return (
    <div>
      <Input label="Email" placeholder="you@chumlab.com" />
      <Button>Subscribe</Button>
    </div>
  );
}
```

That's it. No providers to wire, no global CSS to import, no theme setup.

---

## What you get

- 30+ React components, all accessible (WCAG 2.1 AA)
- AI playground that generates working React from prompts or screenshots
- One token system controls all components
- Tree-shakable, zero runtime dependencies
- ~4.2kb gzipped per component
- First-class TypeScript types
- SSR-safe (Next.js, Remix, Vite)
- MIT licensed

---

## Why Chumlab

| | The typical setup | Chumlab |
| --- | --- | --- |
| Setup time | 1–3 weeks | Under a minute |
| Dependencies | 6+ libraries | 1 package |
| Theming | CSS overrides per project | One token system |
| Accessibility | DIY audits | Built in |
| Bundle size | ~80–150kb | ~4.2kb per import |

---

## Components

Forms, navigation, overlays, data display — all 30+ primitives listed at [chumlab.com/components](https://chumlab.com/components).

---

## Documentation

- [Getting started](https://chumlab.com/docs)
- [Components](https://chumlab.com/components)
- [AI Playground](https://chumlab.com/playground)
- [Theming guide](https://chumlab.com/docs/theming)
- [FAQ](https://chumlab.com/faq)

---

## Contributing

Issues and PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT © Chumlab. See [LICENSE](./LICENSE).
```

---

## CONTENT RULES

- Every section is short. README is for orientation, not deep docs.
- Code blocks must be valid and copy-paste ready.
- No internal architecture details (`.ai.md`, `.schema.json`, embeddings, AI pipeline)
- No emojis in section headings (they hurt machine parsing)
- Badges only for: npm version, license, stars
- Keep total length under 200 lines

---

## OUTPUT FORMAT

```
README — <ISO date>

LENGTH: <line count>
SECTIONS: <count>
CODE BLOCKS: <count> (all validated)
EXTERNAL LINKS: <count> (all reachable)
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 11`
- `validation.readme = "PASS"`

---

## ACCEPTANCE CRITERIA

- README follows the structure above (sections may be expanded but not removed)
- All code blocks are syntactically valid TypeScript / Bash
- All links resolve (no 404s)
- File length ≤ 200 lines
- No internal AI infrastructure references

PASS if all criteria met. FAIL otherwise.
