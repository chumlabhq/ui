import { useState, useMemo, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/Accordion";
import { FaqLogoIcon } from "../components/FaqLogoIcon";
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

// ─── Page metadata + schema builders ───────────────────────────────────────

const PAGE_TITLE = "Frequently Asked Questions";
const PAGE_DESCRIPTION =
  "Answers to the most common questions about Chumlab UI — installation, components, accessibility, theming, SSR, TypeScript, testing, and the AI Playground. Production-grade React components, MIT licensed.";
const PAGE_URL = "https://chumlab.com/faq";

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: PAGE_URL,
    inLanguage: "en",
    mainEntity: FAQ_DATA.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
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
    {
      "@type": "ListItem",
      position: 2,
      name: "FAQ",
      item: PAGE_URL,
    },
  ],
};

// Fire a `dataLayer` / `gtag` event when a question is expanded so the FAQ
// engagement is trackable in GA4 / GTM without coupling to either library.
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

// ─── Component ──────────────────────────────────────────────────────────────

const Faq = () => {
  useDocumentTitle(PAGE_TITLE, PAGE_DESCRIPTION);
  useCanonical(PAGE_URL);

  // Build the FAQPage JSON-LD from the current data on mount so schema and
  // rendered content never drift apart. memoised because FAQ_DATA is static.
  const faqJsonLd = useMemo(() => buildFaqJsonLd(), []);
  useJsonLd("faq-page-jsonld", faqJsonLd);
  useJsonLd("faq-breadcrumb-jsonld", FAQ_BREADCRUMB_JSON_LD);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory | null>(
    null,
  );
  // Lazy initial state so a /faq#slug deep link opens the matching item on
  // the first render — avoids a cascading setState() inside useEffect.
  const [openItem, setOpenItem] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const slug = window.location.hash.replace(/^#/, "");
    if (!slug) return null;
    return FAQ_DATA.some((f) => faqAnchor(f.question) === slug) ? slug : null;
  });

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

  // Deep-link support: /faq#how-do-i-install-chumlab-ui smooth-scrolls to
  // the corresponding row (openItem has already been seeded from the hash).
  useEffect(() => {
    if (!openItem) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(openItem);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
    return () => window.clearTimeout(timer);
    // Intentionally runs once on mount; subsequent openItem changes are user
    // clicks whose native focus handling already scrolls the row into view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccordionChange = (next: string | string[] | null) => {
    const value = typeof next === "string" ? next : null;
    setOpenItem(value);
    if (!value) return;
    const faq = FAQ_DATA.find((f) => faqAnchor(f.question) === value);
    if (faq) trackFaqExpand(faq.question, faq.category);
  };

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white selection:bg-blue-600/30 overflow-x-hidden">
      {/* Ambient glow — matches the blog pages so the theme reads as one site */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-blue-600/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-violet-600/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10">
        <SiteHeader />

        {/* ── MAIN ── */}
        <main className="pt-[84px]">
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
                aria-label="Search frequently asked questions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 text-[15px] outline-none focus:border-blue-500/30 focus:bg-white/[0.06] transition-all duration-300"
              />
            </div>

            {/* Category filters — narrows both the list and the live count */}
            <nav
              aria-label="FAQ categories"
              className="mt-8 flex flex-wrap gap-2 justify-center"
            >
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-200 border cursor-pointer ${
                  activeCategory === null
                    ? "bg-blue-500/15 border-blue-500/30 text-blue-200"
                    : "bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                All
                <span className="ml-1.5 text-[11px] opacity-70 tabular-nums">
                  {FAQ_DATA.length}
                </span>
              </button>
              {FAQ_CATEGORIES.map((cat) => {
                const count = FAQ_DATA.filter((f) => f.category === cat).length;
                if (count === 0) return null;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? null : cat)}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-200 border cursor-pointer ${
                      isActive
                        ? "bg-blue-500/15 border-blue-500/30 text-blue-200"
                        : "bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {cat}
                    <span className="ml-1.5 text-[11px] opacity-70 tabular-nums">
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>

            {(searchQuery || activeCategory) && (
              <p
                className="text-center text-[13px] text-white/45 mt-4"
                role="status"
                aria-live="polite"
              >
                {filteredFaqs.length}{" "}
                {filteredFaqs.length === 1 ? "question" : "questions"} match
                {filteredFaqs.length === 1 ? "es" : ""}
                {activeCategory ? ` in ${activeCategory}` : ""}
                {searchQuery ? ` for "${searchQuery}"` : ""}
              </p>
            )}
          </div>
        </section>

        {/* ══ FAQ ACCORDION ══ */}
        <section className="px-4 sm:px-6 lg:px-10 pt-4 pb-12">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                value={openItem ?? undefined}
                onValueChange={handleAccordionChange}
                classes={{
                  root: "w-full rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.02]",
                  item: "border-b border-white/[0.06] last:border-b-0",
                  // `group` is required so the iconWrapper below can read the
                  // trigger's `data-state` via `group-data-[state=open]`.
                  trigger:
                    "group flex w-full items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left text-[15px] font-medium text-white/90 transition-all duration-300 hover:bg-white/[0.04] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-inset",
                  triggerInner: "flex-1 text-left",
                  content:
                    "px-4 sm:px-6 py-4 sm:py-5 text-[15px] text-gray-400 leading-relaxed",
                  contentWrapper:
                    "overflow-hidden transition-[max-height,opacity,visibility]",
                  icon: "shrink-0 text-white/40",
                  // 360° spin on open; CSS transitions interpolate the full
                  // turn because the angle keys move between 0deg ↔ 360deg
                  // (not 0deg ↔ 0deg), so every toggle is a visible rotation.
                  iconWrapper:
                    "shrink-0 transition-transform duration-500 ease-out group-data-[state=open]:rotate-[360deg]",
                  subtitle: "",
                  triggerLeft: "",
                  triggerRight: "",
                  contentInner: "",
                  heading: "",
                }}
              >
                {filteredFaqs.map((faq) => {
                  const slug = faqAnchor(faq.question);
                  return (
                    <div key={slug} id={slug} className="scroll-mt-24">
                      <AccordionItem value={slug}>
                        <AccordionTrigger
                          expandedIcon={<FaqLogoIcon />}
                          iconAnimation="none"
                        >
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    </div>
                  );
                })}
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

          <SiteFooter />
        </main>
      </div>
    </div>
  );
};

export default Faq;
