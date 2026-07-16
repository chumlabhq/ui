import { useEffect, useRef, useState } from "react";
import {
  PREVIEW_PATH,
  postToPreview,
  subscribeToPreview,
  type PreviewTheme,
} from "../../../lib/preview/runtime";
import type { VerifyError } from "../types";

interface PreviewFrameProps {
  code: string | null;
  theme?: PreviewTheme;
  onRendered?: () => void;
  onRenderError?: (error: VerifyError) => void;
  className?: string;
}

export default function PreviewFrame({
  code,
  theme = "dark",
  onRendered,
  onRenderError,
  className,
}: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);
  const onRenderedRef = useRef(onRendered);
  const onRenderErrorRef = useRef(onRenderError);

  useEffect(() => {
    onRenderedRef.current = onRendered;
    onRenderErrorRef.current = onRenderError;
  });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    return subscribeToPreview(frame, (message) => {
      if (message.type === "ready") setReady(true);
      if (message.type === "rendered") onRenderedRef.current?.();
      if (message.type === "error") onRenderErrorRef.current?.(message.error);
    });
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !ready) return;
    postToPreview(frame, { type: "setTheme", theme });
  }, [ready, theme]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !ready || code == null) return;
    postToPreview(frame, { type: "render", code });
  }, [ready, code]);

  return (
    <iframe
      ref={frameRef}
      src={PREVIEW_PATH}
      title="Component preview"
      // allow-same-origin is required for the import map and vendor module
      // fetches; the executed code comes from our own pipeline, not third
      // parties.
      sandbox="allow-scripts allow-same-origin"
      className={className}
    />
  );
}
