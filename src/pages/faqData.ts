/**
 * FAQ content for the /faq page. Answers are written as direct, quotable
 * prose — the same copy is emitted as Schema.org `FAQPage` JSON-LD so search
 * engines and AI answer engines (Google, Bing, ChatGPT, Perplexity, Gemini)
 * can cite them verbatim.
 *
 * Rules for editing:
 *   • Keep answers 2–4 sentences, factual, no marketing filler.
 *   • Lead with the direct answer, then context.
 *   • Reference concrete APIs and version numbers so answers stay quotable.
 *   • No references to waitlists, previews, or beta gating.
 */

export type FaqCategory =
  | "Getting Started"
  | "Components"
  | "Theming"
  | "Forms"
  | "Accessibility"
  | "Technical"
  | "Testing"
  | "Migration"
  | "Licensing";

export interface FaqEntry {
  question: string;
  answer: string;
  category: FaqCategory;
}

/**
 * Stable anchor id for a question. Used as the `id` on the AccordionItem
 * so `/faq#how-do-i-install-chumlab-ui` deep-links to the correct row.
 */
export function faqAnchor(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  "Getting Started",
  "Components",
  "Theming",
  "Forms",
  "Accessibility",
  "Technical",
  "Testing",
  "Migration",
  "Licensing",
];

