import { Link } from "react-router-dom";
import { forwardRef, useEffect, useRef, useState } from "react";
import { BLOG_POSTS } from "./blog/blogData";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AIPlaygroundSection from "./playground/AIPlaygroundSection";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { WhyChumlabSection } from "../components/WhyChumlabSection";
import { GetStartedSection } from "../components/GetStartedSection";
import { CatalogSection } from "../components/CatalogSection";
import { ChumlabComparisonSection } from "../components/ChumlabComparisonSection";
import Reveal from "../components/Reveal/Reveal";
import { Button } from "../components/ui";

// ─── FAQ preview (subset of full FAQ data) ─────────────────────────────────

const HOME_FAQS: Array<{ id: string; question: string; answer: string }> = [
  {
    id: "free",
    question: "Is Chumlab free to use?",
    answer:
      "Yes. Chumlab is fully open source under the MIT license. Use it in personal projects, side hustles, and commercial products without paying a cent or asking permission. The components, the docs, and the AI Playground are all free.",
  },
  {
    id: "nextjs",
    question: "Does it work with Next.js?",
    answer:
      'Yes. Every Chumlab component is SSR-safe and works in the Next.js App Router and Pages Router out of the box. We test against Next.js 14+ and React 18+. Server Components are fully supported — interactive primitives use the "use client" directive automatically.',
  },
  {
    id: "styles",
    question: "How do I customize component styles?",
    answer:
      "Three ways, ranked by effort. First: pass a className to override anything (Tailwind, CSS Modules, plain CSS — your choice). Second: theme via CSS variables for design tokens like --cl-radius, --cl-accent, --cl-text. Third: use the unstyled variants and bring your own visuals while keeping our accessibility logic.",
  },
  {
    id: "a11y",
    question: "Is Chumlab accessible?",
    answer:
      "WCAG 2.1 AA across every primitive. Full keyboard navigation, focus management, ARIA announcements, and respect for prefers-reduced-motion. We test with screen readers and run automated audits against every release. If something isn't accessible, treat it as a bug and tell us.",
  },
  {
    id: "components",
    question: "What components are included?",
    answer:
      "Currently 30+ primitives covering forms (Input, Select, Combobox, OTPInput, InternationalPhoneInput), overlays (Modal, Drawer, Popover, Tooltip), data (Table, DataGrid, Pagination), feedback (Toast, Alert, Banner), and layout (Card, Divider, Tabs, Accordion). The catalog grows every release — see our roadmap on GitHub.",
  },
];

// ─── Typed rotator ──────────────────────────────────────────────────────────

const TYPED_WORDS = [
  "developers",
  "founders",
  "designers",
  "SaaS creators",
  "indie hackers",
  "product teams",
];

