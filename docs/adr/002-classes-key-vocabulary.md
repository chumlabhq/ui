# ADR 002 — `classes` key vocabulary

**Status:** Accepted
**Date:** 2026-09-01
**Supersedes:** nothing
**Related:** ADR 001 (unstyled contract), AUDIT-GAP §4.5, GATE-HONESTY §3

## Context

`classes` is the library's primary styling escape hatch and its largest public API surface — 495 documented keys across 30 components, with a further ~125 candidate keys blocked behind this decision (`constants.contract` baseline; `Table.tsx` alone accounts for 42).

That surface emerged rather than being designed. AUDIT-GAP §4.5 found five different names for the same slot. GATE-HONESTY §3 found 377 of 495 keys never render under any test and 213 are never named anywhere in the repo, which means a meaningful fraction of the surface may be dead and nobody can currently tell which.

Three facts make this the moment to fix it:

1. The package is unpublished. Renaming and deleting keys is free today and a major version bump forever after.
2. Phase 2.5 introduces render fixtures, which for the first time make "is this key real?" a decidable question.
3. `llms-full.txt` and the `*.ai.md` files feed the AI Playground's codegen. An inconsistent vocabulary is not just awkward for humans — it is training pressure toward wrong output, at scale, in the product built on top of this one.

## Decision

### R1 — Anatomy is the contract

Each component declares a part anatomy tree in its `.ai.md`. A `classes` key exists **if and only if** it names a part in that anatomy. No key without an anatomy entry, no anatomy entry without a key. The anatomy is generated into `component-index.json` and is the input to every contract test.

### R2 — Closed part vocabulary

Part names are drawn from the fixed list below. The same DOM role gets the same name in every component. Adding a name to this list is an ADR amendment, not a component-level choice.

| Part | Meaning |
| --- | --- |
| `root` | outermost element the component renders |
| `trigger` | the control that opens, toggles, or activates |
| `value` | rendered current selection inside a trigger |
| `placeholder` | shown in place of `value` when empty |
| `icon` | indicator or decorative icon inside a trigger |
| `portal` | portal container element |
| `overlay` | backdrop behind floating content |
| `content` | the floating, expanding, or panel surface |
| `viewport` | scrollable region inside `content` |
| `header`, `body`, `footer` | sections of `content` |
| `title`, `description` | labelled/described-by text inside `content` |
| `closeButton` | dismissal control |
| `list` | collection container (`role="listbox"`, `"menu"`, `"grid"`) |
| `item` | a member of `list` |
| `itemText`, `itemIcon`, `itemIndicator` | parts within `item` |
| `group`, `groupLabel` | grouping within `list` |
| `separator` | visual or semantic divider |
| `input`, `searchInput` | text entry |
| `clearButton` | clears the current value |
| `arrow` | pointer/caret on floating content |
| `empty` | empty-state element |
| `loading` | skeleton or spinner element |
| `label`, `helperText`, `errorText` | form furniture around a control |
| `chip`, `chipLabel`, `chipRemove` | multi-value tokens |

### R3 — Qualifier first, head noun last, camelCase

`itemText`, never `textItem`. `searchInput`, never `inputSearch`. No abbreviations, no shortening (`btn`, `desc`, `ctn` are all rejected).

### R4 — No state in key names

This is the rule that stops the surface exploding. State is **not** a key. It is a data attribute on the part, and consumers target it with Tailwind v4 variants against a single key.

Emitted attributes, on every part where the state is meaningful:

- `data-state` — `open` | `closed` | `checked` | `unchecked` | `indeterminate` | `active` | `inactive`
- `data-disabled`, `data-highlighted`, `data-selected`, `data-invalid`, `data-loading`, `data-readonly`
- `data-orientation` — `horizontal` | `vertical`
- `data-side`, `data-align` — for positioned content

Consumer usage:

```tsx
<Dropdown classes={{ item: "px-3 data-[highlighted]:bg-blue-50 data-[disabled]:opacity-40" }} />
```

Any existing key whose name encodes a state (`itemSelected`, `triggerDisabled`, `optionHighlighted`, and every sibling of that shape) is deleted and replaced by the attribute. This matches Radix, Ark, and Base UI, which is both the ecosystem convention and the idiom that codegen models already emit.

### R5 — No key for untargetable elements

A pure layout wrapper with no semantic role earns a part name only if it carries structural classes a consumer would plausibly need to change. Otherwise it is absorbed into its parent part and gets no key. "It exists in the DOM" is not sufficient grounds for a key.

### R6 — Nested components nest their classes

When a component renders another library component, the child is exposed under a key whose **value is the child's own `classes` object**, not a string:

```tsx
<InternationalPhoneInput classes={{ root: "...", flag: { root: "border-0" } }} />
```

The child's vocabulary is reused verbatim; no prefixed flat names are invented. `unstyled` propagates down the same path. This is the structural fix for GATE-HONESTY §4 — six of seven nesting sites currently forward neither.

### R7 — Deletion policy

Before 1.0: keys are renamed and deleted freely, with no deprecation cycle. Every key not present in an anatomy at 1.0 is **deleted, not deprecated**.

After 1.0: removing or renaming a key is a major. Adding one is a minor. Changing which element a key applies to is a major.

### R8 — A key ships only if a fixture renders it

Per phase 2.5, `fixtures.contract` must render every key in every anatomy at least once. A key that cannot be rendered by any prop combination is dead by definition and is removed under R7.

## Consequences

**Accepted costs.** Every component, every constants file, every test naming a key, all 30 `*.ai.md`, `llms-full.txt`, `component-index.json`, and the AI Playground's codegen prompts and vendored bundle change in one sweep. Partial adoption is worse than none: a half-renamed vocabulary is exactly the state this ADR exists to end.

**R4 is a behaviour addition, not just a rename.** Emitting `data-*` state attributes on parts that don't currently carry them is new public surface with its own test obligations, and it must land in the same change as the key deletions it justifies.

**The playground must be regenerated in lockstep.** It generates against the old names. If the rename ships and the prompts don't, the codegen product emits keys that no longer exist — silently, since unknown keys in a `classes` object are ignored.

**Downstream: `unstyled` propagation gets a home.** R6 means propagation is a property of the key shape rather than a per-component patch, so the six known nesting bugs and every future one are covered by one contract test.

## Alternatives rejected

**Flat prefixed keys for nested components** (`tooltipRoot`, `tooltipArrow`). Rejected: mints a parallel vocabulary per parent, scales quadratically, and gives `unstyled` propagation nowhere to live.

**Keep state-variant keys.** Rejected: it is the direct cause of the surface size, it cannot express combined states (highlighted *and* disabled), and it diverges from every peer library.

**Deprecate rather than delete.** Rejected: the package is unpublished. There are no consumers to protect and a deprecation layer shipped at 1.0 would be permanent debt incurred voluntarily.
