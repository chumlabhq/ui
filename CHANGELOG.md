# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-03

### Added
- Initial release with 32 components
- Form Inputs: Input, TextArea, OtpInput, Slider, DatePicker, TimePicker, InternationalPhoneInput, Switch
- Selection: Dropdown, SearchableDropdown, MultiSelectDropdown, MultiSelectSearchableDropdown, CascadingDropdown, Checkbox, RadioButton, Toggle
- Navigation: TabPanel, Breadcrumb, Pagination, Stepper
- Overlay: Modal, Drawer, Tooltip, Toast
- Display: Avatar, CountryFlag, Loader (Circular, Linear, Dot, Pulse), Table, Accordion
- Layout: ResizablePanel
- Shared utilities: cn, Slot, mergeRefs, useControllableState, useReducedMotion
- Full TypeScript support with strict mode
- WCAG 2.1 AA accessibility compliance
- Tailwind CSS v4 styling with class override system
- Unstyled mode for all components
- SSR compatibility
- Tree-shakable named exports
- Unit tests (Vitest) and E2E tests (Playwright)

### Fixed
- SSR safety: Added `isBrowser` guards to `scrollLock.ts` and `Modal.tsx` portal
- Accessibility: Fixed `aria-modal` on TimePicker clock dialog
- Accessibility: Added explicit `aria-live` to Toast component
