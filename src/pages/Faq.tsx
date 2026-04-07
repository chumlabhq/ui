import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { LogoMark } from "../components/BrandLogo/Logo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/Accordion";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// ─── Custom accordion icons ─────────────────────────────────────────────────

function FaqIconCollapsed() {
  return (
    <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center transition-all duration-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.08]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white/50 transition-colors duration-300 group-hover:text-blue-400"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

function FaqIconExpanded() {
  return (
    <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </div>
  );
}

// ─── FAQ Data ───────────────────────────────────────────────────────────────

const FAQ_DATA: { question: string; answer: string; category: string }[] = [
  // Getting Started
  {
    question: "What is Chumlab UI?",
    answer:
      "Chumlab UI is a modern, accessible React component library built with Tailwind CSS v4. It provides a collection of beautifully designed, production-ready components that are fully customizable and designed for dark-first interfaces. Every component ships with sensible defaults while remaining completely overridable.",
    category: "Getting Started",
  },
  {
    question: "How do I install Chumlab UI?",
    answer:
      'You can install Chumlab UI via npm, yarn, or pnpm. Simply run "npm install @chumlab/ui" in your project directory. After installation, import any component directly and start using it in your React application. The library is designed for zero-config setup with Tailwind CSS v4.',
    category: "Getting Started",
  },
  {
    question: "What are the peer dependencies?",
    answer:
      "Chumlab UI requires React 18 or later, React DOM 18 or later, and Tailwind CSS v4. These are listed as peer dependencies so you can use the versions that best fit your project. No other external dependencies are required, keeping your bundle lean.",
    category: "Getting Started",
  },
  {
    question: "Does Chumlab UI work with Next.js?",
    answer:
      "Yes, Chumlab UI is fully compatible with Next.js, including the App Router and Server Components. Components that require interactivity are marked with 'use client' directives where necessary. It works seamlessly with both the Pages Router and App Router patterns.",
    category: "Getting Started",
  },
  {
    question: "Is Chumlab UI free to use?",
    answer:
      "Chumlab UI is completely free and open-source under the MIT License. You can use it in personal projects, commercial products, and client work without any restrictions. We believe great UI primitives should be accessible to everyone.",
    category: "Getting Started",
  },

  // Components
  {
    question: "How many components does Chumlab UI include?",
    answer:
      "Chumlab UI includes a growing collection of essential components including Accordion, Button, DatePicker, TimePicker, Input, Select, Modal, Tooltip, and many more. We are continuously adding new components based on community feedback and real-world usage patterns.",
    category: "Components",
  },
  {
    question: "What components are available for forms?",
    answer:
      "We offer a comprehensive set of form components including Input, Select, Checkbox, RadioButton, DatePicker, TimePicker, Switch, and Textarea. Each form component supports validation states, error messages, and integrates smoothly with popular form libraries like React Hook Form and Formik.",
    category: "Components",
  },
  {
    question: "Does Chumlab UI have a data table component?",
    answer:
      "Yes, Chumlab UI includes a powerful Table component with support for sorting, pagination, row selection, and custom cell rendering. The Table is built for performance and can handle large datasets efficiently. It supports both client-side and server-side data operations.",
    category: "Components",
  },
  {
    question:
      "Can I use individual components without importing the whole library?",
    answer:
      "Absolutely. Chumlab UI is designed with tree-shaking in mind, so you only bundle the components you actually import. Each component is independently importable, meaning your final bundle will only include the code for components you use. There is zero overhead from unused components.",
    category: "Components",
  },
  {
    question: "How do I use the Accordion component?",
    answer:
      "The Accordion component supports both single and multiple expansion modes. Wrap AccordionItem components inside an Accordion, and use AccordionTrigger and AccordionContent within each item. You can customize the variant (bordered, ghost, filled), size, animation behavior, and more through props.",
    category: "Components",
  },

  // Customization
  {
    question: "How do I customize component styles?",
    answer:
      "Every component accepts a classes prop that lets you override styles for any internal element. You can also pass standard className for the root element. For deeper customization, the unstyled mode strips all default styles so you can build your own design from scratch using Tailwind utilities.",
    category: "Customization",
  },
  {
    question: "What is the classes prop?",
    answer:
      "The classes prop is an object that maps internal component parts to your custom CSS class strings. For example, an Accordion's classes prop lets you target root, item, trigger, content, icon, and more. This provides surgical control over every visual aspect without fighting specificity wars.",
    category: "Customization",
  },
  {
    question: "What is the unstyled mode?",
    answer:
      "Setting unstyled={true} on any component removes all default styles, giving you a completely bare component with only the structural markup and accessibility features intact. This is ideal when you want to build a custom design system on top of Chumlab UI's behavioral primitives.",
    category: "Customization",
  },
  {
    question: "Can I use my own design tokens?",
    answer:
      "Yes. Since Chumlab UI is built on Tailwind CSS v4, you can define your own design tokens using CSS custom properties or Tailwind's theme configuration. Components will naturally inherit your theme values. You can also override specific tokens on a per-component basis using the classes prop.",
    category: "Customization",
  },
  {
    question: "How does theming work with Tailwind CSS v4?",
    answer:
      "Tailwind CSS v4 uses CSS-native theming with @theme directives and custom properties. Chumlab UI leverages this by referencing theme tokens rather than hardcoded values. You can change colors, spacing, typography, and more globally by updating your Tailwind theme, and all components will reflect the changes.",
    category: "Customization",
  },

  // Accessibility
  {
    question: "Is Chumlab UI accessible?",
    answer:
      "Accessibility is a core design principle, not an afterthought. Every component follows WAI-ARIA patterns and is tested with screen readers, keyboard navigation, and automated accessibility tools. We aim to meet WCAG 2.1 AA compliance across the entire library.",
    category: "Accessibility",
  },
  {
    question: "What WCAG level does Chumlab UI target?",
    answer:
      "Chumlab UI targets WCAG 2.1 Level AA compliance. This includes proper color contrast ratios, focus indicators, semantic HTML structure, and ARIA attributes. We continuously audit our components and welcome accessibility feedback from the community.",
    category: "Accessibility",
  },
  {
    question: "Does it support keyboard navigation?",
    answer:
      "Yes, all interactive components support full keyboard navigation. The Accordion supports arrow keys, Home, End, and Enter/Space for toggling. Modals trap focus correctly, dropdowns support typeahead search, and all focusable elements have visible focus indicators.",
    category: "Accessibility",
  },
  {
    question: "Does it support screen readers?",
    answer:
      "Every component includes appropriate ARIA roles, labels, and live regions to ensure a great screen reader experience. We test with VoiceOver, NVDA, and JAWS. Components announce state changes, expanded/collapsed states, and provide meaningful labels by default.",
    category: "Accessibility",
  },
  {
    question: "Does it respect prefers-reduced-motion?",
    answer:
      'Yes. All animations in Chumlab UI respect the prefers-reduced-motion media query by default. When a user has reduced motion enabled, animations are either minimized or disabled entirely. You can also control this per-component with the reduceMotion prop, which accepts true, false, or "auto".',
    category: "Accessibility",
  },

  // Technical
  {
    question: "Is Chumlab UI tree-shakeable?",
    answer:
      "Yes, Chumlab UI is fully tree-shakeable. The library uses ES modules and side-effect-free exports, so your bundler (Vite, webpack, etc.) will only include the code for components you actually import. This keeps your production bundle as small as possible.",
    category: "Technical",
  },
  {
    question: "Does it use runtime CSS-in-JS?",
    answer:
      "No. Chumlab UI uses Tailwind CSS utility classes and does not inject any CSS at runtime. This means zero runtime style overhead, better performance, and full compatibility with server-side rendering. All styles are resolved at build time through Tailwind's compiler.",
    category: "Technical",
  },
  {
    question: "What is the bundle size?",
    answer:
      "Individual components are extremely lightweight, typically ranging from 2-8 KB gzipped depending on complexity. Since the library is tree-shakeable, you only pay for what you use. The Accordion component, for example, is approximately 4 KB gzipped including all its sub-components.",
    category: "Technical",
  },
  {
    question: "Does it support SSR?",
    answer:
      "Yes, Chumlab UI fully supports server-side rendering with frameworks like Next.js and Remix. Components that require browser APIs gracefully handle server environments. There are no hydration mismatches, and initial renders are consistent between server and client.",
    category: "Technical",
  },
  {
    question: "What TypeScript version is required?",
    answer:
      "Chumlab UI requires TypeScript 5.0 or later. The library ships with comprehensive type definitions that provide excellent IntelliSense, autocompletion, and compile-time safety. All props, events, and ref types are fully typed for a great developer experience.",
    category: "Technical",
  },

  // Licensing
  {
    question: "What license is Chumlab UI under?",
    answer:
      "Chumlab UI is released under the MIT License, one of the most permissive open-source licenses available. You can use, modify, and distribute the library freely in both personal and commercial projects without any attribution requirements in your UI.",
    category: "Licensing",
  },
  {
    question: "Can I use it in commercial projects?",
    answer:
      "Yes, the MIT License permits unrestricted commercial use. You can use Chumlab UI in SaaS products, client projects, enterprise applications, and any other commercial context. There are no fees, royalties, or usage restrictions of any kind.",
    category: "Licensing",
  },
  {
    question: "How do I report a bug?",
    answer:
      "You can report bugs by opening an issue on our GitHub repository at github.com/chumlabhq/ui. Please include a minimal reproduction, your environment details (React version, browser, OS), and a clear description of the expected vs. actual behavior. We aim to triage new issues within 48 hours.",
    category: "Licensing",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

const Faq = () => {
  useDocumentTitle("FAQ | Chumlab UI");

  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return FAQ_DATA;
    return FAQ_DATA.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white overflow-x-hidden">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#04040a]/60">
        <div className="w-full px-5 sm:px-8">
          <div className="flex items-center justify-between py-3.5">
            <Link to="/" className="flex items-center gap-3">
              <LogoMark size={160} />
            </Link>
            <div className="flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to="/accordion"
                  className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                >
                  Components
                </Link>
                <Link
                  to="/blog"
                  className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                >
                  Blog
                </Link>
                <Link
                  to="/faq"
                  className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                >
                  FAQ
                </Link>
                <a
                  href="https://github.com/chumlabhq/ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-white/6"
                  aria-label="GitHub"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </div>
              <Link
                to="/accordion"
                className="text-[12px] font-medium px-5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/8 hover:border-blue-500/25 transition-all duration-300 sm:ml-2"
              >
                Get Started
              </Link>
              {/* Hamburger button – mobile only */}
              <button
                onClick={() => setMenuOpen(true)}
                className="sm:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors duration-300 ml-1"
                aria-label="Open menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Slide-in panel */}
          <div className="absolute top-0 right-0 h-full w-64 max-w-[80vw] bg-[#0a0a14] border-l border-white/[0.08] p-6 flex flex-col gap-2">
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors duration-300 mb-4"
              aria-label="Close menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <Link
              to="/accordion"
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3 py-2.5 rounded-lg hover:bg-white/[0.06]"
            >
              Components
            </Link>
            <Link
              to="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3 py-2.5 rounded-lg hover:bg-white/[0.06]"
            >
              Blog
            </Link>
            <Link
              to="/faq"
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3 py-2.5 rounded-lg hover:bg-white/[0.06]"
            >
              FAQ
            </Link>
            <a
              href="https://github.com/chumlabhq/ui"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] flex items-center gap-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <main className="pt-[72px]">
        {/* ══ HERO ══ */}
        <section className="px-4 sm:px-6 lg:px-10 pt-20 pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Everything you need to know about Chumlab UI. Can't find what
              you're looking for? Reach out to us.
            </p>

            <div className="relative max-w-xl mx-auto">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 text-[15px] outline-none focus:border-blue-500/30 focus:bg-white/[0.06] transition-all duration-300"
              />
            </div>
          </div>
        </section>

        {/* ══ FAQ ACCORDION ══ */}
        <section className="px-4 sm:px-6 lg:px-10 pt-4 pb-12">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                classes={{
                  root: "w-full rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.02]",
                  item: "border-b border-white/[0.06] last:border-b-0",
                  trigger:
                    "flex w-full items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left text-[15px] font-medium text-white/90 transition-all duration-300 hover:bg-white/[0.04] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-inset",
                  triggerInner: "flex-1 text-left",
                  content:
                    "px-4 sm:px-6 py-4 sm:py-5 text-[15px] text-gray-400 leading-relaxed",
                  contentWrapper:
                    "overflow-hidden transition-[max-height,opacity,visibility]",
                  icon: "shrink-0 text-white/40",
                  iconWrapper: "shrink-0",
                  subtitle: "",
                  triggerLeft: "",
                  triggerRight: "",
                  contentInner: "",
                  heading: "",
                }}
              >
                {filteredFaqs.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`faq-${i}`}>
                    <AccordionTrigger
                      expandedIcon={<FaqIconExpanded />}
                      collapsedIcon={<FaqIconCollapsed />}
                      iconAnimation="none"
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              /* ── Empty State ── */
              <div className="text-center py-12 sm:py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.05] border border-white/[0.08] mb-6">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/40"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white/80 mb-2">
                  No questions match your search
                </h3>
                <p className="text-white/40 mb-6 max-w-md mx-auto">
                  Try adjusting your search terms or using different keywords.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-medium px-5 py-2 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/8 hover:border-blue-500/25 transition-all duration-300 cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ══ CTA SECTION ══ */}
        <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-8 lg:p-12 text-center overflow-hidden">
              {/* Subtle gradient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/[0.06] rounded-full blur-[100px] pointer-events-none" />

              <h2 className="relative text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-4">
                Still have questions?
              </h2>
              <p className="relative text-white/50 max-w-lg mx-auto mb-8 leading-relaxed">
                Our team is happy to help. Drop us a line and we'll get back to
                you.
              </p>
              <a
                href="mailto:hello@chumlab.com"
                className="relative inline-flex items-center gap-2.5 text-sm font-medium px-7 py-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/25 hover:border-blue-500/40 text-blue-300 hover:text-blue-200 transition-all duration-300"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                hello@chumlab.com
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="w-full px-4 sm:px-6 lg:px-10 pt-16 pb-8">
          <div className="border-t border-white/[0.08] pt-8">
            {/* Row: logo - nav links - social */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
              <LogoMark size={120} />
              <div className="flex items-center gap-6">
                <Link
                  to="/accordion"
                  className="text-sm text-white/70 hover:text-white transition-colors duration-300"
                >
                  Components
                </Link>
                <Link
                  to="/blog"
                  className="text-sm text-white/70 hover:text-white transition-colors duration-300"
                >
                  Blog
                </Link>
                <Link
                  to="/faq"
                  className="text-sm text-white/70 hover:text-white transition-colors duration-300"
                >
                  FAQ
                </Link>
                <a
                  href="https://github.com/chumlabhq/ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
              <span>
                &copy; {new Date().getFullYear()} Chumlab &middot; MIT License
                &middot; Built with {"☕"} and way too many tabs
              </span>
              <a
                href="mailto:hello@chumlab.com"
                className="text-white/60 hover:text-white transition-colors duration-300"
              >
                {"💬"} Got feedback? Ping us at{" "}
                <span className="underline underline-offset-2">
                  hello@chumlab.com
                </span>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Faq;
