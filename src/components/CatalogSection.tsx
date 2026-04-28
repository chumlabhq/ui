import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CountryFlag } from "./CountryFlag";
import Reveal from "./Reveal/Reveal";
import { Button } from "./ui";

/**
 * Catalog section. Five featured components in a single sticky-preview spread
 * on desktop (lg+); on mobile the preview pane is hidden entirely and each
 * row becomes a navigable link to that component's demo page.
 *
 *   Desktop  →  hover a row, the preview swaps; click also navigates.
 *   Mobile   →  tap a row, navigate straight to /<route>.
 */

type ComponentId =
  | "DatePicker"
  | "InternationalPhoneInput"
  | "Table"
  | "Input"
  | "Toast";

interface CatalogEntry {
  id: ComponentId;
  desc: string;
  route: string;
  Icon: React.ComponentType;
  index: string;
  category: string;
  descriptor: { before: string; italic: string };
}

const COMPONENTS: CatalogEntry[] = [
  {
    id: "DatePicker",
    desc: "Single, range, multi-select with calendar grid + presets",
    route: "/date-picker",
    Icon: DatePickerIcon,
    index: "01",
    category: "INPUT, TEMPORAL",
    descriptor: {
      before: "Pick a day, a range,",
      italic: "or anything in between.",
    },
  },
  {
    id: "InternationalPhoneInput",
    desc: "Country selector, format-as-you-type, validation per region",
    route: "/international-phone-input",
    Icon: PhoneIcon,
    index: "02",
    category: "INPUT, INTERNATIONAL",
    descriptor: {
      before: "A phone field that knows",
      italic: "where you're calling from.",
    },
  },
  {
    id: "Table",
    desc: "Sort, pagination, virtualization, infinite scroll",
    route: "/table",
    Icon: TableIcon,
    index: "03",
    category: "DATA, TABULAR",
    descriptor: {
      before: "Tables built",
      italic: "for the long haul.",
    },
  },
  {
    id: "Input",
    desc: "Validation, prefix slots, clearable, character counts",
    route: "/input",
    Icon: InputIcon,
    index: "04",
    category: "INPUT, FORM",
    descriptor: {
      before: "Form fields",
      italic: "that handle the hard parts.",
    },
  },
  {
    id: "Toast",
    desc: "Auto-dismiss notifications with stacking and pause on hover",
    route: "/toast",
    Icon: BellIcon,
    index: "05",
    category: "FEEDBACK, EPHEMERAL",
    descriptor: {
      before: "Notifications that show up,",
      italic: "then politely leave.",
    },
  },
];