function TypedRotator() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const word = TYPED_WORDS[wordIdx];
    let charIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        charIdx++;
        setText(word.slice(0, charIdx));
        if (charIdx === word.length) {
          timer = setTimeout(() => {
            deleting = true;
            tick();
          }, 1400);
          return;
        }
        timer = setTimeout(tick, 75);
      } else {
        charIdx--;
        setText(word.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          timer = setTimeout(() => {
            setWordIdx((i) => (i + 1) % TYPED_WORDS.length);
          }, 200);
          return;
        }
        timer = setTimeout(tick, 35);
      }
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [wordIdx]);

  return (
    // The span auto-sizes to whatever text is currently typed so the
    // surrounding sentence stays flush against the cursor on every keystroke.
    // `whitespace-nowrap` keeps multi-word entries (e.g. "SaaS creators") on
    // one line; the cursor sits immediately after the last character.
    <span className="inline whitespace-nowrap">
      <span className="font-medium text-fg">{text}</span>
      <span
        aria-hidden
        className="inline-block align-baseline ml-[1px] animate-cursor"
        style={{ width: 2, height: "0.85em", background: "var(--accent)" }}
      />
    </span>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

const Home = () => {
  useDocumentTitle("Components that ship at the speed of thought");
  const [randomBlogs] = useState(() => {
    const shuffled = [...BLOG_POSTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#ai-playground") {
      window.setTimeout(() => {
        document
          .getElementById("ai-playground")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }, []);

  const copyInstall = () => {
    navigator.clipboard.writeText("npm i @chumlab/ui");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const [featured, ...rest] = randomBlogs;
  const stackedPosts = rest.slice(0, 2);

  return (
    <div className="min-h-screen bg-bg-base text-fg">
      <SiteHeader />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO (full viewport, vertically centered)
          The header above is `position: fixed` so the hero is the first
          in-flow block. `min-height: 100dvh` + `padding-top: header-height`
          gives the hero exactly the viewport height; the inner flex column
          centers within the visible area below the fixed header.
      ══════════════════════════════════════════════════════════════════ */}
      <section className="hero-section">
        <div
          className="flex flex-col items-center w-full text-center gap-6 sm:gap-8"
          style={{ maxWidth: 1100, padding: "0 24px" }}
        >
          {/* Announcement pill — chip-inside-a-pill. On screens below
              640px the message text collapses, leaving just the chip + arrow
              so the pill never wraps. */}
          <Link
            to="/?openPlayground=1#ai-playground"
            className="hero-pill group inline-flex items-center transition-colors max-w-full"
            data-track-event="cta_click"
            data-track-location="home_hero_pill"
            data-track-target="ai_playground"
            style={{
              gap: 10,
              padding: "4px 16px 4px 4px",
              border: "0.5px solid var(--border-soft)",
              borderRadius: 100,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-active)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-soft)")
            }
          >
            <span
              className="inline-flex items-center shrink-0"
              style={{
                background: "var(--accent)",
                color: "var(--bg-base)",
                padding: "4px 11px",
                borderRadius: 100,
                fontSize: 10.5,
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                gap: 5,
              }}
            >
              <SparkleGlyph />
              AI Playground
            </span>
            <span
              className="hidden sm:inline text-fg whitespace-nowrap"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              Skip writing components from scratch
            </span>
            <span
              aria-hidden
              className="transition-all duration-150 group-hover:translate-x-1 group-hover:[color:var(--text-primary)]"
              style={{ color: "var(--text-tertiary)", fontSize: 14 }}
            >
              &rarr;
            </span>
          </Link>

          {/* Headline — mixed weights + opacity hierarchy. Mobile allows
              natural wrapping (2-3 lines is fine); on `sm:` and up the lines
              stay locked via `sm:whitespace-nowrap` so the intended 2-line
              composition holds. */}
          <h1
            className="font-sans text-center mx-auto text-fg"
            style={{
              fontSize: "clamp(40px, 9vw, 104px)",
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
              maxWidth: 1100,
            }}
          >
            <span className="hero-h1-line1 block sm:whitespace-nowrap">
              <span className="font-semibold text-fg">Components</span>{" "}
              <span className="font-light text-fg/55">that ship</span>
            </span>
            <span className="hero-h1-line2 block sm:whitespace-nowrap">
              <span className="font-light text-fg/55">at the</span>{" "}
              <span className="font-semibold text-fg">speed</span>{" "}
              <span className="font-light text-fg/55">of</span>{" "}
              <em className="font-serif italic font-normal text-accent text-[1.02em]">
                thought.
              </em>
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="hero-descriptor mx-auto"
            style={{
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.5,
              color: "var(--text-secondary)",
              maxWidth: 580,
            }}
          >
            A component library for <TypedRotator /> who care about craft.
            Customisable, accessible, and fast.
          </p>

          {/* CTAs: primary button + inline npm pill. Stack on mobile and
              switch to inline at sm+. The Button component owns the
              w-full sm:w-auto rule — the wrapper just needs to allow
              stacking. The `max-w-[320px]` keeps each button capped on
              narrow screens so they don't span the full hero width. */}
          <div className="hero-ctas flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-[320px] sm:max-w-none mx-auto sm:mx-0">
            <Button
              variant="primary"
              size="lg"
              as="a"
              href="/accordion"
              className="group"
              data-track-event="cta_click"
              data-track-location="home_hero"
              data-track-target="browse_components"
              endIcon={
                <span
                  aria-hidden
                  className="transition-transform duration-150 group-hover:translate-x-1"
                >
                  →
                </span>
              }
            >
              Browse components
            </Button>

            <Button
              variant="secondary"
              size="lg"
              type="button"
              onClick={copyInstall}
              aria-label="Copy npm install command"
              className="font-mono"
              data-track-event="cta_click"
              data-track-location="home_hero"
              data-track-target="copy_npm_install"
            >
              {copied ? (
                <span className="inline-flex items-center gap-2 text-[13px]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span style={{ color: "var(--accent)" }}>Copied</span>
                </span>
              ) : (
                <>
                  <span className="inline-flex items-baseline gap-1.5 text-[13px]">
                    <span style={{ color: "var(--text-tertiary)" }}>$</span>
                    <span style={{ color: "var(--text-primary)" }}>npm i</span>
                    <span style={{ color: "var(--accent)" }}>@chumlab/ui</span>
                  </span>
                  <CopyIcon />
                </>
              )}
            </Button>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — AI PLAYGROUND (moved up: was slot 5)
      ══════════════════════════════════════════════════════════════════ */}
      <AIPlaygroundSection />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3 — WHY CHUMLAB
      ══════════════════════════════════════════════════════════════════ */}
      <WhyChumlabSection />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4 — GET STARTED
      ══════════════════════════════════════════════════════════════════ */}
      <GetStartedSection />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 5 — THE CATALOG
      ══════════════════════════════════════════════════════════════════ */}
      <CatalogSection />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 6 — CHUMLAB VS. THE TYPICAL SETUP
      ══════════════════════════════════════════════════════════════════ */}
      <ChumlabComparisonSection />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 7 — FAQ
      ══════════════════════════════════════════════════════════════════ */}
      <FaqSection />


      {/* ══════════════════════════════════════════════════════════════════
          SECTION 8 — FROM THE BLOG
      ══════════════════════════════════════════════════════════════════ */}
      <BlogSection featured={featured} stackedPosts={stackedPosts} />

      <SiteFooter />
    </div>
  );
};

