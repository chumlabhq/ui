// Pre-launch "stealth mode" announcement strip. Shared between the marketing
// SiteHeader and the AI Playground chrome so the copy stays in one place.
// Colors are intentionally hard-coded so the contrast is identical across
// light and dark surfaces.
export default function AnnouncementBanner() {
  return (
    <div
      className="text-[#050608] bg-gradient-to-r from-[#7eb1ff] via-[#5b9bff] to-[#7eb1ff]"
      role="status"
      aria-label="Pre-launch announcement"
    >
      <div className="w-full px-3 sm:px-6 md:px-8">
        {/* Mobile: stacked column. Pill anchors the top, icon + full wrapped
            message sit below. */}
        <div className="sm:hidden flex flex-col items-center gap-2 py-2.5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#050608] text-[#7eb1ff] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7eb1ff] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7eb1ff]" />
            </span>
            Live soon
          </span>
          <div className="flex items-start justify-center gap-1.5 max-w-[280px]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 15 15"
              fill="currentColor"
              className="shrink-0 announcement-sparkle mt-[3px]"
              aria-hidden
            >
              <path d="M7.5 0L8.85 5.65L14.5 7L8.85 8.35L7.5 14L6.15 8.35L0.5 7L6.15 5.65L7.5 0Z" />
            </svg>
            <p className="text-[12px] font-semibold tracking-[-0.01em] leading-snug">
              You found us early. We're in stealth mode. Our GitHub repo and npm
              package aren't public yet.
            </p>
          </div>
        </div>

        {/* sm+: single horizontal line with separator dots. */}
        <div className="hidden sm:flex items-center justify-center gap-3.5 h-12 text-[14px] md:text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="currentColor"
            className="shrink-0 announcement-sparkle"
            aria-hidden
          >
            <path d="M7.5 0L8.85 5.65L14.5 7L8.85 8.35L7.5 14L6.15 8.35L0.5 7L6.15 5.65L7.5 0Z" />
          </svg>

          <span className="hidden lg:inline">You found us early.</span>
          <span className="hidden lg:inline opacity-50" aria-hidden>·</span>
          <span>We're still in stealth mode.</span>
          <span className="opacity-50" aria-hidden>·</span>
          <span>Our GitHub repo and npm package aren't public yet.</span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#050608] text-[#7eb1ff] px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] uppercase shrink-0">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7eb1ff] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7eb1ff]" />
            </span>
            Live soon
          </span>
        </div>
      </div>
    </div>
  );
}