export function CatalogSection() {
  const [active, setActive] = useState<ComponentId>("DatePicker");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  // hasMounted gates the card-deck slide transitions so the initial mount
  // doesn't animate every card in from off-screen on first paint.
  const [hasMounted, setHasMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndex = COMPONENTS.findIndex((c) => c.id === active);

  useEffect(() => {
    // Defer the flag flip past the first paint so React applies the resting
    // transforms first, then re-renders with transitions enabled.
    const id = window.requestAnimationFrame(() => setHasMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const onCopyImport = () => {
    navigator.clipboard.writeText(`import { ${active} } from "@chumlab/ui";`);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1500);
  };

  // (Entry animations now flow through the shared <Reveal> component below.)

  return (
    <section
      ref={sectionRef}
      aria-labelledby="catalog-heading"
      className="py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-cl-bg"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 sm:gap-12 lg:gap-20 xl:gap-24 items-start">
          {/* ── LEFT COLUMN: title + 5-row list + CTA. Title sits at the
                top of this column so the right-column preview pane aligns
                vertically with the title's top edge (both columns start at
                the same grid row). ───────────────────────────────────── */}
          <div className="order-2 lg:order-1 min-w-0">
            <div className="max-w-[640px] mb-10 sm:mb-12">
              <Reveal delay={50} translateY={12} duration={200}>
                <h2
                  id="catalog-heading"
                  className="font-sans text-[clamp(32px,6vw,72px)] font-medium tracking-[-0.04em] leading-[1.0] text-cl-text"
                >
                  Built once.
                  <br />
                  Used{" "}
                  <em className="font-serif italic font-normal text-cl-accent text-[1.02em]">
                    everywhere.
                  </em>
                </h2>
              </Reveal>
              <Reveal delay={100} translateY={8} duration={200}>
                <p className="mt-5 sm:mt-6 font-sans text-base sm:text-lg leading-[1.55] text-cl-text-secondary max-w-[560px]">
                  Accessible primitives, fully typed, SSR-safe.{" "}
                  <span className="hidden lg:inline">
                    Hover any component to preview it live.
                  </span>
                  <span className="lg:hidden">
                    Tap a component to see its full demo.
                  </span>
                </p>
              </Reveal>
              <h3 className="sr-only">
                Featured components in the Chumlab catalog
              </h3>
            </div>

            {/* Component list + CTA slide in together from the left to give
                the whole left column a single coordinated entry. */}
            <Reveal delay={150} translateX={-12} translateY={0} duration={200}>
              <ul className="border-t border-cl-border">
                {COMPONENTS.map((c) => {
                  const isActive = active === c.id;
                  return (
                    <li key={c.id}>
                      <Link
                        to={c.route}
                        data-active={isActive}
                        aria-label={`${c.id}: ${c.desc}. View component`}
                        onMouseEnter={() => setActive(c.id)}
                        onFocus={() => setActive(c.id)}
                        className="component-row group w-full grid grid-cols-[20px_1fr_20px] sm:grid-cols-[24px_1fr_24px] gap-3 sm:gap-4 items-center px-4 sm:px-5 py-4 sm:py-3.5 rounded-md border-b border-cl-border text-left transition-colors duration-150 hover:bg-cl-text/[0.02] data-[active=true]:bg-cl-accent/[0.04] cursor-pointer min-h-[60px] sm:min-h-[56px]"
                      >
                        <span className="text-cl-text-tertiary group-data-[active=true]:text-cl-accent transition-colors flex items-center justify-center">
                          <c.Icon />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[14px] sm:text-[15px] font-medium text-cl-text group-data-[active=true]:text-cl-accent truncate transition-colors">
                            {c.id}
                          </div>
                          <div className="text-[12px] sm:text-[13px] text-cl-text-secondary leading-snug mt-0.5 line-clamp-2">
                            {c.desc}
                          </div>
                        </div>
                        <span
                          aria-hidden
                          className="text-cl-text-disabled group-hover:text-cl-text text-sm justify-self-end transition-colors"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 sm:mt-10">
                <Button
                  variant="primary"
                  size="md"
                  as="a"
                  href="/accordion"
                  className="group"
                  endIcon={
                    <span
                      aria-hidden
                      className="group-hover:translate-x-1 transition-transform duration-150"
                    >
                      →
                    </span>
                  }
                >
                  Explore the full catalog
                </Button>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT COLUMN: horizontal card-deck preview (desktop only).
                All five cards render simultaneously in a stacked horizontal
                layout. Active card centered/in-focus; ±1 and ±2 neighbours
                peek slightly behind/beside; cards beyond ±2 sit off-stage at
                opacity 0. Hovering a different list row shifts every card to
                its new offset via a 600ms cubic-bezier transition.
              ───────────────────────────────────────────────────────────── */}
          <Reveal
            delay={200}
            translateX={16}
            translateY={0}
            duration={300}
            className="hidden lg:block order-1 lg:order-2 min-w-0"
          >
            <div className="lg:sticky lg:top-6 xl:top-8 w-full">
              <div
                className="catalog-stage relative w-full max-w-[600px] lg:ml-auto h-[500px] overflow-x-clip overflow-y-visible"
                data-mounted={hasMounted ? "true" : undefined}
                role="region"
                aria-live="polite"
                aria-label="Component preview"
                style={{ perspective: "1200px" }}
              >
                {COMPONENTS.map((entry, index) => {
                  const offset = index - activeIndex;
                  return (
                    <div
                      key={entry.id}
                      // Cards are fixed-width and centered in the stage so
                      // peek cards have visible room on either side of the
                      // active card. translateX in getCardStyle is relative
                      // to the card's own 380px width.
                      className="card-deck-item absolute top-0 left-1/2 h-full w-[380px] -ml-[190px] will-change-transform"
                      style={{
                        transformStyle: "preserve-3d",
                        ...getCardStyle(offset),
                      }}
                      aria-hidden={offset !== 0}
                    >
                      <PreviewCard
                        entry={entry}
                        isActive={offset === 0}
                        parentActiveId={active}
                        copyState={copyState}
                        onCopyImport={onCopyImport}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Self-contained: deck slide transitions + specimen fade +
                  reduced-motion overrides. The transition is gated by the
                  parent `[data-mounted=true]` attribute so the initial render
                  doesn't animate every card in from off-stage. */}
              <style>{`
                .catalog-stage[data-mounted="true"] .card-deck-item {
                  transition: transform 600ms cubic-bezier(0.32, 0.72, 0.24, 1),
                              opacity 600ms cubic-bezier(0.32, 0.72, 0.24, 1),
                              filter 600ms cubic-bezier(0.32, 0.72, 0.24, 1);
                }
                @keyframes specimen-fade-mount {
                  from { opacity: 0; transform: translateY(2px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .specimen-fade { animation: specimen-fade-mount 0.2s ease-out both; }
                @media (prefers-reduced-motion: reduce) {
                  .catalog-stage .card-deck-item { transition: none !important; filter: none !important; }
                  .specimen-fade { animation: none !important; }
                }
              `}</style>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Card-deck stage helpers ───────────────────────────────────────────── */

/**
 * Resting 3D transform + opacity + z-index per offset. Active card sits flat
 * and pushed forward via translateZ; peek cards tilt in toward the focus
 * with rotateY for a Cover-Flow-style depth effect. The stage owns the
 * `perspective` so these rotations render as real 3D, not flat scaling.
 *
 * Edge behavior is natural — when the active card is the first or last in
 * the catalog, peek cards only show on one side (the other side has no
 * preceding/following components in the array, so those slots stay empty).
 */
function getCardStyle(offset: number): React.CSSProperties {
  const absOffset = Math.abs(offset);
  if (absOffset === 0) {
    // Active: flat, scaled 1, pushed forward in 3D space, full opacity.
    return {
      transform: "translateX(0) translateZ(40px) scale(1) rotateY(0deg)",
      opacity: 1,
      zIndex: 30,
      pointerEvents: "auto",
    };
  }
  const dir = offset > 0 ? 1 : -1;
  if (absOffset === 1) {
    return {
      transform: `translateX(${dir * 35}%) translateZ(-30px) scale(0.94) rotateY(${-dir * 18}deg)`,
      opacity: 0.55,
      zIndex: 20,
      pointerEvents: "none",
      filter: "blur(0.4px)",
    };
  }
  if (absOffset === 2) {
    return {
      transform: `translateX(${dir * 62}%) translateZ(-80px) scale(0.86) rotateY(${-dir * 28}deg)`,
      opacity: 0.28,
      zIndex: 10,
      pointerEvents: "none",
      filter: "blur(0.9px)",
    };
  }
  // Defensive fallback — never reached for a 5-card cyclic deck.
  return {
    transform: `translateX(${dir * 90}%) translateZ(-140px) scale(0.78) rotateY(${-dir * 38}deg)`,
    opacity: 0,
    zIndex: 0,
    pointerEvents: "none",
    filter: "blur(1.5px)",
  };
}

/* ─── PreviewCard (one card in the deck) ────────────────────────────────── */

interface PreviewCardProps {
  entry: CatalogEntry;
  isActive: boolean;
  parentActiveId: ComponentId;
  copyState: "idle" | "copied";
  onCopyImport: () => void;
}

/**
 * Single card in the deck. Same hybrid window-chrome + specimen body + status
 * bar layout for every entry. When `isActive` is false the chrome buttons +
 * inner preview render in "frozen" mode — non-interactive snapshot — so only
 * the focused card runs handlers/state changes.
 */
function PreviewCard({
  entry,
  isActive,
  parentActiveId,
  copyState,
  onCopyImport,
}: PreviewCardProps) {
  return (
    <figure
      className="bg-cl-bg-elevated border border-cl-border rounded-lg overflow-hidden relative h-full flex flex-col"
      style={{
        // Active card: layered shadow stack — close + medium + far + outer
        // hairline ring + inset top highlight. Reads as a card floating in
        // front of the deck without resorting to a colored glow.
        boxShadow: isActive
          ? [
              "0 4px 12px -4px rgba(0,0,0,0.25)",
              "0 16px 40px -16px rgba(0,0,0,0.45)",
              "0 32px 80px -24px rgba(0,0,0,0.6)",
              "0 0 0 1px var(--border-faint)",
              "inset 0 1px 0 0 var(--border-faint)",
            ].join(", ")
          : "inset 0 1px 0 0 var(--border-faint)",
      }}
    >
      <figcaption className="sr-only">
        {isActive ? "Live" : "Inactive"} preview of the {entry.id} component
      </figcaption>

      {/* Chrome bar */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-cl-border bg-gradient-to-b from-fg/[0.02] to-transparent shrink-0">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="font-mono text-[10px] text-cl-text-disabled tracking-wider shrink-0">
            {entry.index} /
          </span>
          <span className="font-mono text-[11px] text-cl-text-tertiary shrink-0">
            @chumlab/ui
          </span>
          <span aria-hidden className="text-cl-text-disabled text-[10px] shrink-0">
            ›
          </span>
          <span className="font-mono text-[11px] text-cl-text font-medium truncate">
            {entry.id}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={isActive ? onCopyImport : undefined}
            disabled={!isActive}
            tabIndex={isActive ? 0 : -1}
            aria-label={
              isActive && copyState === "copied"
                ? "Import statement copied"
                : "Copy import statement"
            }
            className={`w-[22px] h-[22px] rounded-md border bg-transparent transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 ${
              !isActive
                ? "border-cl-border text-cl-text-disabled cursor-default"
                : copyState === "copied"
                  ? "border-[#4ade80]/40 text-[#4ade80] cursor-pointer"
                  : "border-cl-border text-cl-text-secondary hover:text-cl-text hover:border-cl-border-input-hover cursor-pointer"
            }`}
          >
            {isActive && copyState === "copied" ? (
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
              </svg>
            )}
          </button>
          <Link
            to={entry.route}
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              if (!isActive) e.preventDefault();
            }}
            aria-label={`Open ${entry.id} component docs`}
            className={`w-[22px] h-[22px] rounded-md border border-cl-border bg-transparent transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 ${
              isActive
                ? "text-cl-text-secondary hover:text-cl-text hover:border-cl-border-input-hover"
                : "text-cl-text-disabled pointer-events-none"
            }`}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Specimen body */}
      <div className="px-6 pt-6 pb-3 relative flex-1 overflow-hidden flex flex-col min-h-0">
        <div
          key={isActive ? `hdr-${parentActiveId}` : `hdr-${entry.id}-frozen`}
          className={`mb-4 relative z-10 ${isActive ? "specimen-fade" : ""}`}
        >
          <div className="font-sans text-[22px] sm:text-[24px] font-medium text-cl-text leading-[1.15] tracking-[-0.025em] max-w-[340px]">
            {entry.descriptor.before}
            <br />
            <em className="font-serif italic font-normal text-cl-accent">
              {entry.descriptor.italic}
            </em>
          </div>
        </div>
        <div className="flex-1 relative z-10 min-h-0">
          {entry.id === "DatePicker" && (
            <DatePickerPreview frozen={!isActive} />
          )}
          {entry.id === "InternationalPhoneInput" && (
            <PhonePreview frozen={!isActive} />
          )}
          {entry.id === "Table" && <TablePreview frozen={!isActive} />}
          {entry.id === "Input" && <InputPreview frozen={!isActive} />}
          {entry.id === "Toast" && (
            <ToastPreview activeId={parentActiveId} frozen={!isActive} />
          )}
        </div>
      </div>

    </figure>
  );
}

/* ─── DatePicker preview ────────────────────────────────────────────────── */

type Preset = "today" | "yesterday" | "last7" | "thisweek";

// Today is hardcoded for stability so the preview always shows the same demo.
// Update this constant if the screenshot ever needs to follow real-time.
const TODAY = { y: 2026, m: 4, d: 26 } as const; // April 26, 2026 (Sunday)

interface RangeSpec {
  startKey: number; // YYYYMMDD-style key
  endKey: number;
}

const PRESETS: Record<Preset, RangeSpec> = {
  // April 26, 2026
  today: { startKey: 20260426, endKey: 20260426 },
  // April 25, 2026
  yesterday: { startKey: 20260425, endKey: 20260425 },
  // Last 7 days inclusive: April 20–26
  last7: { startKey: 20260420, endKey: 20260426 },
  // This week (Mon-Sun): April 20–26
  thisweek: { startKey: 20260420, endKey: 20260426 },
};

function dateKey(y: number, m: number, d: number): number {
  return y * 10000 + m * 100 + d;
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

// Monday-first weekday index: Mon=0, Tue=1, ..., Sun=6.
function firstWeekdayIndex(y: number, m: number): number {
  return (new Date(y, m - 1, 1).getDay() + 6) % 7;
}

function DatePickerPreview({ frozen = false }: { frozen?: boolean }) {
  const [activePreset, setActivePreset] = useState<Preset | null>("thisweek");
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(4);
  const [customStart, setCustomStart] = useState<number | null>(null);
  const [customEnd, setCustomEnd] = useState<number | null>(null);
  // "start" = next click sets a new range start; "end" = next click sets the
  // range end relative to the current start.
  const [pickStage, setPickStage] = useState<"start" | "end">("start");

  // Effective range — preset takes precedence; otherwise derive from custom
  // selection. When neither exists (cold initial state shouldn't happen since
  // "thisweek" is the default preset), fall back to a no-op range.
  const range: RangeSpec = activePreset
    ? PRESETS[activePreset]
    : customStart !== null
      ? { startKey: customStart, endKey: customEnd ?? customStart }
      : { startKey: 0, endKey: 0 };

  const todayKey = dateKey(TODAY.y, TODAY.m, TODAY.d);

  // Build the visible 7-column grid for the current view month. Leading cells
  // come from the previous month, trailing cells from the next, so the grid
  // always lines up on Monday and ends on Sunday.
  const cells: Array<{ y: number; m: number; d: number; inMonth: boolean }> =
    [];
  const firstIdx = firstWeekdayIndex(viewYear, viewMonth);
  const monthDays = daysInMonth(viewYear, viewMonth);
  const prevMonth = viewMonth === 1 ? 12 : viewMonth - 1;
  const prevYear = viewMonth === 1 ? viewYear - 1 : viewYear;
  const prevDays = daysInMonth(prevYear, prevMonth);
  for (let i = firstIdx - 1; i >= 0; i--) {
    cells.push({ y: prevYear, m: prevMonth, d: prevDays - i, inMonth: false });
  }
  for (let d = 1; d <= monthDays; d++) {
    cells.push({ y: viewYear, m: viewMonth, d, inMonth: true });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  const trailing = totalCells - cells.length;
  const nextMonth = viewMonth === 12 ? 1 : viewMonth + 1;
  const nextYear = viewMonth === 12 ? viewYear + 1 : viewYear;
  for (let d = 1; d <= trailing; d++) {
    cells.push({ y: nextYear, m: nextMonth, d, inMonth: false });
  }

  const heads = ["M", "T", "W", "T", "F", "S", "S"];
  const rangeText = formatRangeText(range);

  const goPrevMonth = () => {
    if (frozen) return;
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    if (frozen) return;
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const onCellClick = (k: number) => {
    if (frozen) return;
    setActivePreset(null);
    if (pickStage === "start" || customStart === null) {
      setCustomStart(k);
      setCustomEnd(k);
      setPickStage("end");
      return;
    }
    if (k < customStart) {
      setCustomEnd(customStart);
      setCustomStart(k);
    } else {
      setCustomEnd(k);
    }
    setPickStage("start");
  };

  const onPresetClick = (key: Preset) => {
    if (frozen) return;
    setActivePreset(key);
    setCustomStart(null);
    setCustomEnd(null);
    setPickStage("start");
    // Snap the calendar back to the preset's anchor month so the highlighted
    // dates are actually visible.
    const startY = Math.floor(PRESETS[key].startKey / 10000);
    const startM = Math.floor((PRESETS[key].startKey % 10000) / 100);
    setViewYear(startY);
    setViewMonth(startM);
  };

  const monthLabel = `${MONTH_FULL[viewMonth]} ${viewYear}`;

  return (
    <figure className="flex flex-col h-full w-full">
      <div className="mb-3 flex items-center justify-between min-h-[16px]">
        <div className="text-[11px] font-mono text-cl-text-secondary">
          {range.startKey === 0 ? (
            <span className="text-cl-text-tertiary">Pick a date</span>
          ) : rangeText.end ? (
            <>
              <span className="text-cl-accent">{rangeText.start}</span>
              <span className="text-cl-text-tertiary mx-1.5">→</span>
              <span className="text-cl-accent">{rangeText.end}</span>
            </>
          ) : (
            <span className="text-cl-accent">{rangeText.start}</span>
          )}
        </div>
        <span className="text-[10px] font-mono text-cl-text-tertiary">
          {range.startKey === 0 ? "" : rangeText.dayCount}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px] font-medium text-cl-text">
          {monthLabel}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={goPrevMonth}
            tabIndex={frozen ? -1 : 0}
            className="w-7 h-7 rounded-md border border-cl-border-input flex items-center justify-center text-cl-text-secondary hover:text-cl-text hover:border-cl-border-input-hover transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg-elevated"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3"
              aria-hidden
            >
              <path d="M14.71 16.59 11.12 13l3.59-3.59a1 1 0 0 0-1.42-1.41l-4.29 4.29a1 1 0 0 0 0 1.42l4.29 4.29a1 1 0 0 0 1.42-1.41Z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={goNextMonth}
            tabIndex={frozen ? -1 : 0}
            className="w-7 h-7 rounded-md border border-cl-border-input flex items-center justify-center text-cl-text-secondary hover:text-cl-text hover:border-cl-border-input-hover transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg-elevated"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3 h-3"
              aria-hidden
            >
              <path d="M9.29 7.41 12.88 11l-3.59 3.59a1 1 0 0 0 1.42 1.41l4.29-4.29a1 1 0 0 0 0-1.42L10.71 6a1 1 0 0 0-1.42 1.41Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-x-1 gap-y-0 mb-1">
        {heads.map((h, i) => (
          <span
            key={`h-${i}`}
            className="font-mono text-[10px] text-cl-text-disabled uppercase tracking-wider text-center py-0.5"
          >
            {h}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-1 gap-y-0.5 text-[12px] font-medium">
        {cells.map((cell, i) => {
          const k = dateKey(cell.y, cell.m, cell.d);
          const hasRange = range.startKey > 0;
          const inRange =
            hasRange && k >= range.startKey && k <= range.endKey;
          const isStart = hasRange && k === range.startKey;
          const isEnd = hasRange && k === range.endKey;
          const isSingleDay = range.startKey === range.endKey;
          const isToday = k === todayKey;

          let radius = "rounded-md";
          if (inRange && !isSingleDay) {
            if (isStart) radius = "rounded-l-md rounded-r-none";
            else if (isEnd) radius = "rounded-r-md rounded-l-none";
            else radius = "rounded-none";
          }

          let bg = "";
          let color = cell.inMonth ? "text-cl-text" : "text-cl-text-disabled";
          let weight = "";
          let hover = "hover:bg-cl-bg-hover";
          if (inRange) {
            if (isStart || isEnd) {
              bg = "bg-cl-accent";
              color = "text-cl-bg";
              weight = "font-semibold";
              hover = "";
            } else {
              bg = "bg-cl-accent/15";
              color = "text-cl-text";
              hover = "";
            }
          }

          const cellLabel = `${MONTH_SHORT[cell.m]} ${cell.d}, ${cell.y}`;
          return (
            <button
              key={i}
              type="button"
              onClick={() => cell.inMonth && onCellClick(k)}
              disabled={!cell.inMonth}
              tabIndex={!cell.inMonth || frozen ? -1 : 0}
              aria-label={cellLabel}
              aria-pressed={inRange}
              className={`relative w-full h-7 sm:h-8 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-cl-bg-elevated ${
                cell.inMonth ? "cursor-pointer" : "cursor-default"
              } ${radius} ${bg} ${color} ${weight} ${cell.inMonth ? hover : ""}`}
            >
              {cell.d}
              {isToday && !inRange && (
                <span
                  aria-hidden
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cl-accent"
                />
              )}
              {isToday && inRange && (
                <span
                  aria-hidden
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cl-bg"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-cl-border shrink-0">
        {(
          [
            ["today", "Today"],
            ["yesterday", "Yesterday"],
            ["last7", "Last 7 days"],
            ["thisweek", "This week"],
          ] as Array<[Preset, string]>
        ).map(([key, label]) => {
          const isActive = activePreset === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onPresetClick(key)}
              tabIndex={frozen ? -1 : 0}
              className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg-elevated ${
                isActive
                  ? "border-cl-border-input-focus/40 bg-cl-accent/10 text-cl-accent"
                  : "border-cl-border-input text-cl-text-secondary hover:border-cl-border-input-hover hover:text-cl-text"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </figure>
  );
}

const MONTH_SHORT = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_FULL = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatRangeText(range: RangeSpec): {
  start: string;
  end: string;
  dayCount: string;
} {
  const startY = Math.floor(range.startKey / 10000);
  const startM = Math.floor((range.startKey % 10000) / 100);
  const startD = range.startKey % 100;
  const endY = Math.floor(range.endKey / 10000);
  const endM = Math.floor((range.endKey % 10000) / 100);
  const endD = range.endKey % 100;

  const start = `${MONTH_SHORT[startM]} ${startD}`;
  const end = `${MONTH_SHORT[endM]} ${endD}`;
  const startDate = new Date(startY, startM - 1, startD);
  const endDate = new Date(endY, endM - 1, endD);
  const dayCount =
    Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
  return {
    start,
    end: range.startKey === range.endKey ? "" : end,
    dayCount: dayCount === 1 ? "1 day" : `${dayCount} days`,
  };
}

/* ─── InternationalPhoneInput preview ───────────────────────────────────── */

const PHONE_COUNTRIES = [
  {
    code: "US",
    dial: "+1",
    name: "United States",
    formatted: "(415) 555-0142",
    e164: "+14155550142",
  },
  {
    code: "IN",
    dial: "+91",
    name: "India",
    formatted: "98765 43210",
    e164: "+919876543210",
  },
  {
    code: "GB",
    dial: "+44",
    name: "United Kingdom",
    formatted: "07911 123456",
    e164: "+447911123456",
  },
  {
    code: "DE",
    dial: "+49",
    name: "Germany",
    formatted: "1512 3456789",
    e164: "+4915123456789",
  },
  {
    code: "JP",
    dial: "+81",
    name: "Japan",
    formatted: "090-1234-5678",
    e164: "+819012345678",
  },
] as const;

type PhoneCountryCode = (typeof PHONE_COUNTRIES)[number]["code"];

const PHONE_VALID_LENGTHS: Record<PhoneCountryCode, [number, number]> = {
  US: [10, 10],
  IN: [10, 10],
  GB: [10, 11],
  DE: [10, 12],
  JP: [10, 11],
};

function PhonePreview({ frozen = false }: { frozen?: boolean }) {
  const [active, setActive] = useState<PhoneCountryCode>("US");
  const [value, setValue] = useState("");
  const country = PHONE_COUNTRIES.find((c) => c.code === active)!;
  const handleSelect = (code: PhoneCountryCode) => {
    if (!frozen) setActive(code);
  };

  const digits = value.replace(/\D/g, "");
  const [minLen, maxLen] = PHONE_VALID_LENGTHS[active];
  const isEmpty = digits.length === 0;
  const isValid = digits.length >= minLen && digits.length <= maxLen;
  const e164 = isValid ? `${country.dial}${digits}` : "";

  const borderClass = isEmpty
    ? "border-cl-border-input focus-within:border-cl-border-input-focus/40"
    : isValid
      ? "border-[#4ade80]/40"
      : "border-[#e85d5d]/40";

  return (
    <figure className="flex flex-col h-full w-full gap-5">
      <div>
        <label className="block font-medium text-[12px] uppercase tracking-wider text-cl-text-secondary mb-2">
          Phone number
        </label>
        <div className={`flex items-center rounded-md border bg-cl-bg transition-colors overflow-hidden ${borderClass}`}>
          <div className="flex items-center gap-2 px-3 py-3 border-r border-cl-border shrink-0">
            <CountryFlag code={country.code} size={16} />
            <span className="font-mono text-[13px] text-cl-text">
              {country.dial}
            </span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            readOnly={frozen}
            placeholder={country.formatted}
            aria-invalid={!isEmpty && !isValid}
            className="flex-1 min-w-0 bg-transparent px-3 py-3 text-[14px] text-cl-text font-mono tracking-wide outline-none placeholder:text-cl-text-disabled"
          />
          {!isEmpty && (
            <div className="px-3 shrink-0 flex items-center gap-1.5">
              <span
                aria-hidden
                className={`w-1.5 h-1.5 rounded-full ${
                  isValid
                    ? "bg-[#4ade80] motion-safe:animate-pulse"
                    : "bg-[#e85d5d]"
                }`}
              />
              <span
                className={`font-mono text-[10px] ${
                  isValid ? "text-[#4ade80]" : "text-[#e85d5d]"
                }`}
              >
                {isValid ? "VALID" : "INVALID"}
              </span>
            </div>
          )}
        </div>
        <div
          key={`hint-${country.code}-${isValid ? "v" : "i"}-${isEmpty ? "e" : "f"}`}
          className="mt-2 text-[11px] font-mono text-cl-text-tertiary phone-fade"
        >
          {isEmpty
            ? `Region: ${country.name} · expects ${minLen === maxLen ? minLen : `${minLen}–${maxLen}`} digits`
            : isValid
              ? `Detected: ${country.name} · E.164 format: ${e164}`
              : `Region: ${country.name} · ${digits.length} of ${minLen === maxLen ? minLen : `${minLen}–${maxLen}`} digits`}
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-cl-text-tertiary mb-2">
          Try other regions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PHONE_COUNTRIES.filter((c) => c.code !== "US").map((c) => {
            const isActive = c.code === active;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c.code)}
                tabIndex={frozen ? -1 : 0}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg-elevated ${
                  isActive
                    ? "bg-cl-accent/10 border border-cl-border-input-focus/40 text-cl-accent"
                    : "bg-cl-bg-elevated border border-cl-border hover:border-cl-border-input-hover text-cl-text-secondary hover:text-cl-text"
                }`}
              >
                <CountryFlag code={c.code} size={14} />
                <span className="font-mono">{c.dial}</span>
                <span>{c.name === "United Kingdom" ? "UK" : c.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleSelect("US")}
            tabIndex={frozen ? -1 : 0}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg-elevated ${
              active === "US"
                ? "bg-cl-accent/10 border border-cl-border-input-focus/40 text-cl-accent"
                : "bg-cl-bg-elevated border border-cl-border hover:border-cl-border-input-hover text-cl-text-secondary hover:text-cl-text"
            }`}
          >
            <CountryFlag code="US" size={14} />
            <span className="font-mono">+1</span>
            <span>US</span>
          </button>
        </div>
      </div>

      {/* Inline fade-mount keyframe so the preview is self-contained. */}
      <style>{`
        @keyframes phone-fade-mount {
          from { opacity: 0.4; }
          to { opacity: 1; }
        }
        .phone-fade { animation: phone-fade-mount 0.2s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .phone-fade { animation: none; }
        }
      `}</style>
    </figure>
  );
}

/* ─── Table preview ─────────────────────────────────────────────────────── */

interface TableRow {
  name: string;
  status: "active" | "building" | "failed";
  ownerInitials: string;
  ownerName: string;
  ownerColor: string;
  updated: string;
  selected?: boolean;
}

const TABLE_ROWS: TableRow[] = [
  {
    name: "api-gateway",
    status: "active",
    ownerInitials: "MR",
    ownerName: "Maya R.",
    ownerColor: "#14b8a6",
    updated: "2h ago",
  },
  {
    name: "auth-service",
    status: "building",
    ownerInitials: "DK",
    ownerName: "Dev K.",
    ownerColor: "#a78bfa",
    updated: "5h ago",
  },
  {
    name: "billing-engine",
    status: "active",
    ownerInitials: "AY",
    ownerName: "Adi Y.",
    ownerColor: "#fb923c",
    updated: "1d ago",
  },
  {
    name: "docs-site",
    status: "active",
    ownerInitials: "SS",
    ownerName: "Sara S.",
    ownerColor: "#f472b6",
    updated: "3d ago",
    selected: true,
  },
  {
    name: "marketing-site",
    status: "failed",
    ownerInitials: "RJ",
    ownerName: "Raj J.",
    ownerColor: "var(--accent)",
    updated: "1w ago",
  },
];

const STATUS_STYLES: Record<TableRow["status"], { dot: string; label: string; bg: string; text: string }> = {
  active: { dot: "#4ade80", label: "Active", bg: "bg-[#4ade80]/10", text: "text-[#4ade80]" },
  building: { dot: "#facc15", label: "Building", bg: "bg-[#facc15]/10", text: "text-[#facc15]" },
  failed: { dot: "#e85d5d", label: "Failed", bg: "bg-[#e85d5d]/10", text: "text-[#e85d5d]" },
};

const TABLE_TOTAL_PAGES = 50;

// A few extra row sets so flipping pages actually swaps the visible content,
// rather than just bumping a counter. The visible rows come from
// TABLE_PAGES[(page - 1) % TABLE_PAGES.length].
const TABLE_PAGES: TableRow[][] = [
  TABLE_ROWS,
  [
    {
      name: "ml-pipeline",
      status: "building",
      ownerInitials: "PN",
      ownerName: "Priya N.",
      ownerColor: "#a78bfa",
      updated: "12m ago",
    },
    {
      name: "search-index",
      status: "active",
      ownerInitials: "TK",
      ownerName: "Tom K.",
      ownerColor: "#14b8a6",
      updated: "47m ago",
    },
    {
      name: "notification-bus",
      status: "active",
      ownerInitials: "LS",
      ownerName: "Liz S.",
      ownerColor: "#fb923c",
      updated: "3h ago",
    },
    {
      name: "feature-flags",
      status: "failed",
      ownerInitials: "JC",
      ownerName: "Jin C.",
      ownerColor: "#e85d5d",
      updated: "6h ago",
      selected: true,
    },
    {
      name: "image-cdn",
      status: "active",
      ownerInitials: "VM",
      ownerName: "Vik M.",
      ownerColor: "var(--accent)",
      updated: "1d ago",
    },
  ],
  [
    {
      name: "payments-core",
      status: "active",
      ownerInitials: "AR",
      ownerName: "Ari R.",
      ownerColor: "#4ade80",
      updated: "20m ago",
    },
    {
      name: "queue-runner",
      status: "active",
      ownerInitials: "NB",
      ownerName: "Nia B.",
      ownerColor: "var(--accent)",
      updated: "1h ago",
    },
    {
      name: "session-store",
      status: "building",
      ownerInitials: "EM",
      ownerName: "Eli M.",
      ownerColor: "#facc15",
      updated: "4h ago",
    },
    {
      name: "telemetry",
      status: "active",
      ownerInitials: "KP",
      ownerName: "Kai P.",
      ownerColor: "#14b8a6",
      updated: "2d ago",
    },
    {
      name: "webhooks",
      status: "failed",
      ownerInitials: "YM",
      ownerName: "Yuna M.",
      ownerColor: "#e85d5d",
      updated: "1w ago",
    },
  ],
];

function TablePreview({ frozen = false }: { frozen?: boolean }) {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageRows = TABLE_PAGES[(page - 1) % TABLE_PAGES.length];
  const rows = [...pageRows].sort((a, b) =>
    sortDir === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name),
  );

  const goPrev = () => {
    if (frozen) return;
    setPage((p) => Math.max(1, p - 1));
  };
  const goNext = () => {
    if (frozen) return;
    setPage((p) => Math.min(TABLE_TOTAL_PAGES, p + 1));
  };
  const atStart = page === 1;
  const atEnd = page === TABLE_TOTAL_PAGES;

  return (
    <figure className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-cl-border">
        <span className="font-mono text-[10px] uppercase tracking-wider text-cl-text-tertiary">
          Page {page} of {TABLE_TOTAL_PAGES}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous page"
            onClick={goPrev}
            disabled={atStart}
            tabIndex={frozen ? -1 : 0}
            className="w-6 h-6 rounded border border-cl-border hover:border-cl-border-input-hover flex items-center justify-center text-cl-text-tertiary hover:text-cl-text transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-cl-border disabled:hover:text-cl-text-tertiary"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3"
              aria-hidden
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next page"
            onClick={goNext}
            disabled={atEnd}
            tabIndex={frozen ? -1 : 0}
            className="w-6 h-6 rounded border border-cl-border hover:border-cl-border-input-hover flex items-center justify-center text-cl-text-tertiary hover:text-cl-text transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-cl-border disabled:hover:text-cl-text-tertiary"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3"
              aria-hidden
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-cl-border">
              <th className="font-mono text-[10px] font-medium uppercase tracking-wider text-cl-text-tertiary pb-2 pl-1 pr-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!frozen) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                  }}
                  tabIndex={frozen ? -1 : 0}
                  className="flex items-center gap-1 hover:text-cl-text transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 rounded-md"
                >
                  Name
                  <span
                    aria-hidden
                    className="inline-flex flex-col leading-none ml-0.5"
                  >
                    <svg
                      viewBox="0 0 12 6"
                      fill="currentColor"
                      className={`w-2 h-1 transition-colors ${
                        sortDir === "asc"
                          ? "text-cl-accent"
                          : "text-cl-text-disabled"
                      }`}
                      aria-hidden
                    >
                      <path d="M6 0 0 6h12Z" />
                    </svg>
                    <svg
                      viewBox="0 0 12 6"
                      fill="currentColor"
                      className={`w-2 h-1 mt-px transition-colors ${
                        sortDir === "desc"
                          ? "text-cl-accent"
                          : "text-cl-text-disabled"
                      }`}
                      aria-hidden
                    >
                      <path d="M0 0h12L6 6Z" />
                    </svg>
                  </span>
                </button>
              </th>
              <th className="font-mono text-[10px] font-medium uppercase tracking-wider text-cl-text-tertiary pb-2 px-3">
                Status
              </th>
              <th className="hidden sm:table-cell font-mono text-[10px] font-medium uppercase tracking-wider text-cl-text-tertiary pb-2 px-3">
                Owner
              </th>
              <th className="font-mono text-[10px] font-medium uppercase tracking-wider text-cl-text-tertiary pb-2 px-3 text-right pr-1">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {rows.map((row) => {
              const status = STATUS_STYLES[row.status];
              return (
                <tr
                  key={row.name}
                  data-selected={row.selected || undefined}
                  className="border-b border-cl-border hover:bg-cl-text/[0.02] transition-colors cursor-pointer data-[selected=true]:bg-cl-accent/[0.04]"
                >
                  <td className="py-2.5 pl-1 pr-3 text-cl-text font-medium font-mono truncate max-w-[150px] sm:max-w-none">
                    {row.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}
                    >
                      <span
                        aria-hidden
                        className="w-1 h-1 rounded-full"
                        style={{ background: status.dot }}
                      />
                      {status.label}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell py-2.5 px-3 text-cl-text">
                    {row.ownerName}
                  </td>
                  <td className="py-2.5 px-3 text-right pr-1 text-cl-text-secondary font-mono text-[11px] whitespace-nowrap">
                    {row.updated}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/* ─── Input preview ─────────────────────────────────────────────────────── */

const BIO_MAX = 200;
const PASSWORD_MIN = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function InputPreview({ frozen = false }: { frozen?: boolean }) {
  const [email, setEmail] = useState("adi@chumlab.com");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(
    "Building accessible component primitives for React.",
  );

  const emailValid = EMAIL_RE.test(email);
  const emailEmpty = email.length === 0;
  const passwordEmpty = password.length === 0;
  const passwordValid = password.length >= PASSWORD_MIN;
  const bioCount = Math.min(bio.length, BIO_MAX);

  const emailBorder = emailEmpty
    ? "border-cl-border-input focus-within:border-cl-border-input-focus/45"
    : emailValid
      ? "border-cl-border-input-focus/45"
      : "border-[#e85d5d]/40";
  const passwordBorder = passwordEmpty
    ? "border-cl-border-input focus-within:border-cl-border-input-focus/45"
    : passwordValid
      ? "border-[#4ade80]/40"
      : "border-[#e85d5d]/40";

  return (
    <figure className="flex flex-col h-full w-full gap-4">
      {/* Email */}
      <div>
        <label className="block font-medium text-[12px] uppercase tracking-wider text-cl-text-secondary mb-2">
          Email
        </label>
        <div className={`flex items-center rounded-md border bg-cl-bg transition-colors ${emailBorder}`}>
          <span className="pl-3 pr-2 text-cl-text-tertiary flex items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6Zm-2 0-8 5-8-5h16Zm0 12H4V8l8 5 8-5v10Z" />
            </svg>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={frozen}
            placeholder="you@example.com"
            className="flex-1 min-w-0 bg-transparent py-2.5 pr-3 text-[14px] text-cl-text placeholder:text-cl-text-disabled outline-none"
          />
          {!emailEmpty && emailValid && (
            <span className="pr-3 text-[#4ade80]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z" />
              </svg>
            </span>
          )}
          {!emailEmpty && !emailValid && (
            <span className="pr-3 text-[#e85d5d]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
              </svg>
            </span>
          )}
        </div>
        <div
          className={`mt-1.5 text-[11px] break-words ${
            !emailEmpty && !emailValid
              ? "text-[#e85d5d]"
              : "text-cl-text-secondary"
          }`}
        >
          {!emailEmpty && !emailValid
            ? "Enter a valid email address."
            : "We’ll never share your email."}
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block font-medium text-[12px] uppercase tracking-wider text-cl-text-secondary mb-2">
          Password
        </label>
        <div className={`flex items-center rounded-md border bg-cl-bg transition-colors ${passwordBorder}`}>
          <span className="pl-3 pr-2 text-cl-text-tertiary flex items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2ZM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6Zm9 14H6V10h12v10Zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z" />
            </svg>
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            readOnly={frozen}
            placeholder="At least 8 characters"
            className="flex-1 min-w-0 bg-transparent py-2.5 pr-3 text-[14px] text-cl-text placeholder:text-cl-text-disabled outline-none"
          />
          {!passwordEmpty && passwordValid && (
            <span className="pr-3 text-[#4ade80]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z" />
              </svg>
            </span>
          )}
          {!passwordEmpty && !passwordValid && (
            <span className="pr-3 text-[#e85d5d]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
              </svg>
            </span>
          )}
        </div>
        <div
          className={`mt-1.5 text-[11px] break-words ${
            !passwordEmpty && !passwordValid
              ? "text-[#e85d5d]"
              : "text-cl-text-secondary"
          }`}
        >
          {passwordEmpty
            ? `Use ${PASSWORD_MIN} or more characters.`
            : passwordValid
              ? "Strong enough."
              : `Must be at least ${PASSWORD_MIN} characters.`}
        </div>
      </div>

      {/* Bio — textarea with counter */}
      <div>
        <label className="block font-medium text-[12px] uppercase tracking-wider text-cl-text-secondary mb-2">
          Bio
        </label>
        <div className="rounded-md border border-cl-border-input bg-cl-bg focus-within:border-cl-border-input-focus/40 transition-colors">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
            readOnly={frozen}
            rows={2}
            placeholder="Tell us about yourself"
            className="w-full bg-transparent px-3 py-2.5 text-[13px] text-cl-text placeholder:text-cl-text-disabled outline-none resize-none"
          />
          <div className="flex justify-end px-3 pb-2 -mt-1">
            <span
              className={`font-mono text-[10px] ${
                bioCount === BIO_MAX ? "text-[#facc15]" : "text-cl-text-tertiary"
              }`}
            >
              {bioCount} / {BIO_MAX}
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Toast preview ─────────────────────────────────────────────────────── */

type ToastId = "success" | "info" | "comment";

const TOAST_DEFAULTS: ToastId[] = ["success", "info", "comment"];

const TOAST_DATA: Record<
  ToastId,
  { dot: string; title: string; body: string; meta: string; pulse?: boolean; action?: string }
> = {
  success: {
    dot: "#4ade80",
    title: "Saved successfully",
    body: "Changes synced to the team.",
    meta: "just now",
    pulse: true,
  },
  info: {
    dot: "var(--accent)",
    title: "Upload complete",
    body: "branding-v2.zip · 18.4 MB",
    meta: "8s ago",
  },
  comment: {
    dot: "var(--text-primary)",
    title: "New comment from Maya",
    body: "On the auth migration task.",
    meta: "",
    action: "View",
  },
};

/**
 * Polished empty state for the Toast preview. Inlined directly inside
 * `ToastPreview` so the Replay button sits in the same simple flex flow as
 * the dismiss buttons — no absolute layers above it that could swallow
 * clicks. Kept as a function for readability, but takes no props beyond the
 * replay handler.
 */
function ToastEmptyContent({ onReplay }: { onReplay: () => void }) {
  return (
    <div
      className="flex flex-col h-full w-full items-center justify-center text-center gap-3"
    >
      <div className="max-w-[260px]">
        <div className="font-sans text-[18px] font-medium text-cl-text leading-[1.2] tracking-[-0.02em]">
          You&rsquo;re all
          <br />
          <em className="font-serif italic font-normal text-cl-accent">
            caught up.
          </em>
        </div>
        <p className="font-sans text-[12px] text-cl-text-secondary leading-[1.5] mt-2">
          Toasts auto-dismiss after their lifetime. They came, they showed,
          they left.
        </p>
      </div>

      <button
        type="button"
        onClick={onReplay}
        className="group inline-flex items-center gap-2 mt-1 px-3.5 py-2 rounded-md border border-cl-border-input bg-cl-bg hover:border-cl-border-input-focus/40 hover:bg-cl-accent/[0.04] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg-elevated"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3.5 h-3.5 text-cl-text-secondary group-hover:text-cl-accent transition-colors"
          aria-hidden
        >
          <path d="M17.65 6.35A8 8 0 1 0 19.73 14H17.65a6 6 0 1 1-1.46-6.24L13 11h7V4Z" />
        </svg>
        <span className="font-sans text-[12px] font-medium text-cl-text group-hover:text-cl-text transition-colors">
          Replay sequence
        </span>
      </button>
    </div>
  );
}

function ToastPreview({
  activeId,
  frozen = false,
}: {
  activeId: ComponentId;
  frozen?: boolean;
}) {
  const [visible, setVisible] = useState<ToastId[]>([...TOAST_DEFAULTS]);

  // Reset whenever activeId transitions INTO "Toast" (re-hover), but
  // only on the active deck slot. Frozen peek cards keep their last
  // state. setState-during-render with a state-based prev tracker
  // satisfies both react-hooks/set-state-in-effect and react-hooks/refs.
  const [prevActiveId, setPrevActiveId] = useState(activeId);
  if (prevActiveId !== activeId) {
    setPrevActiveId(activeId);
    if (!frozen && activeId === "Toast") {
      setVisible([...TOAST_DEFAULTS]);
    }
  }

  const dismiss = useCallback(
    (id: ToastId) => {
      if (frozen) return;
      setVisible((prev) => prev.filter((t) => t !== id));
    },
    [frozen],
  );

  // Stable reference so the empty-state keyboard effect doesn't re-bind on
  // every parent render, and the click handler keeps the same identity.
  const replay = useCallback(() => {
    setVisible([...TOAST_DEFAULTS]);
  }, []);

  if (visible.length === 0) {
    return <ToastEmptyContent onReplay={replay} />;
  }

  return (
    <figure className="flex flex-col h-full w-full justify-end items-end gap-2">
      {visible.map((id) => {
        const t = TOAST_DATA[id];
        return (
          <div
            key={id}
            className="toast-row w-full max-w-none min-[380px]:max-w-[280px] flex items-start gap-3 bg-cl-bg-elevated border border-cl-border rounded-md p-3"
          >
            <span
              aria-hidden
              className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                t.pulse ? "motion-safe:animate-pulse" : ""
              }`}
              style={{ background: t.dot }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-cl-text truncate">
                {t.title}
              </div>
              <div className="text-[12px] text-cl-text-secondary mt-0.5 truncate">
                {t.body}
              </div>
              {t.meta && (
                <div className="text-[10px] font-mono text-cl-text-disabled mt-1.5">
                  {t.meta}
                </div>
              )}
              {t.action && (
                <button
                  type="button"
                  className="text-[11px] font-medium text-cl-accent hover:text-[#7eb1ff] transition-colors mt-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 rounded-md px-1"
                >
                  {t.action} →
                </button>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(id)}
              className="text-cl-text-disabled hover:text-cl-text-secondary transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent/40 rounded-md"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12Z" />
              </svg>
            </button>
          </div>
        );
      })}
    </figure>
  );
}

/* ─── Filled list-row icons (currentColor) ──────────────────────────────── */

function DatePickerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[18px] h-[18px] sm:w-5 sm:h-5"
      aria-hidden
    >
      <path d="M19 4h-1V3a1 1 0 0 0-2 0v1H8V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8h16Zm0-10H4V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 2 0V6h8v1a1 1 0 0 0 2 0V6h1a1 1 0 0 1 1 1Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[18px] h-[18px] sm:w-5 sm:h-5"
      aria-hidden
    >
      <path d="M21.41 15.84a14.93 14.93 0 0 1-3.77-.59 1 1 0 0 0-1 .25l-2.2 2.2a14.55 14.55 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1A14.93 14.93 0 0 1 9.71 4.1 1 1 0 0 0 8.72 3H4.59A1 1 0 0 0 3.6 4.13 17 17 0 0 0 19.87 20.4 1 1 0 0 0 21 19.41v-2.58a1 1 0 0 0-.59-1Z" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[18px] h-[18px] sm:w-5 sm:h-5"
      aria-hidden
    >
      <path d="M21 3H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1ZM10 19H4v-4h6Zm0-6H4V9h6Zm10 6h-8v-4h8Zm0-6h-8V9h8ZM4 7V5h16v2Z" />
    </svg>
  );
}

function InputIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[18px] h-[18px] sm:w-5 sm:h-5"
      aria-hidden
    >
      <path d="M14 2h-1.5a3.5 3.5 0 0 0-2.5 1 3.5 3.5 0 0 0-2.5-1H6a1 1 0 0 0 0 2h1.5A1.5 1.5 0 0 1 9 5.5v13A1.5 1.5 0 0 1 7.5 20H6a1 1 0 0 0 0 2h1.5a3.5 3.5 0 0 0 2.5-1 3.5 3.5 0 0 0 2.5 1H14a1 1 0 0 0 0-2h-1.5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 12.5 4H14a1 1 0 0 0 0-2Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[18px] h-[18px] sm:w-5 sm:h-5"
      aria-hidden
    >
      <path d="M21 17.39h-1V11a8 8 0 0 0-6.92-7.93V2a1 1 0 0 0-2 0v1.07A8 8 0 0 0 4 11v6.39H3a1 1 0 0 0 0 2h6a3 3 0 0 0 6 0h6a1 1 0 0 0 0-2ZM12 21a1 1 0 0 1-1-1.56h2A1 1 0 0 1 12 21Z" />
    </svg>
  );
}

export default CatalogSection;