export const FAQ_DATA: FaqEntry[] = [
  {
    category: "Getting Started",
    question: "What is Chumlab UI?",
    answer:
      "Chumlab UI is an open-source, production-grade React component library with accessible, themeable primitives built on TypeScript and Tailwind CSS v4. It ships 30 components — Button, Input, DatePicker, Modal, Table, and more — each keyboard-operable, built to a WCAG 2.2 AA target, and styled through className, a per-slot classes prop, design tokens or unstyled mode.",
  },
  {
    category: "Getting Started",
    question: "How do I install Chumlab UI?",
    answer:
      "Install with your package manager of choice: `npm install @chumlab/ui`, `pnpm add @chumlab/ui`, `yarn add @chumlab/ui`, or `bun add @chumlab/ui`. Chumlab UI requires React 18 or 19. Import the stylesheet once (`import '@chumlab/ui/styles.css'`), then import each component from its own subpath: `import { Button } from '@chumlab/ui/button'`.",
  },
  {
    category: "Getting Started",
    question: "What are the peer dependencies?",
    answer:
      "React and React DOM, 18 or 19. Two more are optional peers, needed only by the component that uses them: `@tanstack/react-table` for Table and `date-fns` for DatePicker. The runtime dependencies are `clsx`, `tailwind-merge` and `libphonenumber-js` (for InternationalPhoneInput); there is no CSS-in-JS library, icon bundle or animation framework.",
  },
  {
    category: "Getting Started",
    question: "Does Chumlab UI work with Next.js?",
    answer:
      "Yes. Chumlab UI supports Next.js 13+ including the App Router, Server Components, and Pages Router. Interactive components include the 'use client' directive internally, so you can import them directly from Server Components without manual annotations. There are no hydration mismatches.",
  },
  {
    category: "Getting Started",
    question: "Does Chumlab UI work with Vite, CRA, Remix, and Astro?",
    answer:
      "Yes. Chumlab UI is framework-agnostic and works with any React setup: Vite, Create React App, Remix, Astro, Gatsby, and RedwoodJS. The only hard requirement is React 18 or 19; Tailwind is optional, because the stylesheet ships precompiled.",
  },
  {
    category: "Getting Started",
    question: "What Tailwind CSS version is required?",
    answer:
      "None. `@chumlab/ui/styles.css` is precompiled, so a project without Tailwind works. If your project already runs Tailwind v4, you can import `@chumlab/ui/tokens.css` instead and let your build generate the utilities; Tailwind v3 is not supported for that route.",
  },
  {
    category: "Getting Started",
    question: "How do I set up Tailwind CSS v4 for Chumlab UI?",
    answer:
      'Only if you want Tailwind to generate the library\'s utilities instead of importing the precompiled stylesheet. In your main CSS file: `@import "tailwindcss"; @import "@chumlab/ui/tokens.css"; @source "../node_modules/@chumlab/ui/dist";` — and import styles.css or tokens.css, never both.',
  },

  {
    category: "Components",
    question: "How many components does Chumlab UI include?",
    answer:
      "Chumlab UI ships 30 components covering forms, selection, navigation, overlays, data display, and layout: Accordion, Avatar, Breadcrumb, Button, CascadingDropdown, Checkbox, CountryFlag, DatePicker, Drawer, Dropdown, Input, InternationalPhoneInput, Loader, Modal, MultiSelectDropdown, MultiSelectSearchableDropdown, OtpInput, Pagination, RadioButton, ResizablePanel, SearchableDropdown, Slider, Stepper, Switch, TabPanel, Table, TextArea, TimePicker, Toast, and Tooltip.",
  },
  {
    category: "Components",
    question: "What form components are included?",
    answer:
      "Input, TextArea, Checkbox, Switch, RadioButton, Slider, DatePicker, TimePicker, OTPInput, InternationalPhoneInput, Dropdown, SearchableDropdown, and MultiSelectDropdown. Every form component supports controlled and uncontrolled modes, error states, and integrates with React Hook Form, Formik, and Zod out of the box.",
  },
  {
    category: "Components",
    question: "Does Chumlab UI have a data Table component?",
    answer:
      "Yes. The Table component supports column sorting, pagination, row selection, column pinning, column resizing, and infinite scroll. It handles large datasets with virtualised rendering and works with both client-side and server-side data sources.",
  },
  {
    category: "Components",
    question:
      "Can I use individual components without importing the whole library?",
    answer:
      "Yes. Chumlab UI ships per-component subpath exports and side-effect-free ES modules, so bundlers like Vite, webpack, Rollup, and esbuild tree-shake unused components automatically. A single `Button` import adds roughly 2 KB gzipped to your bundle.",
  },
  {
    category: "Components",
    question: "How do I use the Accordion component?",
    answer:
      'Compose `Accordion` > `AccordionItem` > `AccordionTrigger` + `AccordionContent`. Set `selectionMode="single"` for one-at-a-time expansion or `selectionMode="multiple"` to allow many open at once. Pass `collapsible` to let a single-type accordion close its active panel. Variants (`bordered`, `ghost`, `filled`) and size props control appearance.',
  },
  {
    category: "Components",
    question: "Does Chumlab UI include a DatePicker and TimePicker?",
    answer:
      "Yes. DatePicker supports single-date, range, and multi-select modes with a keyboard-accessible calendar grid, presets, and locale-aware formatting. TimePicker supports 12/24-hour clocks and minute steps, and composes with DatePicker for combined date + time selection.",
  },
  {
    category: "Components",
    question: "Does Chumlab UI include an autocomplete or combobox?",
    answer:
      "Yes. SearchableDropdown is a single-select combobox with typeahead search and keyboard navigation. MultiSelectSearchableDropdown adds chip-style multi-value selection. Both support async data fetching, loading states, empty states, and custom item renderers.",
  },
  {
    category: "Components",
    question: "Can I compose compound components with custom children?",
    answer:
      "Yes. Compound components (Accordion, Modal, Dropdown, TabPanel) use explicit sub-components and React context, so you can interleave arbitrary children, swap triggers via the `asChild` slot pattern, and project custom content without fighting the API.",
  },

  {
    category: "Theming",
    question: "How do I customise component styles?",
    answer:
      "Every component accepts `className` on its root and a `classes` prop — an object mapping its slots (root, trigger, content, icon, and so on) to class strings, which compose with the slot's defaults. For global changes, override the `--cl-*` design tokens in `:root`. For zero defaults, pass `unstyled` and build from scratch.",
  },
  {
    category: "Theming",
    question: "What is the classes prop?",
    answer:
      'The `classes` prop is an object that targets every internal element of a compound component by name. For example `<Accordion classes={{ root: "...", trigger: "...", content: "..." }} />` adds classes to any slot. They compose with the slot\'s defaults, and where one of yours conflicts with a default utility, yours wins — no specificity wars and no `!important`.',
  },
  {
    category: "Theming",
    question: "What does unstyled mode do?",
    answer:
      "Passing `unstyled={true}` strips all default Tailwind classes from a component while leaving behaviour intact (ARIA, keyboard handling, focus management, portal logic). Use it when you want to layer your own design system on top of Chumlab UI's behavioural primitives.",
  },
  {
    category: "Theming",
    question: "Can I use my own design tokens?",
    answer:
      "Yes. Components paint from `--cl-*` CSS custom properties for colours, radii and shadows. Override them in `:root` (for example `:root { --cl-accent: #7c3aed; }`) and every component picks them up — change a token once and the entire library updates.",
  },
  {
    category: "Theming",
    question: "How do I enable dark mode?",
    answer:
      "Dark is the default. To switch to light, set `class='light'` or `data-theme='light'` on `<html>`; `class='dark'` and `data-theme='dark'` are accepted too. The design tokens and the components' own `dark:` styles follow the same switch, with no provider.",
  },
  {
    category: "Theming",
    question: "How do I override the primary brand colour globally?",
    answer:
      "Override `--cl-accent` (and, if you need them, `--cl-accent-hover`, `--cl-accent-bg` and `--cl-on-accent`) in `:root`. Each token has a light and a dark value; components adopt the change at runtime without a rebuild.",
  },
  {
    category: "Theming",
    question: "Can I bring my own icon set?",
    answer:
      "Yes. Components that render icons (Dropdown chevrons, Modal close buttons, Accordion triggers, and similar) expose icon slots via props like `expandedIcon`, `collapsedIcon`, and `closeIcon`. Pass any React node — Lucide, Heroicons, Phosphor, inline SVG — and Chumlab UI uses it.",
  },
  {
    category: "Theming",
    question: "Can I use CSS variables for runtime theming?",
    answer:
      "Yes. Because Chumlab UI references CSS variables rather than hard-coded colours, you can change tokens at runtime (per page, per tenant, per theme) by updating variables on any parent element. Theme switches are instant and cacheable at the CDN.",
  },

  {
    category: "Forms",
    question: "Does Chumlab UI work with React Hook Form?",
    answer:
      "Yes. Form components expose the standard `ref`, `name`, `value`, `onChange`, and `onBlur` signature expected by React Hook Form's `register()` and `Controller`. Integration is documented per component with copy-pasteable examples.",
  },
  {
    category: "Forms",
    question: "Does it work with Formik or Zod?",
    answer:
      "Yes. Formik integrates via `<Field>` render props or direct value/onChange bindings. Zod is schema-only and pairs with any form library — pipe Zod's `parse` output into a form library's submit handler for end-to-end type-safe validation.",
  },
  {
    category: "Forms",
    question: "Can I use controlled and uncontrolled modes?",
    answer:
      "Yes. Every stateful component supports both. Pass `value` + `onChange` for a controlled component, or `defaultValue` alone for uncontrolled usage with no external state. The API mirrors React's standard form-element contract so migration from native inputs is one-for-one.",
  },
  {
    category: "Forms",
    question: "How do I show error states on inputs?",
    answer:
      "Pass an `error` prop (boolean or string) on form components. Setting it toggles error styling, sets `aria-invalid=\"true\"`, and — when you pass an error message string — wires `aria-describedby` to the rendered error text automatically.",
  },
  {
    category: "Forms",
    question: "Does Chumlab UI set aria-invalid and aria-describedby automatically?",
    answer:
      'Yes. Passing `error` sets `aria-invalid="true"` on the input; passing `errorMessage` links the message with `aria-describedby` for screen readers. Passing `required` propagates `aria-required="true"` to the input at the same time.',
  },

  {
    category: "Accessibility",
    question: "Is Chumlab UI accessible?",
    answer:
      "Yes. Accessibility is a core requirement, not a retrofit. Every component follows WAI-ARIA 1.2 patterns, has full keyboard support, manages focus explicitly, and is tested against VoiceOver, NVDA, and JAWS.",
  },
  {
    category: "Accessibility",
    question: "What WCAG level does Chumlab UI target?",
    answer:
      "WCAG 2.2 Level AA. ACCESSIBILITY.md, shipped in the package, lists every Level A and AA criterion with its status and the test that holds it; a criterion is only claimed when a test fails if it regresses.",
  },
  {
    category: "Accessibility",
    question: "Does it support full keyboard navigation?",
    answer:
      "Yes. Every interactive component is fully keyboard operable: Tab / Shift-Tab to move focus, Enter / Space to activate, arrow keys to navigate inside composite widgets, Escape to close overlays, and Home / End where semantically meaningful.",
  },
  {
    category: "Accessibility",
    question: "Does it support screen readers?",
    answer:
      "Yes. Components expose correct ARIA roles and states (`aria-expanded`, `aria-selected`, `aria-current`, and so on) and use live regions for status announcements. The roles and states are gated by automated tests (axe and the library's own contracts); no manual screen-reader pass has been done yet.",
  },
  {
    category: "Accessibility",
    question: "Does it respect prefers-reduced-motion?",
    answer:
      'Yes. Every animation gates on the `prefers-reduced-motion` media query by default. You can override per component using the `reduceMotion` prop (`true`, `false`, or `"auto"`) when a specific flow requires it.',
  },
  {
    category: "Accessibility",
    question: "Does Chumlab UI support RTL languages?",
    answer:
      'Not in 0.1.0. Components render under `dir="rtl"` and nothing is lost off-screen, but several layouts and keyboard directions do not mirror yet; right-to-left support is planned for 1.1.',
  },
  {
    category: "Accessibility",
    question: "Does it handle focus trapping in modals and drawers?",
    answer:
      "Yes. Modal and Drawer trap Tab focus inside the overlay while open, restore focus to the element that opened them on close, and lock background scroll. The initial focus target can be overridden via `initialFocus`.",
  },

  {
    category: "Technical",
    question: "Is Chumlab UI tree-shakeable?",
    answer:
      "Yes. The package declares only its CSS as side-effectful (`sideEffects: ['*.css']`) and has per-component subpath exports (e.g. `@chumlab/ui/button`). Modern bundlers drop every component you don't import.",
  },
  {
    category: "Technical",
    question: "Does it use runtime CSS-in-JS?",
    answer:
      "No. Styles ship as a precompiled stylesheet of utility classes. There is no runtime style injection and no emotion or styled-components dependency.",
  },
  {
    category: "Technical",
    question: "What is the bundle size?",
    answer:
      "Individual components range from roughly 2 KB (Button) to 9 KB (DatePicker) gzipped including their sub-components. Because the library is fully tree-shakeable, you only pay for what you import — there is no base runtime to carry.",
  },
  {
    category: "Technical",
    question: "Does it support SSR?",
    answer:
      "Yes. Chumlab UI is SSR-safe on Next.js, Remix, Astro, and any framework that server-renders React. Components that need browser APIs (`window`, `document`, `matchMedia`) guard those accesses and render identically on server and client.",
  },
  {
    category: "Technical",
    question: "What TypeScript version is required?",
    answer:
      "TypeScript 5.0 or later. Chumlab UI ships strict, comprehensive types — props, events, refs, polymorphic `as`, and generic `classes` overrides all have first-class IntelliSense and strict-mode compile safety.",
  },
  {
    category: "Technical",
    question: "Does it support React Server Components in Next.js App Router?",
    answer:
      "Yes. Static components (pure layout and display primitives) work directly in Server Components. Interactive components are marked `'use client'` internally, so you can import them anywhere without adding manual directives.",
  },
  {
    category: "Technical",
    question: "How does Chumlab UI handle hydration in SSR?",
    answer:
      "Components render deterministically on the server and client: no random IDs at module scope, no reliance on `typeof window`, no `useLayoutEffect` warnings. React 18's `useId` is used for internal ID generation so client and server markup matches.",
  },
  {
    category: "Technical",
    question: "What React versions are supported?",
    answer:
      "React 18 and React 19. React 19's new hooks (`useFormStatus`, `useOptimistic`) interoperate cleanly with Chumlab UI's controlled-form pattern. React 17 and below are not supported because the library depends on the automatic JSX runtime and `useId`.",
  },
  {
    category: "Technical",
    question: "Does Chumlab UI have ESM and CJS builds?",
    answer:
      "Yes. The package ships both ESM (`.js`) and CJS (`.cjs`) builds alongside TypeScript declarations. Modern bundlers pick ESM for optimal tree-shaking; legacy Node.js and CommonJS consumers fall back to CJS automatically.",
  },

  {
    category: "Testing",
    question: "Is Chumlab UI easy to test?",
    answer:
      'Yes. Components expose stable `data-*` attributes on their internal parts (`data-state="open"`, `data-accordion-trigger`, and so on) that make them trivial to select and assert against in unit, integration, and end-to-end tests.',
  },
  {
    category: "Testing",
    question: "Can I test components with Jest or Vitest?",
    answer:
      "Yes. Chumlab UI is framework-agnostic at the test layer — pair it with Jest + jsdom, Vitest + happy-dom, or Vitest + jsdom. The library needs no transforms beyond what React already requires.",
  },
  {
    category: "Testing",
    question: "Does it work with React Testing Library?",
    answer:
      "Yes, and it is the recommended approach. Use `getByRole`, `getByLabelText`, and `@testing-library/user-event` exactly as you would with native elements — Chumlab UI's accessibility affordances make RTL queries resolve naturally.",
  },
  {
    category: "Testing",
    question: "Can I write E2E tests with Playwright or Cypress?",
    answer:
      "Yes. Stable `data-*` attributes and proper ARIA roles make Playwright `getByRole` and `getByTestId` selectors reliable across renders. Cypress works equivalently; no special setup is required beyond a running dev server.",
  },

  {
    category: "Migration",
    question: "How is Chumlab UI different from shadcn/ui?",
    answer:
      "shadcn/ui copies source code into your repository — you own the files and update them manually. Chumlab UI is a versioned npm package — you get incremental upgrades, bug fixes, and new components through `npm update` while keeping full style control via `classes` and `unstyled`.",
  },
  {
    category: "Migration",
    question: "How does Chumlab UI compare to Material UI (MUI)?",
    answer:
      "Material UI ships Material-specific look-and-feel with emotion-based CSS-in-JS at runtime. Chumlab UI is design-system-agnostic, styles from a precompiled stylesheet and design tokens, and is small per component. Pick Chumlab UI when you want design freedom and runtime performance; pick MUI when you explicitly want Material Design.",
  },
  {
    category: "Migration",
    question: "How does Chumlab UI compare to Chakra UI?",
    answer:
      "Chakra UI uses emotion plus a theme object at runtime. Chumlab UI styles with utility classes and CSS-variable design tokens, with no runtime styling layer, and switches dark and light through those tokens. The APIs are similar; migration is typically a rename plus a prop-shape adjustment.",
  },
  {
    category: "Migration",
    question: "How do I migrate from Radix UI to Chumlab UI?",
    answer:
      "Radix UI and Chumlab UI share the same composition philosophy (compound components, `asChild` slot pattern). Most Radix components have a Chumlab UI counterpart with a very similar API — the main change is that Chumlab UI ships styling out of the box, whereas Radix is unstyled.",
  },

  {
    category: "Licensing",
    question: "What license is Chumlab UI under?",
    answer:
      "MIT License — the most permissive open-source license. You can use, modify, fork, redistribute, and ship Chumlab UI in commercial products, SaaS, client work, and internal tools with no attribution required in your UI.",
  },
  {
    category: "Licensing",
    question: "Can I use Chumlab UI in commercial projects?",
    answer:
      "Yes. The MIT License permits unrestricted commercial use, including SaaS products, enterprise applications, agency client work, and software you sell. There are no license fees, royalties, usage caps, or per-seat charges.",
  },
  {
    category: "Licensing",
    question: "How do I report a bug?",
    answer:
      "Open an issue at github.com/chumlabhq/ui with a minimal reproduction (CodeSandbox, StackBlitz, or a Git repo), your environment (React, React DOM, Tailwind, browser, OS), and the expected versus actual behaviour. Most bugs are triaged within 48 hours.",
  },
  {
    category: "Licensing",
    question: "How do I request a new component?",
    answer:
      "Open a feature-request issue at github.com/chumlabhq/ui with concrete use cases, a rough API sketch, and links to similar components in other libraries. Components with clear demand and a clean, composable API are prioritised.",
  },
  {
    category: "Licensing",
    question: "Where can I get help if I'm stuck?",
    answer:
      "Start with the docs on chumlab.com and the FAQ. For bugs open an issue on GitHub; for questions start a discussion on GitHub Discussions; for anything else email hello@chumlab.com.",
  },
];
