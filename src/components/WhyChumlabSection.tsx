import Reveal from "./Reveal/Reveal";

/**
 * Six reasons teams choose Chumlab. Hairline-grid card layout, filled icons
 * in accent blue. Entry animation goes through the shared <Reveal> primitive:
 * H2 + lede stagger first, then cards 1-3 across the first row stagger
 * 100ms apart, and cards 4-6 reveal together as a single group to avoid the
 * cascading-wave effect on a 6-card grid. `prefers-reduced-motion: reduce`
 * is handled inside <Reveal>.
 */
const CARDS: Array<{
  title: string;
  body: string;
  icon: React.ReactNode;
}> = [
  {
    title: "Accessibility built in, not bolted on",
    body: "Every primitive is WCAG 2.1 AA compliant out of the box. Full keyboard navigation, focus management, and screen-reader announcements work the moment you import a component. Pass accessibility audits without retrofitting a single line.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden>
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 4a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 12 6Zm5 6h-3v6a1 1 0 0 1-2 0v-3h-1v3a1 1 0 0 1-2 0v-6H7a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2Z" />
      </svg>
    ),
  },
  {
    title: "Themeable to the bone",
    body: "Override anything with a className. Use CSS variables for design tokens. Go fully unstyled when you want full control. Your design system stays yours. We just give you the hard parts pre-built.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden>
        <path d="M19 11h-1.382l-3.793-3.793a2 2 0 0 0-2.828 0L4.293 13.91a2 2 0 0 0 0 2.828l5.122 5.122a2 2 0 0 0 2.828 0l6.964-6.964A2 2 0 0 0 19.793 13H21a1 1 0 0 0 0-2h-2ZM12.586 6.621 16.964 11H6.207l6.379-4.379ZM21 18a2 2 0 1 1-2-2 2 2 0 0 1 2 2Z" />
      </svg>
    ),
  },
  {
    title: "Production-ready, day one",
    body: "Controlled and uncontrolled modes for every component. SSR-safe rendering for Next.js. Strict TypeScript types you can actually rely on. Battle-tested edge cases so you ship with confidence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden>
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm4.768 8.64-5.5 5.5a1 1 0 0 1-1.414 0l-2.5-2.5a1 1 0 1 1 1.414-1.414l1.793 1.793 4.793-4.793a1 1 0 0 1 1.414 1.414Z" />
      </svg>
    ),
  },
  {
    title: "Built for speed",
    body: "Zero runtime dependencies. Tree-shakeable imports. Components average 2.1 KB gzipped. Your bundle stays small, your Lighthouse score stays green, and your users never wait.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden>
        <path d="M16.5 11h-4l3-7H8.4a1 1 0 0 0-.99.86L6.04 14.86a1 1 0 0 0 .99 1.14H11l-1.5 6 7.79-9.39a1 1 0 0 0-.79-1.61Z" />
      </svg>
    ),
  },
  {
    title: "Works with your stack",
    body: "First-class support for React 18+, Next.js 14+, TypeScript, and Tailwind CSS v4. Drop into existing projects without conflicts. No global CSS pollution, no surprise side effects.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden>
        <path d="M20 12h-1V8a2 2 0 0 0-2-2h-4V5a3 3 0 1 0-6 0v1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1a3 3 0 1 1 0 6H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4v-1a3 3 0 1 1 6 0v1h4a2 2 0 0 0 2-2v-4h1a3 3 0 1 0 0-6Z" />
      </svg>
    ),
  },
  {
    title: "Open source, MIT licensed",
    body: "Free forever. Public roadmap. Pull requests welcome. Built in the open with the React community on GitHub. Fork it, audit it, ship it without a license fee or a sales call.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" aria-hidden>
        <path d="M9.4 16.6 4.8 12l4.6-4.6a1 1 0 1 0-1.4-1.4l-5.3 5.3a1 1 0 0 0 0 1.4l5.3 5.3a1 1 0 1 0 1.4-1.4Zm5.2 0 4.6-4.6-4.6-4.6a1 1 0 1 1 1.4-1.4l5.3 5.3a1 1 0 0 1 0 1.4l-5.3 5.3a1 1 0 1 1-1.4-1.4Z" />
      </svg>
    ),
  },
];

export function WhyChumlabSection() {
  return (
    <section
      aria-labelledby="why-chumlab-heading"
      className="bg-cl-bg py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        {/* Header — H2 and lede stagger separately so the eye lands on the
            headline first, then the supporting line. */}
        <div className="mb-10 sm:mb-12 md:mb-16 max-w-[720px]">
          <Reveal delay={0} translateY={12} duration={200}>
            <h2
              id="why-chumlab-heading"
              className="font-sans text-[clamp(32px,6vw,72px)] font-medium tracking-[-0.04em] leading-[1.0] text-cl-text"
            >
              Stop rebuilding the{" "}
              <em className="font-serif italic font-normal text-cl-accent text-[1.02em]">
                same
              </em>{" "}
              UI.
            </h2>
          </Reveal>
          <Reveal delay={50} translateY={8} duration={200}>
            <p className="mt-5 sm:mt-6 font-sans text-base sm:text-lg leading-[1.55] text-cl-text-secondary max-w-[580px]">
              Every team builds the same dropdown, modal, and date picker
              over and over again. We built them once accessibly, with full
              TypeScript, and ready for production. So your team can ship
              features instead of plumbing.
            </p>
          </Reveal>
          {/* Indexable-but-invisible heading so search engines pick up the
              section's intent without a visible eyebrow tag. */}
          <h3 className="sr-only">
            Six reasons teams choose Chumlab over building components from
            scratch
          </h3>
        </div>

        {/* Six-card grid. The bg-cl-bg-hover on the parent shows through
            the 1px gap to draw hairline rules between cards at every
            breakpoint. All six cards stagger 40ms apart from 300ms to
            500ms so the late cards are still visible quickly enough that
            a fast scroller doesn't see a blank lower row. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-cl-bg-hover gap-px overflow-hidden rounded-md">
          {CARDS.map((card, i) => (
            <Reveal
              key={card.title}
              as="article"
              delay={i * 20}
              translateY={16}
              duration={200}
              className="group bg-cl-bg hover:bg-cl-bg-elevated p-7 sm:p-8 md:p-9 flex flex-col gap-4 transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-cl-accent">
                {card.icon}
              </div>
              <h3 className="font-sans text-lg sm:text-xl font-medium text-cl-text tracking-[-0.01em] leading-tight">
                {card.title}
              </h3>
              <p className="font-sans text-sm sm:text-base leading-[1.6] text-cl-text-secondary">
                {card.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChumlabSection;
