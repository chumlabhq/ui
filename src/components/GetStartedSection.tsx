import { useEffect, useRef } from "react";
import Reveal from "./Reveal/Reveal";
import { Button } from "./ui";

/**
 * Get Started — editorial timeline (left) synchronized with an auto-running
 * terminal (right) on a single 12-second CSS keyframe loop. Animations pause
 * when the section leaves the viewport via IntersectionObserver. All keyframes
 * + .paused/reduced-motion overrides live in src/index.css.
 *
 * Single .blink-cursor exists in the DOM (end of block 3, "✓ Running on
 * localhost:3000"). Blocks 1 and 2 end with a bare `$` so two cursors are
 * never visible at once when the tape is between blocks.
 *
 * Entry animation goes through the shared <Reveal> component below. The
 * IntersectionObserver in this file is preserved because it gates the
 * continuous loop's play/pause, not entry timing.
 */

const HOWTO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to install and use Chumlab UI",
  description:
    "Install Chumlab UI as a React component library — three steps, no config needed.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Install",
      text: "Install the Chumlab UI package using your preferred package manager. Tree-shakable, zero runtime dependencies, around 4.2kb gzipped per import.",
      url: "https://chumlab.com/#get-started",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Import",
      text: "Import only the components you need from @chumlab/ui. First-class TypeScript types and full tree-shaking — unused components disappear in your build.",
      url: "https://chumlab.com/#get-started",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Use",
      text: "Drop Chumlab components into your JSX. Accessible, themed, SSR-safe — ready for production from line one.",
      url: "https://chumlab.com/#get-started",
    },
  ],
};

