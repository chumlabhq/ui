import { useEffect, useRef } from "react";
import { PREVIEW_PATH, postToPreview, subscribeToPreview } from "../../../lib/preview/runtime";
import type { VerifyError } from "../types";

// Render layer of the responsive gate (Phase 11). A hidden, off-screen preview
// iframe renders the delivered code, then is sized to each viewport width and
// asked to measure its document overflow. Because it's a real iframe, media
// queries reflect the true width, so a correctly-responsive component never
// false-fails. Overflow is reported as a render VerifyError, which re-enters the
// existing bounded fix loop (blocking) — the visible PreviewFrame owns the lamp;
// this instance only measures.
const WIDTHS = [360, 1024] as const;
const TOLERANCE = 2;

interface ResponsiveProbeProps {
  code: string | null;
  onFail: (error: VerifyError) => void;
}

function waitFrames(n: number): Promise<void> {
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => (++i >= n ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  });
}

export default function ResponsiveProbe({ code, onFail }: ResponsiveProbeProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  // Each distinct code string is measured once — re-checking on every re-render
  // (or when re-opening the same chat) would be wasted work and noisy fixes.
  const checkedRef = useRef<string | null>(null);
  const onFailRef = useRef(onFail);
  useEffect(() => {
    onFailRef.current = onFail;
  });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !code || checkedRef.current === code) return;

    let cancelled = false;
    let ready = false;
    let resolveMeasure: ((m: { scrollWidth: number; clientWidth: number }) => void) | null = null;

    const measure = () =>
      new Promise<{ scrollWidth: number; clientWidth: number } | null>((resolve) => {
        resolveMeasure = resolve;
        postToPreview(frame, { type: "measure" });
        // Never hang the gate on a missing reply.
        window.setTimeout(() => resolve(null), 1000);
      });

    const run = async () => {
      if (cancelled) return;
      postToPreview(frame, { type: "render", code });
      await waitFrames(3); // let the mount + first layout settle
      const failures: string[] = [];
      for (const w of WIDTHS) {
        if (cancelled) return;
        frame.style.width = `${w}px`;
        await waitFrames(3); // reflow at the new viewport width
        const m = await measure();
        if (m && m.scrollWidth > m.clientWidth + TOLERANCE) {
          failures.push(
            `Overflows horizontally at ${w}px (content ${m.scrollWidth}px > viewport ${m.clientWidth}px). Make it fluid so it reflows at mobile width.`
          );
        }
      }
      checkedRef.current = code;
      if (!cancelled && failures.length) {
        onFailRef.current({ kind: "render", message: failures.join(" ") });
      }
    };

    const unsubscribe = subscribeToPreview(frame, (message) => {
      if (message.type === "ready") {
        ready = true;
        void run();
      }
      if (message.type === "measured" && resolveMeasure) {
        resolveMeasure({ scrollWidth: message.scrollWidth, clientWidth: message.clientWidth });
        resolveMeasure = null;
      }
    });

    // The iframe may already be ready from a previous code (it persists across
    // checks) — kick off immediately in that case.
    if (ready) void run();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [code]);

  return (
    <iframe
      ref={frameRef}
      src={PREVIEW_PATH}
      title="Responsive probe"
      aria-hidden
      tabIndex={-1}
      sandbox="allow-scripts allow-same-origin"
      style={{
        position: "absolute",
        left: -99999,
        top: 0,
        width: 360,
        height: 900,
        border: 0,
        visibility: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}
