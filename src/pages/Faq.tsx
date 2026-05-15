import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useJsonLd, useCanonical } from "../hooks/useJsonLd";
import {
  FAQ_DATA,
  FAQ_CATEGORIES,
  faqAnchor,
  type FaqCategory,
} from "./faqData";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Pagination } from "../components/Pagination";
import Reveal from "../components/Reveal/Reveal";
import { trackEvent } from "../lib/analytics";

const PAGE_TITLE = "Frequently Asked Questions";
const PAGE_DESCRIPTION =
  "Answers to the most common questions about Chumlab. Installation, components, accessibility, theming, SSR, TypeScript, testing, and the AI Playground. Production-grade React components, MIT licensed.";
const PAGE_URL = "https://chumlab.com/faq";
const FAQS_PER_PAGE = 10;

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: PAGE_URL,
    inLanguage: "en",
    mainEntity: FAQ_DATA.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

const FAQ_BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://chumlab.com/",
    },
    { "@type": "ListItem", position: 2, name: "FAQ", item: PAGE_URL },
  ],
};

function trackFaqExpand(question: string, category: FaqCategory) {
  type AnalyticsWindow = Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  };
  const w = window as AnalyticsWindow;
  const payload = {
    event: "faq_expand",
    faq_category: category,
    faq_question: question,
  };
  if (Array.isArray(w.dataLayer)) w.dataLayer.push(payload);
  if (typeof w.gtag === "function") {
    w.gtag("event", "faq_expand", {
      faq_category: category,
      faq_question: question,
    });
  }
}

