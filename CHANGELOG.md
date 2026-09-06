# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) under the policy
in [VERSIONING.md](VERSIONING.md).

## [0.1.0] — unreleased

The first release. `@chumlab/ui` has never been published to npm, so there is nothing here
to upgrade from and no migration to perform.

Everything below is listed anyway. The package went through a long hardening pass before it
was published, and several defaults moved during it. If you have been building against a
branch or a local link, these are the changes that will reach you.

### Added

- 30 components, each with a subpath export (`@chumlab/ui/button`,
  `@chumlab/ui/date-picker`, …) alongside the root barrel. ESM and CJS, with declarations
  for both.
- `styles.css` — precompiled, no Tailwind required — and `tokens.css` for projects that
  would rather generate the utilities themselves. Import one or the other, never both.
- An `unstyled` prop and a `classes` map on every component, with `UNSTYLED_*_CLASSES` and
  `DEFAULT_*_CLASSES` exported from each subpath.
- `reduceMotion`, `keepMounted`, `asChild` and `portalContainer` where each applies.
- `.ai.md` knowledge files and `.schema.json` schemas per component, plus `llms.txt` and
  `llms-full.txt`.

### Changed

These are the behavioural changes a consumer would notice. Each was made deliberately;
none is a bug fix that happened to move behaviour.

- **CascadingDropdown's submenu is portalled and anchored, and `classes.subPositioner`
  changed meaning with it.** The submenu was a `position: absolute` child of the menu item
  it opens from, which made it the only floating surface in the package with no viewport
  clamp and no flip: at 1024px it opened 199px past the right edge, and at 320px it painted
  nothing at all. It now renders through the same anchored portal as every other surface.
  `subPositioner` is still the key for that element and still defaults to `z-[9999]`, but it
  is the portal root rather than an absolutely-positioned wrapper, so positioning utilities
  written on it (`left-full`, `top-0`, `absolute`) no longer have any effect — the
  coordinates are inline styles. `submenuPosition` picks the preferred side and the side
  actually used is published as `data-side`.
- **DatePicker's focused trigger draws the same border in both themes.** Dark used a
  different colour from light for the same state, so a trigger that read as focused on one
  theme read as merely hovered on the other.
- **Accordion's `flush` variant uses the same hover surface in both themes,** for the same
  reason.
- **Table's search box is one token on mobile and desktop.** The two breakpoints had
  drifted onto different background tokens, so the control changed colour when the viewport
  crossed `sm`.
- **ArrowUp opens a closed surface on SearchableDropdown, MultiSelectSearchableDropdown and
  TimePicker.** ArrowDown already did; these three ignored ArrowUp entirely. It now opens
  the surface and highlights the last option, matching the other six.
- **Space on the trigger commits the highlighted option.** ARIA treats Space as a selection
  key on a listbox or menu, and several surfaces ignored it. TimePicker opts out
  deliberately, because its trigger is itself a text input where Space has to stay a space.
  A search field inside a surface keeps its own key handling either way — this is the
  trigger only.
- **OtpInput filters typed characters against `pattern` by default.** `pattern` is
  form-validation metadata that browsers do not apply to typing, so a default OtpInput told
  the browser, the soft keyboard and the screen reader that it wanted digits and then
  accepted letters. `validate` is now derived from the same pattern when you do not supply
  one; an explicit `validate` still wins.
- **`reduceMotion={false}` animates even when the OS asks for reduced motion.** The prop
  used to be a floor that `prefers-reduced-motion` could override; it is now an explicit
  instruction in both directions. Omit the prop — the default — to keep following the OS.

### Removed

- Six sub-components are no longer exported from the package root:
  `DropdownShimmer`, `SearchableDropdownShimmer`, `MultiSelectDropdownShimmer`,
  `TableShimmer`, `OtpInputLabel` and `ClockFace`. Each is rendered by its parent and was
  never usable standalone; a shimmer that is reachable on its own — `AccordionShimmer`,
  `AvatarShimmer`, `CountryFlagShimmer` — is still exported. The corresponding `*Props`
  types remain exported, because they still appear in their parent's public types.

### Fixed

- Types resolve under `moduleResolution: node16` as well as `bundler`. The published
  declarations imported relative paths without file extensions, which node16 does not
  resolve, and `attw` reported 240 such imports.
- CommonJS consumers get CommonJS declarations. `"type": "module"` made every `.d.ts` an
  ES module while `require` resolved to `.cjs`, so the types described the wrong shape for
  all 32 entrypoints.
- Floating surfaces re-anchor when a web font finishes loading. Position is measured from
  the trigger's box when the surface opens, and a font that lands after that re-lays out the
  page around a trigger whose size has not changed — which a `ResizeObserver` cannot see. On
  a consumer's first paint, every dropdown, menu, calendar and tooltip could sit up to a
  couple of pixels beside its trigger until the next scroll or resize.
- Escape closes a Dropdown from anywhere inside it, not only from the trigger.
- Focus reaches the surface on open, on every open rather than the first.
