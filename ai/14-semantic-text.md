# 14 — Semantic Text Source

You are a PRINCIPAL AI ENGINEER preparing the semantic text source layer.

This step generates high-quality natural-language descriptions of every component that will later be fed to an embedding model. **You are not generating embedding vectors. You are generating the text that gets embedded.**

(In v4 this step was misleadingly named "embeddings" — clarified in v5.)

---

## INPUTS

- `/ai/component-index.json` (from step 13)
- Every `<Component>.ai.md`
- Every `<Component>.schema.json`

---

## OUTPUT LOCATION

`/ai/semantic-text.json`

---

## STRUCTURE (strict)

```json
{
  "package": "@chumlab/ui",
  "version": "<package.json version>",
  "generatedAt": "<ISO timestamp>",
  "components": [
    {
      "name": "Button",
      "text": "Button is a clickable React element that triggers actions like submitting a form, opening a modal, or navigating to a new view. It supports primary, secondary, and ghost variants in three sizes (sm, md, lg). Disabled, loading, and focus states render automatically. Activated by mouse click, Enter, or Space; fully keyboard accessible with visible focus ring. Available in light and dark themes via the global token system."
    }
  ]
}
```

---

## TEXT REQUIREMENTS (critical for retrieval quality)

Each component's `text` field must be a single coherent paragraph that includes:

1. **What it is** (one sentence definition)
2. **What it's for** (use cases)
3. **Key behaviors** (how it works)
4. **Variants and states** (visual options)
5. **Accessibility behavior** (keyboard, ARIA)
6. **Responsive and theme support** (one sentence each)

Length: 80–200 words per component. No bullet lists. No headings. Flowing prose, because that's what embedding models work best on.

---

## QUALITY RULES

- Every paragraph must be self-contained — readable without context from other components
- Use the component name multiple times so embeddings cluster well
- Mention concrete features (size variants, prop names) for retrieval accuracy
- Avoid marketing language ("amazing", "powerful", "easy to use")
- Avoid generic filler ("This component is useful for…")
- Use synonyms throughout — readers will search with varied vocabulary
- For composable components (like Accordion or Tabs), describe both parent and children

---

## EXAMPLE — GOOD

> Combobox is a searchable dropdown that lets users pick a value from a list while filtering by typing. It accepts an array of options with `value` and `label` fields and optionally a custom render function for each option. The component supports controlled and uncontrolled modes. Keyboard navigation includes ArrowDown and ArrowUp to move between options, Enter to select, Escape to close, and Home / End to jump to first or last. The combobox announces its expanded state and current selection to screen readers via aria-expanded and aria-activedescendant. Async loading is supported by passing a Promise-returning loader instead of a static array. Light and dark themes ship out of the box; the dropdown panel respects the global theme tokens for surface, border, and text.

## EXAMPLE — BAD

> Combobox is a powerful and amazing component that makes selecting things easy. Users will love it. Built with React.

---

## OUTPUT FORMAT

```
SEMANTIC TEXT SOURCE — <ISO date>

COMPONENTS COVERED: <count>/<total>
AVG WORDS PER ENTRY: <count>
TOTAL WORD COUNT: <count>

QUALITY CHECKS:
  - Every entry 80–200 words : <PASS | FAIL>
  - No marketing language     : <PASS | FAIL>
  - No bullet lists           : <PASS | FAIL>
  - All components covered    : <PASS | FAIL>
```

---

## STATE UPDATE

In `/ai/system-state.json`:

- Set `pipeline.currentStep = 14`
- `coverage.semanticText = (count complete / total) × 100`
- `validation.semanticText = "PASS"` if all entries valid

---

## ACCEPTANCE CRITERIA

- Output file exists at `/ai/semantic-text.json`
- Every component in the index has an entry
- Every entry is 80–200 words
- Entries are coherent prose, not bullet lists
- No marketing language or fake claims

PASS if all criteria met. FAIL otherwise.

---

## DOWNSTREAM USAGE

This file is consumed by an external embedding pipeline (typically OpenAI, Cohere, or local sentence-transformers) to produce `<Component> → vector` mappings. That step is OUTSIDE this pipeline. We only produce the text source here.
