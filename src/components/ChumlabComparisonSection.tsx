/**
 * Chumlab vs. the typical setup — five comparison rows, alternating
 * left/right on desktop. Each row has a TODAY pain side and a WITH
 * CHUMLAB solution side. Hovering or keyboard-focusing a row reveals
 * a 3-bullet detail panel under each side and recolors the icon /
 * italic emphases to accent blue.
 *
 * Pure Tailwind: `group` + `group-hover:` + `group-focus-within:`
 * driven, no animation library. The reduced-motion override lives
 * in src/index.css under `.comparison-row` rules.
 *
 * Copy is hyphen-free per spec ("open source", "pre built",
 * "well maintained", "production ready", "real world", etc.).
 */

import type { ReactNode } from "react";
import Reveal from "./Reveal/Reveal";
import { Button } from "./ui";

type Row = {
  icon: ReactNode;
  question: ReactNode;
  todayAnswer: string;
  todayBullets: [string, string, string];
  chumlabHeadline: ReactNode;
  chumlabAnswer: string;
  chumlabBullets: [string, string, string];
};

const Italic = ({ children }: { children: ReactNode }) => (
  <em className="font-serif italic font-normal text-fg/55 transition-colors duration-[400ms] ease-[cubic-bezier(0.32,0.72,0.24,1)] group-hover:text-accent group-focus-within:text-accent">
    {children}
  </em>
);

const ItalicLight = ({ children }: { children: ReactNode }) => (
  <em className="font-serif italic font-normal text-fg/70 transition-colors duration-[400ms] ease-[cubic-bezier(0.32,0.72,0.24,1)] group-hover:text-accent group-focus-within:text-accent">
    {children}
  </em>
);

const IconLightning = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13 2L4.09 13.55a.75.75 0 0 0 .59 1.21H10v7.32a.75.75 0 0 0 1.32.49l8.76-11.39a.75.75 0 0 0-.59-1.21H14V2.75A.75.75 0 0 0 13 2z" />
  </svg>
);

const IconPalette = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 22a10 10 0 0 1-7.07-17.07A10 10 0 1 1 12 22zm0-14a6 6 0 0 0 0 12 1 1 0 0 0 1-1 .92.92 0 0 0-.27-.69 1 1 0 0 1 .71-1.71h1.56A4.73 4.73 0 0 0 19.94 13a4.54 4.54 0 0 0-.69-3.31C18.13 7.94 16 6 12 6z" />
    <circle cx="6.5" cy="11.5" r="1.5" />
    <circle cx="9.5" cy="7.5" r="1.5" />
    <circle cx="14.5" cy="7.5" r="1.5" />
  </svg>
);

const IconSparkle = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2l2.4 5.4L20 8.6l-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.6-1.2L12 2z" />
  </svg>
);

const IconWrench = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21.7 13.35l-1 1.06-2.11-2.11 1.05-1.06a.55.55 0 0 1 .77 0l1.29 1.29c.21.22.21.6 0 .82M12 18.94l6.07-6.07 2.11 2.11L14.11 21H12v-2.06M19 9c-.71 0-1.37.21-1.93.56l-1.79-1.79V4l-3-3-3 3v3.77L7.5 6.6c-.46-.39-1-.6-1.5-.6-1.66 0-3 1.34-3 3 0 .73.27 1.4.7 1.91L7.5 14.5h2v2L11.91 19h2.18l-.59-.59 6.07-6.07L21 13.77c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L19 9z" />
  </svg>
);

const IconAlert = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1zm1 16h-2v-2h2zm0-4h-2V7h2z" />
  </svg>
);

