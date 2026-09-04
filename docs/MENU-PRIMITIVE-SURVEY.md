# The dropdown family, compared

Design input for the menu primitive. Every row was read from source, not from the
component's own documentation.

The family is the nine components that own a trigger plus a floating option
surface, and DatePicker's inline month/year `listbox` — ten surfaces in all.
DatePicker appears twice because its two menus share nothing but the component
they live in.

## The dimensions

| | Dropdown | SearchableDropdown | MultiSelectDropdown | MultiSelectSearchable | CascadingDropdown | TimePicker | DatePicker (calendar) | DatePicker (month/year) | Pagination | Breadcrumb |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Open state** | `useControllableState` | `useControllableState` | `useControllableState` | `useControllableState` | `useControllableState` | `useControllableState` | `useControllableState` | local `useState` | `useControllableState` | local `useState` |
| **Surface role** | `listbox` | `listbox` | `listbox` | `listbox` | `menu` | `listbox` | `grid` | `listbox` | `listbox` | `menu` |
| **Focus model** | active-descendant | active-descendant | active-descendant | active-descendant | active-descendant | active-descendant | roving DOM focus | roving DOM focus | active-descendant | roving DOM focus |
| **Focus on open** | stays on trigger | search input (effect) | stays on trigger | search input (`setTimeout` 10ms) | menu search input | hour input | roving cell or panel | — | the list container | first enabled item |
| **Focus on close** | `shouldRestoreFocusRef` | `shouldRestoreFocusRef` | `shouldRestoreFocusRef` | `shouldRestoreFocusRef` | `triggerRef.focus()` | input focus | — | — | `triggerRef.focus()` | `ellipsisButtonRef.focus()` |
| **Wrap at ends** | yes | yes | yes | yes | yes | yes | yes | yes | yes | yes |
| **Skips disabled** | yes | yes | yes | yes | yes | **no** | yes | yes | n/a (none exist) | yes |
| **Space selects** | yes | yes | yes | yes | yes | **no** | yes | yes | yes | yes |
| **Type-ahead** | yes | yes | **no** | **no** | no | no | no | no | no | no |
| **Positioning** | `useAnchoredPosition` | `useAnchoredPosition` | `useAnchoredPosition` | `useAnchoredPosition` | `useAnchoredPosition` | `useAnchoredPosition` | `useAnchoredPosition` | inline, unpositioned | `useAnchoredPosition` | `useAnchoredPosition` |
| **Dismiss** | `mousedown` + blur | `mousedown` + blur | `mousedown` + blur | `mousedown` + blur | `mousedown` + blur | `mousedown` + `pointerdown` + blur | `mousedown` | — | `mousedown` + blur | `mousedown` |
| **`keepMounted`** | yes | yes | yes | yes | yes | yes | yes | — | **no** | **no** |
| **`lockScroll`** | yes | yes | yes | yes | yes | yes | yes | — | **no** | **no** |
| **Commit closes** | always | always | never (multi) | never (multi) | `closeOnSelect` prop | always | always | always | always | always |
| **Loading vocabulary** | full | full | full | full | full | `loading` only | `loading` only | — | none | none |
| **`data-open` on trigger** | yes | yes | yes | yes | yes | yes | yes | — | **no** | **no** |

## Where they disagree, and which is right

### 1. TimePicker's listbox ignores Space — **TimePicker is wrong**

Every other surface treats Space as select. TimePicker handles `Enter` and not
`" "`. Its options are a `listbox`, and ARIA's listbox pattern names Space as a
selection key; a keyboard user who has learned the rest of the library finds one
menu that does not answer. Fix: TimePicker.

### 2. TimePicker does not skip disabled options — **TimePicker is wrong**

Arrowing walks onto options that cannot be chosen. Every other surface with
disabled items scans past them and wraps. TimePicker's disabled items are real,
not hypothetical: `minTime`/`maxTime` disable everything outside the range, and
the `open-bounded` fixture exists precisely to render them. Fix: TimePicker.

### 3. MultiSelectSearchableDropdown focuses its search with `setTimeout(…, 10)` — **SearchableDropdown is right**

Its sibling focuses from an effect keyed on `[isOpen, showSearch]`. Ten
milliseconds is a guess at how long the portal takes to paint; on a slow frame it
fires before the input exists and the focus is silently lost. Same intent, one
mechanism that can fail. Fix: MultiSelectSearchableDropdown.

### 4. Focus restoration is done three ways — **`shouldRestoreFocusRef` is right**

Four components set a flag and restore on the next commit; two call
`triggerRef.current?.focus()` inline from the Escape handler. The inline call
runs before React has removed the surface, so the browser can move focus again
during the same tick — the flag exists because that was observed. The two
inline callers are CascadingDropdown and Pagination.

### 5. Type-ahead exists on two of the four comboboxes — **undecided, and that is the finding**

Dropdown and SearchableDropdown implement it and expose `typeaheadTimeout`. The
two multi-select siblings implement neither and expose neither, so nothing is
falsely advertised — but nothing records why a user can type-to-jump in one
list and not in the visually identical one beside it. The primitive makes it a
capability the caller opts into, so the answer stops being an accident of which
file someone edited.

### 6. Pagination and Breadcrumb are a tier below on the portal contract

No `keepMounted`, no `lockScroll`, no `data-open`. Adding those is a public API
change, so it is **not** part of this slice — recorded here so the next slice
decides deliberately rather than acquiring them by extraction.

### 7. DatePicker's month/year listbox is unpositioned and locally stated

The only surface that is neither portalled nor anchored, with its own
`useState` and its own `handleListKeyDown`. It is in the family by behaviour and
outside it by construction, and it is the one place where "migrate onto the
primitive" would change where the element renders.

## What the primitive takes from this

The keyboard model is the majority behaviour, which is also the correct one on
every point where the family splits: wrap at the ends, skip disabled, Enter and
Space both select, Home/End to the first and last enabled item, Escape closes and
restores focus through a flag, Tab closes without committing. Type-ahead is
opt-in. Positioning is `useAnchoredPosition`, already shared.

Two behaviours are deliberately **not** unified here because they are real
product differences rather than drift: whether committing closes the surface
(single-select does, multi-select does not), and whether focus moves into the
surface on open (a search input takes focus; a plain listbox does not).