// Slug ↔ display-name bridge for the URL `?cat=` param.
function categorySlug(cat: FaqCategory): string {
  return cat.toLowerCase().replace(/\s+/g, "-");
}
function categoryFromSlug(slug: string | null): FaqCategory | null {
  if (!slug) return null;
  return FAQ_CATEGORIES.find((c) => categorySlug(c) === slug) ?? null;
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const Faq = () => {
  useDocumentTitle(PAGE_TITLE, PAGE_DESCRIPTION);
  useCanonical(PAGE_URL);

  const faqJsonLd = useMemo(() => buildFaqJsonLd(), []);
  useJsonLd("faq-page-jsonld", faqJsonLd);
  useJsonLd("faq-breadcrumb-jsonld", FAQ_BREADCRUMB_JSON_LD);

  const [params, setParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => params.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState<FaqCategory | null>(() =>
    categoryFromSlug(params.get("cat")),
  );
  const [currentPage, setCurrentPage] = useState(() => {
    const p = Number(params.get("page"));
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const [openId, setOpenId] = useState<string | null>(null);

  // Sync filter + page state to URL (replaceState — no history clutter).
  useEffect(() => {
    const next = new URLSearchParams();
    if (searchQuery) next.set("q", searchQuery);
    if (activeCategory) next.set("cat", categorySlug(activeCategory));
    if (currentPage > 1) next.set("page", String(currentPage));
    if (next.toString() !== params.toString()) {
      setParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeCategory, currentPage]);

  const filteredFaqs = useMemo(() => {
    let list = FAQ_DATA;
    if (activeCategory) {
      list = list.filter((f) => f.category === activeCategory);
    }
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [searchQuery, activeCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFaqs.length / FAQS_PER_PAGE),
  );
  // Clamp currentPage if filters shrink the list past the current page.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedFaqs = useMemo(() => {
    const start = (currentPage - 1) * FAQS_PER_PAGE;
    return filteredFaqs.slice(start, start + FAQS_PER_PAGE);
  }, [filteredFaqs, currentPage]);

  // Hash deep-linking — open + scroll to a specific question on mount,
  // and bump pagination so the matching question is on the visible page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = window.location.hash.replace(/^#/, "");
    if (!slug) return;
    const idx = FAQ_DATA.findIndex((f) => faqAnchor(f.question) === slug);
    if (idx === -1) return;
    setSearchQuery("");
    setActiveCategory(null);
    setOpenId(slug);
    setCurrentPage(Math.floor(idx / FAQS_PER_PAGE) + 1);
    const t = window.setTimeout(() => {
      document
        .getElementById(`faq-row-${slug}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
    return () => window.clearTimeout(t);
  }, []);

  // Smooth-scroll to the top of the FAQ list on page change. Skip the
  // initial mount so we don't hijack the hash deep-link's scroll target.
  const listRef = useRef<HTMLDivElement>(null);
  const isFirstPageRender = useRef(true);
  useEffect(() => {
    if (isFirstPageRender.current) {
      isFirstPageRender.current = false;
      return;
    }
    setOpenId(null);
    if (listRef.current) {
      const y =
        listRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage]);

  const toggle = (slug: string, faqCategory: FaqCategory, question: string) => {
    setOpenId((cur) => {
      if (cur === slug) return null;
      trackFaqExpand(question, faqCategory);
      return slug;
    });
  };

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const handleKey = (e: KeyboardEvent, idx: number, total: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      buttonRefs.current[(idx + 1) % total]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      buttonRefs.current[(idx - 1 + total) % total]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[total - 1]?.focus();
    }
  };

  // (Bottom CTA entry animations now flow through the shared <Reveal>
  // component below.)

  return (
    <div className="relative min-h-screen bg-bg-base text-fg">
      <SiteHeader />

      <main className="pt-[var(--header-height)]">
        {/* Hero — H1 + subtitle + search. Single-element max-width +
            padding so the left edge aligns with the category and list
            sections below. */}
        <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-10">
          <Reveal delay={0} translateY={12} duration={200}>
            <h1
              className="font-sans font-medium text-fg mb-6"
              style={{
                fontSize: "clamp(48px, 9vw, 96px)",
                lineHeight: 0.98,
                letterSpacing: "-0.045em",
              }}
            >
              Questions you <span className="serif-accent">might</span> have.
            </h1>
          </Reveal>
          <Reveal delay={80} translateY={8} duration={200}>
            <p className="text-[17px] text-fg-secondary leading-[1.55] max-w-[640px] mb-10">
              Everything we get asked about Chumlab installation, customization,
              accessibility, licensing. If your question isn&rsquo;t here,{" "}
              <a
                href="mailto:hello@chumlab.com?subject=Question%20about%20Chumlab&body=Hi%20Chumlab%20team%2C%0A%0A"
                className="text-fg hover:text-accent transition-colors underline-offset-4 hover:underline"
                data-track-event="email_click"
                data-track-location="faq_intro"
                data-track-target="hello"
              >
                hello@chumlab.com
              </a>{" "}
              goes to actual humans.
            </p>
          </Reveal>

          <Reveal delay={130} translateY={8} duration={200}>
            <div className="relative max-w-xl group">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none transition-colors group-focus-within:text-accent">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onBlur={(e) => {
                  const q = e.target.value.trim();
                  if (q) trackEvent("faq_search", { query: q });
                }}
                placeholder="Search questions"
                aria-label="Search FAQs"
                className="w-full pl-7 pr-4 py-3 bg-transparent text-[16px] text-fg placeholder:text-fg-muted outline-none border-b-[0.5px] border-border-soft focus:border-accent/50 transition-colors"
              />
            </div>
          </Reveal>
        </section>

        {/* Category tabs */}
        <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-8">
          <Reveal delay={180} translateY={8} duration={200}>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => {
                setActiveCategory(null);
                setCurrentPage(1);
              }}
              className="eyebrow px-3 py-1.5 transition-colors cursor-pointer"
              style={{
                background:
                  activeCategory === null
                    ? "var(--text-primary)"
                    : "transparent",
                color:
                  activeCategory === null
                    ? "var(--bg-base)"
                    : "var(--text-secondary)",
                border: "0.5px solid var(--border-faint)",
              }}
              data-track-event="faq_category_filter"
              data-track-category="all"
            >
              All
              <span className="ml-1.5 opacity-70 tabular-nums">
                {FAQ_DATA.length}
              </span>
            </button>
            {FAQ_CATEGORIES.map((cat) => {
              const count = FAQ_DATA.filter((f) => f.category === cat).length;
              if (count === 0) return null;
              const isActive = activeCategory === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    setActiveCategory(isActive ? null : cat);
                    setCurrentPage(1);
                  }}
                  className="eyebrow px-3 py-1.5 transition-colors cursor-pointer"
                  data-track-event="faq_category_filter"
                  data-track-category={cat}
                  style={{
                    background: isActive
                      ? "var(--text-primary)"
                      : "transparent",
                    color: isActive
                      ? "var(--bg-base)"
                      : "var(--text-secondary)",
                    border: "0.5px solid var(--border-faint)",
                  }}
                >
                  {cat}
                  <span className="ml-1.5 opacity-70 tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          </Reveal>
        </section>

        {/* Accordion list — paginated, FAQS_PER_PAGE per page. First 5
            items stagger 50ms apart so the last visible item lands at
            450ms; items 6+ render plain (the original 1300ms group delay
            left them invisible past the point a fast scroller had moved
            past). */}
        <section
          ref={listRef}
          className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-12"
        >
          {filteredFaqs.length === 0 ? (
            <Reveal delay={150} translateY={12} duration={200}>
              <div className="py-16 sm:py-20 text-center">
                <div className="font-serif italic font-normal text-[clamp(22px,3vw,32px)] text-fg-secondary mb-3">
                  No questions match.
                </div>
                <p className="font-sans text-[14px] text-fg-secondary max-w-[400px] mx-auto leading-[1.6]">
                  Try a different search term, clear the filter, or just email
                  us at{" "}
                  <a
                    href="mailto:hello@chumlab.com?subject=Question%20about%20Chumlab&body=Hi%20Chumlab%20team%2C%0A%0A"
                    className="text-fg hover:text-accent transition-colors underline-offset-4 hover:underline"
                    data-track-event="email_click"
                    data-track-location="faq_empty_state"
                    data-track-target="hello"
                  >
                    hello@chumlab.com
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          ) : (
            <ul className="border-t border-border-faint">
              {paginatedFaqs.map((faq, i) => {
                const slug = faqAnchor(faq.question);
                const absoluteIndex = (currentPage - 1) * FAQS_PER_PAGE + i;
                // Items 6+ render plain — at the original 1300ms group
                // delay they would have stayed hidden past the moment a
                // fast scroller already scanned past them.
                if (i >= 5) {
                  return (
                    <li
                      key={slug}
                      className="border-b border-border-faint group"
                    >
                      <FaqRow
                        ref={(el) => {
                          buttonRefs.current[i] = el;
                        }}
                        index={absoluteIndex}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openId === slug}
                        onToggle={() => toggle(slug, faq.category, faq.question)}
                        onKeyNav={(e) => handleKey(e, i, paginatedFaqs.length)}
                        answerId={`faq-answer-${slug}`}
                        rowId={`faq-row-${slug}`}
                      />
                    </li>
                  );
                }
                return (
                  <Reveal
                    key={slug}
                    as="li"
                    delay={130 + i * 30}
                    translateY={12}
                    duration={200}
                    className="border-b border-border-faint group"
                  >
                    <FaqRow
                      ref={(el) => {
                        buttonRefs.current[i] = el;
                      }}
                      index={absoluteIndex}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openId === slug}
                      onToggle={() => toggle(slug, faq.category, faq.question)}
                      onKeyNav={(e) => handleKey(e, i, paginatedFaqs.length)}
                      answerId={`faq-answer-${slug}`}
                      rowId={`faq-row-${slug}`}
                    />
                  </Reveal>
                );
              })}
            </ul>
          )}
        </section>

        {totalPages > 1 && filteredFaqs.length > 0 && (
          <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-16">
            <div className="flex justify-center">
              <Pagination
                value={currentPage}
                totalPages={totalPages}
                onValueChange={setCurrentPage}
                classes={{
                  root: "",
                  nav: "flex items-center gap-2",
                  pageButtons: "flex items-center gap-1",
                  pageButton:
                    "w-9 h-9 text-sm font-medium text-fg-tertiary hover:text-accent transition-colors flex items-center justify-center cursor-pointer",
                  activePageButton:
                    "w-9 h-9 text-sm font-medium bg-fg text-bg-base flex items-center justify-center cursor-pointer rounded-md",
                  navButton:
                    "w-9 h-9 text-fg-tertiary hover:text-accent transition-colors flex items-center justify-center cursor-pointer",
                  ellipsis:
                    "w-9 h-9 flex items-center justify-center text-fg-muted",
                  selector: "",
                  selectorButton: "",
                  selectorOption: "",
                }}
              />
            </div>
          </section>
        )}

        {/* Bottom CTA — its own scroll-into-view event so delays reset
            from 0 here. */}
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-16 sm:py-20 lg:py-24">
          <div className="rounded-xl border border-border-faint bg-bg-elevated p-7 sm:p-9 lg:p-11">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
              {/* Left — pitch */}
              <div>
                <Reveal delay={0} translateY={12} duration={200}>
                  <h2 className="font-sans text-[clamp(28px,3.6vw,40px)] font-medium tracking-[-0.03em] leading-[1.05] text-fg">
                    Pick your
                    <br />
                    <em className="font-serif italic font-normal text-accent">
                      favorite channel.
                    </em>
                  </h2>
                </Reveal>

                <Reveal delay={80} translateY={8} duration={200}>
                  <p className="font-sans text-[13px] sm:text-[14px] text-fg-secondary leading-[1.6] mt-4 max-w-[320px]">
                    Both go to the same humans. Use whichever fits the
                    question we read everything.
                  </p>
                </Reveal>
              </div>

              {/* Right — numbered channel list. Both rows extend their
                  border via -mx-2 px-2 so the top and bottom hairlines
                  span exactly the same width. */}
              <div>
                <Reveal
                  as="a"
                  delay={130}
                  translateY={12}
                  duration={200}
                  href="mailto:hello@chumlab.com?subject=Question%20about%20Chumlab&body=Hi%20Chumlab%20team%2C%0A%0A"
                  className="group flex items-center gap-4 sm:gap-5 py-4 sm:py-5 border-t border-b border-border-faint -mx-2 px-2 hover:bg-fg/[0.02] focus-visible:outline-none focus-visible:bg-accent/[0.04] transition-colors duration-200"
                  data-track-event="email_click"
                  data-track-location="faq_channels"
                  data-track-target="hello"
                >
                  <span className="font-mono text-[10px] sm:text-[11px] text-fg-muted group-hover:text-accent/70 transition-colors w-6 shrink-0 tabular-nums">
                    01
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                      <span className="font-sans text-[16px] sm:text-[17px] font-medium text-fg group-hover:text-accent transition-colors duration-200">
                        Email
                      </span>
                      <span className="font-mono text-[12px] sm:text-[13px] text-accent truncate">
                        hello@chumlab.com
                      </span>
                    </div>
                    <p className="font-sans text-[14px] sm:text-[15px] text-fg-secondary mt-1.5 leading-[1.55]">
                      Best for general questions, customization help, account or
                      licensing stuff.
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="text-fg-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                  >
                    →
                  </span>
                </Reveal>

                <Reveal
                  as="a"
                  delay={180}
                  translateY={12}
                  duration={200}
                  href="https://github.com/chumlabhq/ui/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 sm:gap-5 py-4 sm:py-5 -mx-2 px-2 hover:bg-fg/[0.02] focus-visible:outline-none focus-visible:bg-accent/[0.04] transition-colors duration-200"
                  data-track-event="external_link_click"
                  data-track-location="faq_channels"
                  data-track-target="github_issues"
                  data-track-url="https://github.com/chumlabhq/ui/issues"
                >
                  <span className="font-mono text-[10px] sm:text-[11px] text-fg-muted group-hover:text-accent/70 transition-colors w-6 shrink-0 tabular-nums">
                    02
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                      <span className="font-sans text-[16px] sm:text-[17px] font-medium text-fg group-hover:text-accent transition-colors duration-200">
                        GitHub issue
                      </span>
                      <span className="font-mono text-[12px] sm:text-[13px] text-fg-tertiary truncate">
                        github.com/chumlabhq/ui/issues
                      </span>
                    </div>
                    <p className="font-sans text-[14px] sm:text-[15px] text-fg-secondary mt-1.5 leading-[1.55]">
                      Bugs, reproducible problems, and feature requests. Pull
                      requests welcome.
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="text-fg-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                  >
                    →
                  </span>
                </Reveal>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </main>
    </div>
  );
};

interface FaqRowProps {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  onKeyNav: (e: KeyboardEvent) => void;
  answerId: string;
  rowId: string;
}

// FaqRow renders its content as a fragment; the surrounding <li> + entry
// stagger come from <Reveal as="li"> in the parent.
const FaqRow = forwardRef<HTMLButtonElement, FaqRowProps>(function FaqRow(
  { index, question, answer, isOpen, onToggle, onKeyNav, answerId, rowId },
  ref,
) {
  // Anchor span lets `/faq#<slug>` deep-links scroll-mt to the question.
  return (
    <>
      <span id={rowId} className="block scroll-mt-24" aria-hidden />
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
        onKeyDown={onKeyNav}
        className="w-full flex items-start justify-between gap-3 sm:gap-6 py-5 sm:py-6 text-left transition-colors duration-200 hover:bg-fg/[0.015] focus-visible:outline-none focus-visible:bg-accent/[0.04] -mx-4 sm:-mx-5 px-4 sm:px-5 rounded-md cursor-pointer"
        data-track-event="faq_question_toggle"
        data-track-location="faq_page"
        data-track-question={question}
        data-track-index={String(index)}
      >
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <span
            className={`font-mono text-[10px] sm:text-[11px] mt-1.5 shrink-0 transition-colors duration-200 tabular-nums ${
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
              isOpen ? "text-accent rotate-45" : "text-fg-secondary"
            }`}
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      <div
        id={answerId}
        role="region"
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
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
});

export default Faq;
