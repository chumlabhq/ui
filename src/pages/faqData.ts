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
  | "AI Playground"
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
  "AI Playground",
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
  // ─── Getting Started ────────────────────────────────────────────────────
  {
    category: "Getting Started",
    question: "What is Chumlab UI?",
    answer:
      "Chumlab UI is an open-source, production-grade React component library with accessible, themeable primitives built on TypeScript and Tailwind CSS v4. It ships 30+ components — Button, Input, DatePicker, Modal, Table, and more — each keyboard-navigable, WCAG 2.1 AA compliant, and fully overridable via a classes prop or unstyled mode.",
  },
  {
    category: "Getting Started",
    question: "How do I install Chumlab UI?",
    answer:
      "Install with your package manager of choice: `npm install @chumlab/ui`, `pnpm add @chumlab/ui`, `yarn add @chumlab/ui`, or `bun add @chumlab/ui`. Chumlab UI requires React 18+ and Tailwind CSS v4 as peer dependencies. Import components directly: `import { Button, Input } from '@chumlab/ui'`.",
  },
  {
    category: "Getting Started",
    question: "What are the peer dependencies?",
    answer:
      "React 18 or later, React DOM 18 or later, and Tailwind CSS v4. Peer dependencies are declared so your project controls exact versions. Chumlab UI pulls in zero other runtime dependencies — no CSS-in-JS library, no icon bundle, no animation framework.",
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
      "Yes. Chumlab UI is framework-agnostic and works with any React setup: Vite, Create React App, Remix, Astro, Gatsby, and RedwoodJS. The only hard requirements are React 18+ and Tailwind CSS v4 configured in your build pipeline.",
  },
  {
    category: "Getting Started",
    question: "What Tailwind CSS version is required?",
    answer:
      "Tailwind CSS v4. Earlier versions (v3.x and below) are not supported because Chumlab UI relies on CSS-native theming via `@theme`, the new `@custom-variant` directive, and the modern engine's performance. Upgrade Tailwind to v4 before installing.",
  },
  {
    category: "Getting Started",
    question: "How do I set up Tailwind CSS v4 for Chumlab UI?",
    answer:
      'Install Tailwind CSS v4 and its Vite or PostCSS plugin, then add `@import "tailwindcss"` to your main CSS file. Extend the Tailwind content globs to include Chumlab UI\'s distribution so its utility classes are emitted: `content: ["./node_modules/@chumlab/ui/**/*.{js,mjs}"]`.',
  },

  // ─── AI Playground ──────────────────────────────────────────────────────
  {
    category: "AI Playground",
    question: "What is the Chumlab AI Playground?",
    answer:
      "The AI Playground is an in-product assistant that turns natural-language prompts and screenshots into production-ready React components built on Chumlab UI. It plans the requirement as a task list, streams typed JSX, and renders a live preview — so you can iterate on components without writing scaffolding.",
  },
  {
    category: "AI Playground",
    question: "What can I build with the AI Playground?",
    answer:
      "Anything that composes from Chumlab UI primitives: authentication screens, scheduling forms, checkout flows, analytics widgets, pricing cards, multi-step wizards, OTP verification, filter panels, and more. Generated code uses typed props, ARIA attributes, and Tailwind CSS v4 utilities out of the box.",
  },
  {
    category: "AI Playground",
    question: "Can I upload a screenshot and generate a matching component?",
    answer:
      "Yes. Drop an image into the playground and the AI analyses the layout, extracts text and typography, maps regions to Chumlab primitives (Input, DatePicker, Button, and so on), and emits JSX that recreates the reference. Follow-up prompts refine the output incrementally.",
  },
  {
    category: "AI Playground",
    question: "Does the AI Playground use my data for training?",
    answer:
      "No. Prompts, screenshots, and generated code are processed only to produce the requested component. Your inputs are not used to train models and are not retained beyond the active session.",
  },
  {
    category: "AI Playground",
    question: "Which AI model powers the Chumlab AI Playground?",
    answer:
      "The playground runs on frontier multi-modal large language models. The specific model may evolve over time as better models ship; regardless of the underlying model, responses consistently import from `@chumlab/ui` and target typed, accessible JSX.",
  },
  {
    category: "AI Playground",
    question: "Is the AI-generated code production-ready?",
    answer:
      "Yes. Output uses typed TypeScript props, follows WCAG 2.1 AA accessibility defaults, and only imports from `@chumlab/ui`. You own the code once generated — review it like any PR, adjust to your conventions, and ship.",
  },
  {
    category: "AI Playground",
    question: "Can I copy generated code and use it in my project?",
    answer:
      "Yes. Everything the playground outputs is yours to copy, paste, modify, and ship. There are no licensing restrictions beyond the MIT license that covers Chumlab UI itself.",
  },

  // ─── Components ─────────────────────────────────────────────────────────
  {
    category: "Components",
    question: "How many components does Chumlab UI include?",
    answer:
      "Chumlab UI ships 30+ components covering forms, selection, navigation, overlays, data display, and layout: Accordion, Avatar, Breadcrumb, Button, CascadingDropdown, Checkbox, CountryFlag, DatePicker, Drawer, Dropdown, Input, InternationalPhoneInput, Loader, Modal, MultiSelectDropdown, MultiSelectSearchableDropdown, OTPInput, Pagination, RadioButton, ResizablePanel, SearchableDropdown, Slider, Stepper, Switch, TabPanel, Table, TextArea, TimePicker, Toast, and Tooltip.",
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
      'Compose `Accordion` > `AccordionItem` > `AccordionTrigger` + `AccordionContent`. Set `type="single"` for one-at-a-time expansion or `type="multiple"` to allow many open at once. Pass `collapsible` to let a single-type accordion close its active panel. Variants (`bordered`, `ghost`, `filled`) and size props control appearance.',
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

  // ─── Theming ────────────────────────────────────────────────────────────
  {
    category: "Theming",
    question: "How do I customise component styles?",
    answer:
      "Every component accepts a `classes` prop — an object mapping internal slots (root, trigger, content, icon, and so on) to your own Tailwind class strings. For global changes, override design tokens via Tailwind CSS v4's `@theme` directive. For zero defaults, pass `unstyled` and build from scratch.",
  },
  {
    category: "Theming",
    question: "What is the classes prop?",
    answer:
      'The `classes` prop is an object that targets every internal element of a compound component by name. For example `<Accordion classes={{ root: "...", trigger: "...", content: "..." }} />` lets you override any slot with surgical precision — no specificity wars, no `!important`, no pseudo-element workarounds.',
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
      "Yes. Chumlab UI references CSS custom properties for colours, spacing, radii, and typography. Define those properties in Tailwind CSS v4's `@theme` directive and every component picks them up — change a token once and the entire library updates.",
  },
  {
    category: "Theming",
    question: "How do I enable dark mode?",
    answer:
      "Add the `dark` class to `<html>` (either at runtime or based on `prefers-color-scheme`) and every component switches automatically. Chumlab UI uses class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *))` so you can toggle per-subtree or per-app.",
  },
  {
    category: "Theming",
    question: "How do I override the primary brand colour globally?",
    answer:
      "Override the `--color-primary-*` CSS variables inside your `@theme` block. The scale follows Tailwind's 50 / 100 / 200 / ... / 950 steps. Override any subset you need and components adopt the change at runtime without a rebuild.",
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

  // ─── Forms ──────────────────────────────────────────────────────────────
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

  // ─── Accessibility ──────────────────────────────────────────────────────
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
      "Chumlab UI targets WCAG 2.1 Level AA across colour contrast, focus indicators, keyboard operability, and semantic structure. Components also meet the AAA target for focus-order where it is practical to do so.",
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
      "Yes. Components expose correct ARIA roles and states (`aria-expanded`, `aria-selected`, `aria-current`, and so on) and use live regions for status announcements. Tested with VoiceOver on macOS/iOS, NVDA and JAWS on Windows, and TalkBack on Android.",
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
      'Yes. Components use logical CSS properties (`inline-start`, `inline-end`, `margin-inline`) so layouts mirror automatically when you set `dir="rtl"` on the document. Arabic, Hebrew, Persian, and Urdu are part of the test matrix.',
  },
  {
    category: "Accessibility",
    question: "Does it handle focus trapping in modals and drawers?",
    answer:
      "Yes. Modal and Drawer trap Tab focus inside the overlay while open, restore focus to the element that opened them on close, and lock background scroll. The initial focus target can be overridden via `initialFocusRef`.",
  },

  // ─── Technical ──────────────────────────────────────────────────────────
  {
    category: "Technical",
    question: "Is Chumlab UI tree-shakeable?",
    answer:
      "Yes. The package is fully ESM with `sideEffects: false`, side-effect-free imports, and per-component subpath exports (e.g. `@chumlab/ui/button`). Modern bundlers strip every component you don't import.",
  },
  {
    category: "Technical",
    question: "Does it use runtime CSS-in-JS?",
    answer:
      "No. Chumlab UI uses Tailwind CSS utility classes resolved entirely at build time. There is no runtime style injection, no emotion or styled-components dependency, and no measurable style overhead at runtime.",
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

  // ─── Testing ────────────────────────────────────────────────────────────
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

  // ─── Migration ──────────────────────────────────────────────────────────
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
      "Material UI ships Material-specific look-and-feel with emotion-based CSS-in-JS at runtime. Chumlab UI is design-system-agnostic, build-time only (Tailwind CSS v4), and much smaller per-component. Pick Chumlab UI when you want design freedom and runtime performance; pick MUI when you explicitly want Material Design.",
  },
  {
    category: "Migration",
    question: "How does Chumlab UI compare to Chakra UI?",
    answer:
      "Chakra UI uses emotion plus a theme object at runtime. Chumlab UI is Tailwind-first with zero runtime cost, smaller bundles, and native dark-mode via CSS variables. The APIs are similar; migration is typically a rename plus a prop-shape adjustment.",
  },
  {
    category: "Migration",
    question: "How do I migrate from Radix UI to Chumlab UI?",
    answer:
      "Radix UI and Chumlab UI share the same composition philosophy (compound components, `asChild` slot pattern). Most Radix components have a Chumlab UI counterpart with a very similar API — the main change is that Chumlab UI ships styling out of the box, whereas Radix is unstyled.",
  },

  // ─── Licensing ──────────────────────────────────────────────────────────
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