// ─── Small helpers ──────────────────────────────────────────────────────────

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--text-tertiary)" }}
      className="group-hover:[color:var(--text-primary)] transition-colors"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function SparkleGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 3l1.6 4.4 4.4 1.6-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM18.5 14l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7z" />
    </svg>
  );
}

/* ─── FAQ section ──────────────────────────────────────────────────────────
   Hand-rolled single-open accordion. Single useState owns the currently-open
   id, the panel uses the CSS-Grid rows trick (0fr → 1fr) for a smooth
   measured-free expand, and arrow-up/down keys move focus between rows.
   IntersectionObserver fades in the title block, items (60ms stagger), and
   CTA on first scroll-into-view; reduced-motion short-circuits to the
   visible state with no transition. */

function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const toggle = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      buttonRefs.current[(idx + 1) % HOME_FAQS.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      buttonRefs.current[
        (idx - 1 + HOME_FAQS.length) % HOME_FAQS.length
      ]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[HOME_FAQS.length - 1]?.focus();
    }
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-bg-base"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Title row — H2 + subtitle on the left, desktop CTA on the right.
            Same pattern as the blog section. */}
        <div className="mb-12 sm:mb-14 lg:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-[640px]">
            <Reveal delay={0} translateY={12} duration={200}>
              <h2
                id="faq-heading"
                className="font-sans text-[clamp(40px,5.5vw,72px)] font-medium tracking-[-0.04em] leading-[1.0] text-fg"
              >
                Questions you{" "}
                <em className="font-serif italic font-normal text-accent">
                  might
                </em>{" "}
                have.
              </h2>
            </Reveal>
            <Reveal delay={80} translateY={8} duration={200}>
              <p className="font-sans text-[15px] sm:text-[16px] text-fg-secondary leading-[1.6] mt-5 sm:mt-6 max-w-[520px]">
                If you don&rsquo;t see yours here, we&rsquo;re at{" "}
                <a
                  href="mailto:hello@chumlab.com?subject=Question%20about%20Chumlab&body=Hi%20Chumlab%20team%2C%0A%0A"
                  className="text-fg hover:text-accent transition-colors underline-offset-4 hover:underline"
                >
                  hello@chumlab.com
                </a>
                . Actual humans reply.
              </p>
            </Reveal>
          </div>

          <Button
            variant="primary"
            size="md"
            as="a"
            href="/faq"
            fullWidthMobile={false}
            /* Desktop-only header CTA: lives next to the H2 in a flex row
               on sm+ and is hidden on mobile (the mobile equivalent
               renders below the accordion). Inline width is correct. */
            className="hidden sm:inline-flex self-start sm:self-end shrink-0"
            data-track-event="cta_click"
            data-track-location="home_faq_section"
            data-track-target="browse_all_faqs_desktop"
          >
            Browse all FAQs
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Button>
        </div>

        {/* Accordion — tight 50ms stagger keeps every item under the
            500ms delay cap so a fast scroller doesn't see blank rows. */}
        <ul className="border-t border-border-faint">
          {HOME_FAQS.map((faq, i) => (
            <Reveal
              key={faq.id}
              as="li"
              delay={100 + i * 30}
              translateY={12}
              duration={200}
              className="border-b border-border-faint group"
            >
              <FaqItem
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                index={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onToggle={() => toggle(faq.id)}
                onKeyNav={(e) => handleKey(e, i)}
                answerId={`faq-answer-${faq.id}`}
              />
            </Reveal>
          ))}
        </ul>

        {/* Mobile-only CTA below the accordion. The Button component
            owns the w-full sm:w-auto width rule for primary; we just
            keep the section-mobile-only visibility via sm:hidden. */}
        <Button
          variant="primary"
          size="md"
          as="a"
          href="/faq"
          className="sm:hidden mt-8"
          data-track-event="cta_click"
          data-track-location="home_faq_section"
          data-track-target="browse_all_faqs_mobile"
        >
          Browse all FAQs
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Button>
      </div>
    </section>
  );
}