const ROWS: Row[] = [
  // Row 1 — left to right
  {
    icon: IconLightning,
    question: (
      <>
        Speed to <Italic>launch.</Italic>
      </>
    ),
    todayAnswer:
      "Weeks of plumbing before a single feature ships. Every project starts with the same UI groundwork, all over again.",
    todayBullets: [
      "Wire up libraries, build missing pieces, fix browser quirks",
      "Real product work waits behind the boring foundation",
      "Launch dates slip, scope shrinks, founders compromise",
    ],
    chumlabHeadline: (
      <>
        Skip the foundation. <ItalicLight>Build the product.</ItalicLight>
      </>
    ),
    chumlabAnswer:
      "Install once, ship the same day. The boring work is already done so you can spend your time on the parts only you can build.",
    chumlabBullets: [
      "Install in under a minute, no setup ritual",
      "Thirty pre built components ready to drop in",
      "Hit your launch date, ship the polish that matters",
    ],
  },
  // Row 2 — right to left (flipped on lg)
  {
    icon: IconPalette,
    question: (
      <>
        Making it <Italic>look like yours.</Italic>
      </>
    ),
    todayAnswer:
      "Every library themes differently. You write override CSS in three places, fight specificity, and accept things don't quite match.",
    todayBullets: [
      "CSS overrides in wrappers, fights with library defaults",
      "Brand never quite lands. Buttons match, dropdowns don't",
      "Reskin per client takes days, not hours",
    ],
    chumlabHeadline: (
      <>
        Match any brand. <ItalicLight>In an afternoon.</ItalicLight>
      </>
    ),
    chumlabAnswer:
      "Change one color, the entire library follows. Your design system stays yours. Chumlab just gives you a sturdy foundation underneath.",
    chumlabBullets: [
      "One token system controls thirty components",
      "Reskin per client, per brand, per launch",
      "Looks custom, feels custom, ships in hours",
    ],
  },
  // Row 3 — left to right
  {
    icon: IconSparkle,
    question: (
      <>
        Going from idea <Italic>to working UI.</Italic>
      </>
    ),
    todayAnswer:
      "You sketch on paper. Translate to Figma. Hand to a designer. Wait. Then a developer rebuilds it in code. The whole loop takes a week.",
    todayBullets: [
      "Idea to mockup to handoff to code: four steps, four delays",
      "Stakeholder feedback adds days for every revision",
      "Quick experiments cost the same as real features",
    ],
    chumlabHeadline: (
      <>
        Type a prompt. <ItalicLight>Get real React.</ItalicLight>
      </>
    ),
    chumlabAnswer:
      "Describe what you want or drop a screenshot. The AI Playground gives you production ready code, built on Chumlab primitives, in seconds.",
    chumlabBullets: [
      "Describe in plain English or paste any screenshot",
      "Output is real, working React. Not mockups",
      "Test ten ideas in the time it took to brief one",
    ],
  },
  // Row 4 — right to left (flipped on lg)
  {
    icon: IconWrench,
    question: (
      <>
        Keeping things <Italic>running.</Italic>
      </>
    ),
    todayAnswer:
      "Six libraries, six release schedules, six places where things might break. A breaking change in one means a debugging session in your code.",
    todayBullets: [
      "Dependency upgrades that conflict with each other",
      "Security patches that ripple through the stack",
      "Hours every month spent maintaining the foundation",
    ],
    chumlabHeadline: (
      <>
        One package. <ItalicLight>One upgrade.</ItalicLight>
      </>
    ),
    chumlabAnswer:
      "A single library on a single release schedule. Predictable, well maintained, never six things breaking at once.",
    chumlabBullets: [
      "One predictable package, one changelog to read",
      "Predictable upgrades, no surprise breaking changes",
      "Time you spent on dependency drama: zero",
    ],
  },
  // Row 5 — left to right
  {
    icon: IconAlert,
    question: (
      <>
        When something <Italic>breaks in production.</Italic>
      </>
    ),
    todayAnswer:
      "A bug nobody saw in QA. Could be your code, could be one of six libraries, could be how they interact. Three engineers, half a day of triage.",
    todayBullets: [
      "Bugs hide between library boundaries. Hard to reproduce",
      "Edge cases on mobile, accessibility, internationalization found by users",
      "The cost of a missed bug is real, expensive, and public",
    ],
    chumlabHeadline: (
      <>
        Edge cases, <ItalicLight>already solved.</ItalicLight>
      </>
    ),
    chumlabAnswer:
      "Every component is tested across browsers, devices, and accessibility tools before it ships. The boring failure modes are someone else's job.",
    chumlabBullets: [
      "Tested across thousands of real world projects",
      "Accessibility, mobile, internationalization built in",
      "Production bugs from primitives: vanishingly rare",
    ],
  },
];