export function GetStartedSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Pause every keyframe in this section while it's outside the viewport.
  // CSS does the actual pausing via `.paused .term-tape { animation-play-state: paused }`
  // and equivalents for the timeline + step elements. Threshold 0.15 with
  // rootMargin -10% bottom keeps animations running until the section is
  // visibly gone, not just scrolled a hair past the fold.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            node.classList.remove("paused");
          } else {
            node.classList.add("paused");
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(node);
    // Start in paused state so animations don't run before the user sees
    // the section — IntersectionObserver fires asynchronously on mount.
    node.classList.add("paused");
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="get-started"
      aria-labelledby="get-started-heading"
      className="relative py-20 sm:py-24 md:py-28 lg:py-32 bg-bg-base"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HOWTO_JSONLD).replace(/<\//g, "<\\/"),
        }}
      />

      <div className="mx-auto max-w-[1180px] px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-15 items-center">
          {/* LEFT — editorial timeline */}
          <div>
            <Reveal delay={50} translateY={12} duration={200}>
              <h2
                id="get-started-heading"
                className="font-sans text-[clamp(32px,6vw,72px)] font-medium tracking-[-0.04em] leading-[1.0] text-fg"
              >
                From{" "}
                <em className="font-serif italic font-normal text-accent">
                  npm install
                </em>
                <br />
                to first render.
              </h2>
            </Reveal>

            <Reveal delay={100} translateY={8} duration={200}>
              <p className="mt-5 sm:mt-6 mb-9 font-sans text-base sm:text-lg leading-[1.55] text-fg/55 max-w-[580px]">
                Three steps. No bundler config, no PostCSS plugins, no fragile
                scaffolding.
              </p>
            </Reveal>

            <Reveal delay={150} translateY={12} duration={200}>
            <div className="relative pl-7 mb-8">
              {/* Static dim line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-fg/[0.08]" />

              {/* Animated progress line */}
              <div
                className="timeline-progress absolute left-[7px] top-2 w-px bg-gradient-to-b from-accent to-accent/40"
                style={{ height: "0%" }}
              />

              {/* Step 1 */}
              <div className="step step-1 relative pb-7">
                <div className="marker absolute -left-[28.5px] top-[5px] w-4 h-4 rounded-full bg-bg-base border-[1.5px] border-accent/40 flex items-center justify-center z-10">
                  <div className="dot w-1.5 h-1.5 rounded-full bg-accent/40" />
                </div>
                <div className="step-eyebrow font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40 mb-1.5">
                  01 / Install
                </div>
                <h3 className="font-sans text-[18px] font-medium tracking-[-0.025em] leading-[1.3] text-fg mb-2">
                  Pick your{" "}
                  <em className="step-em font-serif italic font-normal text-fg/70">
                    package manager.
                  </em>
                </h3>
                <p className="font-sans text-[14px] text-fg/55 leading-[1.6] max-w-[380px]">
                  Tree-shakable, zero runtime dependencies. Around 4.2kb gzipped
                  per import.
                </p>
              </div>

              {/* Step 2 */}
              <div className="step step-2 relative pb-7">
                <div className="marker absolute -left-[28.5px] top-[5px] w-4 h-4 rounded-full bg-bg-base border-[1.5px] border-accent/40 flex items-center justify-center z-10">
                  <div className="dot w-1.5 h-1.5 rounded-full bg-accent/40" />
                </div>
                <div className="step-eyebrow font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40 mb-1.5">
                  02 / Import
                </div>
                <h3 className="font-sans text-[18px] font-medium tracking-[-0.025em] leading-[1.3] text-fg mb-2">
                  Pull in{" "}
                  <em className="step-em font-serif italic font-normal text-fg/70">
                    only what you use.
                  </em>
                </h3>
                <p className="font-sans text-[14px] text-fg/55 leading-[1.6] max-w-[380px]">
                  First-class TypeScript types. Unused components disappear in
                  your build.
                </p>
              </div>

              {/* Step 3 */}
              <div className="step step-3 relative">
                <div className="marker absolute -left-[28.5px] top-[5px] w-4 h-4 rounded-full bg-bg-base border-[1.5px] border-accent/40 flex items-center justify-center z-10">
                  <div className="dot w-1.5 h-1.5 rounded-full bg-accent/40" />
                </div>
                <div className="step-eyebrow font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40 mb-1.5">
                  03 / Use
                </div>
                <h3 className="font-sans text-[18px] font-medium tracking-[-0.025em] leading-[1.3] text-fg mb-2">
                  Drop it in.{" "}
                  <em className="step-em font-serif italic font-normal text-fg/70">
                    You're done.
                  </em>
                </h3>
                <p className="font-sans text-[14px] text-fg/55 leading-[1.6] max-w-[380px]">
                  Accessible, themed, SSR-safe — ready for production from line
                  one.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3.5">
              <Button
                variant="primary"
                size="md"
                as="a"
                href="/introduction"
                endIcon={<span aria-hidden="true">→</span>}
                data-track-event="cta_click"
                data-track-location="home_get_started"
                data-track-target="read_docs"
              >
                Read the full docs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                as="a"
                href="https://github.com/chumlabhq/ui"
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="external_link_click"
                data-track-location="home_get_started"
                data-track-target="github_repo"
                data-track-url="https://github.com/chumlabhq/ui"
                startIcon={
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                }
              >
                chumlab/ui
              </Button>
            </div>
            </Reveal>
          </div>

          {/* RIGHT — synchronized terminal */}
          <Reveal
            delay={150}
            translateY={0}
            duration={300}
            scale={0.97}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(91,155,255,0.1),transparent_65%)] rounded-[28px] pointer-events-none"
            />

            <div className="relative z-10 bg-bg-elevated border border-border-faint rounded-xl overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-border-faint">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-fg/[0.18]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-fg/[0.18]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-fg/[0.18]" />
                </div>
                <span className="font-mono text-[11px] text-fg/45 ml-1.5">
                  ~/my-app
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[9px] text-[color:var(--success)] tracking-[0.12em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] animate-pulse" />
                  <span>RUNNING</span>
                </span>
              </div>

              <div
                role="img"
                aria-label="Animated demo showing the three steps to install Chumlab"
                className="px-6 py-6 h-[250px] sm:h-[290px] overflow-hidden relative font-mono text-[12px] sm:text-[13px] leading-[1.85] text-fg/85"
              >
                <div className="term-tape">
                  {/* Block 1: Install (height 120px) */}
                  <div className="h-[120px] flex flex-col">
                    <div className="h-[24px] flex items-center">
                      <span className="text-fg/40">$</span>
                      &nbsp;npm i{" "}
                      <span className="text-accent">@chumlab/ui</span>
                    </div>
                    <div className="h-[24px] flex items-center text-fg/50">
                      added 1 package in 1.8s
                    </div>
                    <div className="h-[24px] flex items-center">
                      <span className="text-[color:var(--success)]">+</span>&nbsp;
                      <span className="text-fg/50">
                        @chumlab/ui@2.4.1
                      </span>
                      &nbsp;<span className="text-[color:var(--success)]">✓</span>
                    </div>
                    <div className="h-[24px] flex items-center text-fg/35">
                      # installed. tree-shakable.
                    </div>
                    <div className="h-[24px] flex items-center">
                      <span className="text-fg/40">$</span>
                    </div>
                  </div>

                  {/* Block 2: Import (height 120px) */}
                  <div className="h-[120px] flex flex-col">
                    <div className="h-[24px] flex items-center">
                      <span className="text-fg/40">$</span>&nbsp;cat
                      App.tsx
                    </div>
                    <div className="h-[24px] flex items-center">
                      <span className="text-[color:var(--code-keyword)]">import</span>&nbsp;{"{ "}
                      <span className="text-[color:var(--code-fn)]">Button</span>,{" "}
                      <span className="text-[color:var(--code-fn)]">Input</span>
                      {" }"}
                    </div>
                    <div className="h-[24px] flex items-center">
                      &nbsp;&nbsp;
                      <span className="text-[color:var(--code-keyword)]">from</span>&nbsp;
                      <span className="text-[color:var(--code-string)]">"@chumlab/ui"</span>;
                    </div>
                    <div className="h-[24px] flex items-center text-fg/35">
                      # types resolved automatically
                    </div>
                    <div className="h-[24px] flex items-center">
                      <span className="text-fg/40">$</span>
                    </div>
                  </div>

                  {/* Block 3: Use (height 120px) — ONLY this block has the blink cursor */}
                  <div className="h-[120px] flex flex-col">
                    <div className="h-[24px] flex items-center">
                      &lt;<span className="text-[color:var(--code-fn)]">Button</span>&nbsp;
                      <span className="text-[color:var(--code-fn)]">variant</span>=
                      <span className="text-[color:var(--code-string)]">"primary"</span>&gt;
                    </div>
                    <div className="h-[24px] flex items-center">
                      &nbsp;&nbsp;Get started →
                    </div>
                    <div className="h-[24px] flex items-center">
                      &lt;/<span className="text-[color:var(--code-fn)]">Button</span>&gt;
                    </div>
                    <div className="h-[24px] flex items-center">
                      <span className="text-fg/40">$</span>&nbsp;npm run
                      dev
                    </div>
                    <div className="h-[24px] flex items-center">
                      <span className="text-[color:var(--success)]">
                        ✓ Running on localhost:3000
                      </span>
                      <span className="blink-cursor inline-block w-[7px] h-[13px] bg-accent align-[-1px] ml-[2px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
