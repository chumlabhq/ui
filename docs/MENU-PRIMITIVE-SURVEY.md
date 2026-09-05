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

### 1. TimePicker's listbox ignores Space — **withdrawn, TimePicker is right**

Recorded here first and then measured. TimePicker's trigger is a text `<input>`,
not a button, and ARIA's editable combobox deliberately does not bind Space
because Space is a character — one the 12-hour format it displays contains.
Binding it would stop the user typing. `useMenuNavigation` takes
`commitOnSpace`, which is false here and true everywhere else, and that is the
real distinction: button triggers commit on Space, editable ones do not.

### 2. TimePicker does not skip disabled options — **withdrawn, nothing to skip**

Also withdrawn on measurement. `generateTimeOptions(format, step, minTime,
maxTime)` filters by the bounds, so the listbox contains only selectable times;
there is no disabled option in it to walk onto. The disabled items the
`open-bounded` fixture renders are ClockFace's dial numbers, which are a
different surface with its own keyboard model.

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


## Resolved

| # | Component | Resolution |
| --- | --- | --- |
| 1 | TimePicker | **Withdrawn.** Its trigger is editable; Space is a character. `commitOnSpace` names the distinction. |
| 2 | TimePicker | **Withdrawn.** Its listbox has no disabled options — the bounds filter them out of the list. |
| 3 | MultiSelectSearchableDropdown | Fixed. The `setTimeout(…, 10)` is an effect, as in SearchableDropdown. |
| 4 | CascadingDropdown, Pagination | Outstanding — both are in the next slice. |
| 5 | Type-ahead | Decided: all four comboboxes offer it. It belongs to the trigger; a search box owns typing only while it has focus. `typeaheadTimeout` added to the two multi-selects. |
| 6 | Pagination, Breadcrumb | Outstanding. `keepMounted` arrives free with `MenuSurface`; `lockScroll` and `data-open` do not. |
| 7 | DatePicker month/year | Outstanding — next slice. |

Three more differences surfaced while migrating, none of them in the original
table because none is visible in the source:

- **ArrowUp did not open a closed surface** on SearchableDropdown,
  MultiSelectDropdown or MultiSelectSearchableDropdown. All three guarded the
  branch on `isOpen` with no `else`. Dropdown has always opened, and ARIA's
  combobox pattern opens onto the last option.
- **SearchableDropdown's type-ahead could land on a disabled option.** Its own
  test said so in a comment. Dropdown's never could, and arrow navigation in the
  same component already skipped them.
- **Space on MultiSelectSearchableDropdown closed the menu without selecting.**
  The key was dropped whenever a search box existed, wherever focus was, so the
  browser activated the trigger button instead.


---

# Composition phase: outcome

## Where the twelve surfaces landed

Twelve, not ten: the survey counted ten before Pagination's and Breadcrumb's
menus were examined as surfaces in their own right, and before TimePicker's
clock face was separated from its listbox.

**Nine share the keyboard model** (`useMenuNavigation`): Dropdown,
SearchableDropdown, MultiSelectDropdown, MultiSelectSearchableDropdown,
CascadingDropdown's menu, CascadingDropdown's submenu, TimePicker's listbox,
Pagination, Breadcrumb, and DatePicker's month/year listbox.

**Three do not, and should not:**

| Surface | Why not |
| --- | --- |
| DatePicker's calendar grid | Navigates dates, not an index. Up/Down are ±7 days, Home/End are week bounds from `weekStartsOn`, PageUp/Down change month and replace the rendered set, Shift makes that a year. Nothing wraps; it pages. Fitting it would mean giving the primitive a column count, page handlers and item regeneration — carried by the nine that need none of it. |
| TimePicker's clock face | A radial dial. Two rings of numbers navigated by angle, with its own focus cycle. |
| Table's column-resize and row-reorder | Not menus at all: a separator and a drag handle, each with a keyboard alternative gated under 2.5.7. |

**CascadingDropdown carries no two-level model, and neither does the primitive.**
Its menu and its submenu are two independent `useMenuNavigation` instances plus
a router — which level a key belongs to, and the two keys that move between
them. The alternative was teaching the primitive about submenus, which the eight
surfaces without submenus would have paid for. Two lists is what the data
actually is.

**DatePicker's month/year listbox is correctly neither portalled nor anchored.**
It sits inside the calendar panel, which is already portalled and focus-trapped.
Portalling it would move it out of `cycleTabWithin`'s subtree and out of its own
click-outside check; anchoring is unnecessary because the panel is its
containing block. Its own source says as much at the Tab branch. Not an
oversight.

## Duplication, measured across the phase

| After | Positioning implementations | Files with hand-written arrow navigation | `case "Arrow…"`/Home/End branches | Portals | Hidden measuring frames |
| --- | --- | --- | --- | --- | --- |
| before the phase | 25 | 15 | 78 | 14 | 9 |
| `useAnchoredPosition` | 8 | 15 | 78 | 14 | 9 |
| the primitive + 1 migration | 8 | 14 | 74 | 14 | 9 |
| four more surfaces | 8 | 10 | 58 | 14 | 9 |
| focus fix + two surfaces | 8 | 8 | 50 | 12 | 0 |
| the hard surfaces | 8 | **6** | **42** | **11** | **0** |

The eight remaining `getBoundingClientRect` sites are two declared positioners —
DatePicker's marker tooltip and Table's column filter, both estimating rather
than measuring — plus Slider, Table, Tooltip and ClockFace, which measure for
reasons that have nothing to do with anchoring a menu. The six files still
writing arrow keys are the three surfaces above plus ResizablePanel, Slider and
Table, none of which is a menu.

The portal is the least converged piece: three components render through
`MenuSurface`, and six still render their own `createPortal` while sharing
`useAnchoredPosition` and `surfaceStyle`. That is a real remainder, not a
rounding error, and it is the obvious next thing.

## Two corrections to this survey

- **CascadingDropdown was never calling `.focus()` inline from its Escape
  handler.** Finding 4 named it on a pattern match; its restoration is an effect
  keyed on the open transition, which is the correct shape. Pagination was the
  only genuine inline caller, and it is fixed.
- **TimePicker's two findings were both withdrawn** on measurement, recorded
  above. Its trigger is an editable field, so Space is a character; and its
  listbox has no disabled options, because `minTime`/`maxTime` filter them out
  of the list rather than disabling them in it.