const COMPARISON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Chumlab vs. the typical setup",
  description:
    "How Chumlab compares to the typical approach of gluing together open source libraries for a React component foundation.",
  about: [
    { "@type": "Thing", name: "React component library comparison" },
    { "@type": "Thing", name: "Chumlab UI" },
  ],
  mainEntity: {
    "@type": "ItemList",
    name: "Five comparisons between Chumlab and the typical React UI setup",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Speed to launch",
        description:
          "Today: weeks of plumbing before a single feature ships. With Chumlab: install once, ship the same day.",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Making it look like yours",
        description:
          "Today: each library themes differently, override CSS, fight specificity. With Chumlab: change one color, thirty components follow.",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Going from idea to working UI",
        description:
          "Today: sketch, mockup, handoff, code. With Chumlab: type a prompt or paste a screenshot, get real React in seconds.",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Keeping things running",
        description:
          "Today: six libraries, six release schedules. With Chumlab: one package, one changelog, predictable upgrades.",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "When something breaks in production",
        description:
          "Today: bugs hide between library boundaries. With Chumlab: edge cases tested across thousands of real world projects.",
      },
    ],
  },
};

const ROW_CLASSES =
  "comparison-row group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start py-9 border-t border-fg/[0.06] last:border-b last:border-fg/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0.24,1)] focus-within:bg-fg/[0.015] outline-none";

const ICON_CLASSES =
  "row-icon w-[38px] h-[38px] rounded-lg bg-fg/[0.04] border border-fg/10 text-fg/70 flex items-center justify-center mb-1 transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0.24,1)] group-hover:bg-accent/[0.12] group-hover:border-accent/40 group-hover:text-accent group-hover:scale-105 group-focus-within:bg-accent/[0.12] group-focus-within:border-accent/40 group-focus-within:text-accent group-focus-within:scale-105";

const TODAY_DETAIL_CLASSES =
  "row-detail font-mono text-[11px] leading-[1.65] text-[rgba(232,93,93,0.65)] max-h-0 opacity-0 overflow-hidden transition-all duration-[450ms] ease-[cubic-bezier(0.32,0.72,0.24,1)] group-hover:max-h-[110px] group-hover:opacity-100 group-hover:mt-3 group-focus-within:max-h-[110px] group-focus-within:opacity-100 group-focus-within:mt-3";

const CHUMLAB_DETAIL_CLASSES =
  "row-detail font-mono text-[11px] leading-[1.65] text-accent/85 max-h-0 opacity-0 overflow-hidden transition-all duration-[450ms] ease-[cubic-bezier(0.32,0.72,0.24,1)] group-hover:max-h-[110px] group-hover:opacity-100 group-hover:mt-3 group-focus-within:max-h-[110px] group-focus-within:opacity-100 group-focus-within:mt-3";

