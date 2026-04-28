/**
 * Typographic blog cover. Replaces AI thumbnail illustrations with a solid
 * color block + the article title rendered large in Instrument Serif italic.
 * Deterministic per `seed` so the same article gets the same cover every time.
 */

const PALETTES = [
  { bg: "var(--bg-elevated)", fg: "var(--text-primary)" },
  { bg: "var(--bg-base)", fg: "var(--accent)" },
  { bg: "var(--accent)", fg: "var(--bg-base)" },
  { bg: "var(--bg-overlay)", fg: "var(--text-primary)" },
] as const;

function pickPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

interface TypographicCoverProps {
  title: string;
  seed: string;
  className?: string;
  /** Optional eyebrow text rendered small in the top-left corner. */
  eyebrow?: string;
}

export function TypographicCover({
  title,
  seed,
  className = "",
  eyebrow,
}: TypographicCoverProps) {
  const { bg, fg } = pickPalette(seed);
  return (
    <div
      className={`relative w-full h-full flex flex-col justify-end p-5 sm:p-7 overflow-hidden ${className}`}
      style={{ background: bg, color: fg }}
    >
      {eyebrow && (
        <div
          className="absolute top-5 left-5 sm:top-7 sm:left-7 text-[10.5px] tracking-[0.14em] uppercase font-sans"
          style={{ color: fg, opacity: 0.7 }}
        >
          {eyebrow}
        </div>
      )}
      <div
        className="font-serif italic leading-[0.95] tracking-[-0.02em]"
        style={{
          color: fg,
          fontSize: "clamp(28px, 5vw, 44px)",
          textWrap: "balance" as React.CSSProperties["textWrap"],
        }}
      >
        {title}
      </div>
    </div>
  );
}

export default TypographicCover;