interface FaqItemProps {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  onKeyNav: (e: React.KeyboardEvent) => void;
  answerId: string;
}

// FaqItem renders the trigger + collapsible region directly. The <li>
// element + entry stagger are provided by the surrounding <Reveal as="li">.
const FaqItem = forwardRef<HTMLButtonElement, FaqItemProps>(
  function FaqItemImpl(
    {
      index,
      question,
      answer,
      isOpen,
      onToggle,
      onKeyNav,
      answerId,
    },
    ref,
  ) {
    return (
      <>
        <button
          ref={ref}
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
          onKeyDown={onKeyNav}
          className="w-full flex items-start justify-between gap-3 sm:gap-6 py-5 sm:py-6 text-left transition-colors duration-200 hover:bg-fg/[0.015] focus-visible:outline-none focus-visible:bg-accent/[0.04] -mx-4 sm:-mx-5 px-4 sm:px-5 rounded-md cursor-pointer"
          data-track-event="faq_question_toggle"
          data-track-location="home"
          data-track-question={question}
          data-track-index={String(index)}
        >
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <span
              className={`font-mono text-[10px] sm:text-[11px] mt-1.5 shrink-0 transition-colors duration-200 ${
                isOpen
                  ? "text-accent/70"
                  : "text-fg-muted group-hover:text-accent/70"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-sans text-[16px] sm:text-[17px] font-medium text-fg leading-[1.45]">
              {question}
            </span>
          </div>

          <span
            aria-hidden
            className={`shrink-0 mt-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? "border-accent/50 rotate-90"
                : "border-border-soft group-hover:border-border-active group-hover:rotate-90"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={`w-3 h-3 transition-transform duration-300 ${
                isOpen
                  ? "text-accent rotate-45"
                  : "text-fg-secondary"
              }`}
              aria-hidden
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
        </button>

        {/* Grid-rows trick: smooth height animation without measuring DOM. */}
        <div
          id={answerId}
          role="region"
          aria-labelledby={answerId + "-trigger"}
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{
            gridTemplateRows: isOpen ? "1fr" : "0fr",
          }}
        >
          <div className="overflow-hidden">
            <div className="pl-9 sm:pl-11 pr-4 sm:pr-5 pb-6 sm:pb-7">
              <p className="font-sans text-[14px] sm:text-[15px] text-fg-secondary leading-[1.65]">
                {answer}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  },
);

/* ─── Blog section ─────────────────────────────────────────────────────────
   Three random posts: a featured card spans 2×2 on lg, two smaller cards
   stack on the right. Covers are inline-SVG typographic treatments per
   category — never images. Hover lifts the card (gap grows), tints the
   cover, recolors the title + Read link. */

interface BlogPostLite {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
}

function BlogSection({
  featured,
  stackedPosts,
}: {
  featured?: BlogPostLite;
  stackedPosts: BlogPostLite[];
}) {
  if (!featured) return null;

  // Card delays — one Reveal per card, 100ms staggered to match the
  // section-4 3-column rhythm.
  const cards: Array<{ post: BlogPostLite; variant: CoverVariant }> = [
    { post: featured, variant: "accent" },
    ...stackedPosts.map((post, i) => ({
      post,
      variant: (i === 0 ? "dark-light" : "dark-accent") as CoverVariant,
    })),
  ];

  return (
    <section
      aria-labelledby="blog-heading"
      className="relative py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-bg-base"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Title row — H2 + subtitle on the left, desktop CTA on the right. */}
        <div className="mb-12 sm:mb-14 lg:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-[640px]">
            <Reveal delay={0} translateY={12} duration={200}>
              <h2
                id="blog-heading"
                className="font-sans text-[clamp(40px,5.5vw,72px)] font-medium tracking-[-0.04em] leading-[1.0] text-fg"
              >
                <em className="font-serif italic font-normal text-accent">
                  Field
                </em>{" "}
                notes.
              </h2>
            </Reveal>
            <Reveal delay={80} translateY={8} duration={200}>
              <p className="font-sans text-[15px] sm:text-[16px] text-fg-secondary leading-[1.6] mt-5 sm:mt-6 max-w-[480px]">
                Practical guides on React architecture, performance patterns,
                and the craft of frontend engineering.
              </p>
            </Reveal>
          </div>

          <Button
            variant="primary"
            size="md"
            as="a"
            href="/blog"
            fullWidthMobile={false}
            /* Desktop-only header CTA: hidden on mobile (mobile equivalent
               renders below the cards). Inline width is correct. */
            className="hidden sm:inline-flex self-start sm:self-end shrink-0"
            data-track-event="cta_click"
            data-track-location="home_blog_section"
            data-track-target="all_articles_desktop"
          >
            All articles
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Button>
        </div>

        <h3 className="sr-only">Latest articles from the Chumlab team</h3>

        {/* Posts grid — equal-sized cards. The featured slot is distinguished
            by cover *colour*, not size: post 0 takes the accent-blue
            background, posts 1 and 2 stay dark with light / accent titles. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map(({ post, variant }, i) => (
            <Reveal
              key={post.id}
              delay={100 + i * 30}
              translateY={16}
              duration={200}
            >
              <BlogCard post={post} variant={variant} />
            </Reveal>
          ))}
        </div>

        {/* Mobile-only CTA below the grid. Button owns w-full sm:w-auto. */}
        <Reveal delay={200} translateY={12} duration={200}>
          <Button
            variant="primary"
            size="md"
            as="a"
            href="/blog"
            className="sm:hidden mt-8"
            data-track-event="cta_click"
            data-track-location="home_blog_section"
            data-track-target="all_articles_mobile"
          >
            All articles
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

type CoverVariant = "accent" | "dark-light" | "dark-accent";

function BlogCard({
  post,
  variant,
}: {
  post: BlogPostLite;
  variant: CoverVariant;
}) {
  const cover =
    variant === "accent"
      ? { bg: "bg-accent", title: "text-bg-base" }
      : variant === "dark-accent"
        ? { bg: "bg-bg-elevated", title: "text-accent" }
        : { bg: "bg-bg-elevated", title: "text-fg" };

  return (
    <Link
      to={`/blog/${post.id}`}
      className="group flex flex-col gap-4 sm:gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-bg-base rounded-lg"
      data-track-event="blog_card_click"
      data-track-location="home"
      data-track-target={post.id}
    >
      {/* Cover — solid colored block + centered serif italic title. */}
      <div
        className={`relative aspect-[4/3] rounded-lg overflow-hidden border border-border-faint flex items-center justify-center p-6 sm:p-8 transition-transform duration-300 group-hover:scale-[0.99] ${cover.bg}`}
      >
        <h3
          className={`font-serif italic font-normal leading-[1.05] tracking-[-0.025em] text-center text-[clamp(22px,2.6vw,32px)] ${cover.title}`}
        >
          {post.title}
        </h3>
      </div>

      {/* Body — category eyebrow + sans-serif title + excerpt + meta row. */}
      <div className="flex flex-col gap-2.5">
        <div className="inline-flex items-center gap-1.5 self-start">
          <span aria-hidden className="w-1 h-1 rounded-full bg-accent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-secondary">
            {post.category}
          </span>
        </div>

        <h3 className="font-sans text-[17px] sm:text-[18px] font-medium tracking-[-0.02em] leading-[1.35] text-fg group-hover:text-accent transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        <p className="font-sans text-[13px] sm:text-[14px] text-fg-secondary leading-[1.55] line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3 mt-1 font-mono text-[11px] text-fg-tertiary">
          <span>{post.date}</span>
          <span aria-hidden className="text-fg-muted">
            ·
          </span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}


export default Home;