export function ChumlabComparisonSection() {
  return (
    <section
      id="chumlab-comparison"
      aria-labelledby="comparison-heading"
      className="relative py-20 sm:py-24 md:py-28 lg:py-32 bg-bg-base"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(COMPARISON_JSONLD).replace(/<\//g, "<\\/"),
        }}
      />

      <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Header block — typography matches sibling sections
            (WhyChumlabSection, CatalogSection): h2 uses
            text-[clamp(32px,6vw,72px)] and the lede uses
            text-base sm:text-lg with mt-5 sm:mt-6. */}
        <div className="mb-16 max-w-[720px]">
          <Reveal delay={0} translateY={12} duration={200}>
            <h2
              id="comparison-heading"
              className="font-sans font-medium text-[clamp(32px,6vw,72px)] leading-[1.0] tracking-[-0.04em] text-fg"
            >
              Chumlab, vs.
              <br />
              the typical{" "}
              <em className="font-serif italic font-normal text-accent">
                setup.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={80} translateY={8} duration={200}>
            <p className="mt-5 sm:mt-6 font-sans text-base sm:text-lg leading-[1.55] text-fg/60 max-w-[580px]">
              Most teams glue together a stack of open source pieces, then spend
              weeks making them work together. Here's what changes when you don't
              have to.
            </p>
          </Reveal>
        </div>

        {/* 5 Rows — TODAY always on the left, WITH CHUMLAB always on
            the right. No alternating flip on any breakpoint. Tight 60ms
            stagger keeps every row under the 500ms delay cap so a user
            scrolling fast doesn't hit blank rows below. */}
        <div className="comparison-rows">
          {ROWS.map((row, idx) => (
            <Reveal
              key={idx}
              delay={130 + idx * 30}
              translateY={12}
              duration={200}
              className={ROW_CLASSES}
              tabIndex={0}
              role="group"
              aria-label={`Comparison ${idx + 1} of 5`}
            >
              {/* LEFT — Icon, Question, TODAY label, description */}
              <div>
                <div className={ICON_CLASSES + " mb-4"}>{row.icon}</div>
                <h3 className="font-sans font-medium text-[28px] sm:text-[30px] leading-[1.2] tracking-[-0.03em] text-fg mb-3">
                  {row.question}
                </h3>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgba(232,93,93,0.85)] mb-2 inline-flex items-center gap-1.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-[rgba(232,93,93,0.85)]" />
                  Today
                </div>
                <p className="font-sans text-base sm:text-[17px] leading-[1.6] text-fg/60">
                  {row.todayAnswer}
                </p>
                <div className={TODAY_DETAIL_CLASSES}>
                  {"• "}
                  {row.todayBullets[0]}
                  <br />
                  {"• "}
                  {row.todayBullets[1]}
                  <br />
                  {"• "}
                  {row.todayBullets[2]}
                </div>
              </div>

              {/* RIGHT — Headline, WITH CHUMLAB label, description.
                  Mirrors the TODAY block's order (title before label).
                  Top padding on lg+ aligns the h4 with the left side's
                  h3 (icon 38px + mb-4 16px = 54px). */}
              <div className="pt-0 lg:pt-[54px]">
                <h4 className="font-sans font-medium text-[24px] sm:text-[26px] leading-[1.25] tracking-[-0.025em] text-fg mb-3">
                  {row.chumlabHeadline}
                </h4>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2 inline-flex items-center gap-1.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-accent" />
                  With Chumlab
                </div>
                <p className="font-sans text-base sm:text-[17px] leading-[1.6] text-fg/65">
                  {row.chumlabAnswer}
                </p>
                <div className={CHUMLAB_DETAIL_CLASSES}>
                  {"• "}
                  {row.chumlabBullets[0]}
                  <br />
                  {"• "}
                  {row.chumlabBullets[1]}
                  <br />
                  {"• "}
                  {row.chumlabBullets[2]}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Closer — large two-line statement on the left, "Browse all
            components" CTA on the right. <br/> forces the italic
            second sentence to its own line at every breakpoint. */}
        <Reveal
          delay={280}
          translateY={12}
          duration={200}
          className="mt-16 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12"
        >
          <p className="font-sans font-medium text-[clamp(32px,4vw,44px)] leading-[1.15] tracking-[-0.035em] text-fg max-w-[720px]">
            ~120 hours per project, recovered.
            <br />
            <em className="font-serif italic font-normal text-accent">
              Spend them on what only you can build.
            </em>
          </p>
          <Button
            variant="primary"
            size="md"
            as="a"
            href="/accordion"
            className="shrink-0"
            endIcon={<span aria-hidden="true">→</span>}
          >
            Browse all components
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
