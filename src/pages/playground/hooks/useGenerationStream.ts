import { useCallback, useRef, useState } from "react";
import type { PipelineEvent } from "../types";

export type GenerationStreamStatus =
  | "idle"
  | "connecting"
  | "streaming"
  | "done"
  | "error";

interface UseGenerationStreamOptions {
  onEvent?: (event: PipelineEvent) => void;
}

// The generation stream is raw fetch + reader by design: RTK Query buffers
// whole responses and cannot surface SSE deltas as they arrive.
export function useGenerationStream({
  onEvent,
}: UseGenerationStreamOptions = {}) {
  const [status, setStatus] = useState<GenerationStreamStatus>("idle");
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const disconnect = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const connect = useCallback(
    async (url: string, init?: RequestInit) => {
      disconnect();
      const controller = new AbortController();
      abortRef.current = controller;
      setEvents([]);
      setError(null);
      setStatus("connecting");

      try {
        const res = await fetch(url, {
          ...init,
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          throw new Error(`Stream request failed (${res.status})`);
        }

        setStatus("streaming");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let separator = buffer.indexOf("\n\n");
          while (separator !== -1) {
            const frame = buffer.slice(0, separator);
            buffer = buffer.slice(separator + 2);
            separator = buffer.indexOf("\n\n");

            const data = frame
              .split("\n")
              .filter((line) => line.startsWith("data: "))
              .map((line) => line.slice(6))
              .join("\n");
            if (!data) continue;

            const event = JSON.parse(data) as PipelineEvent;
            setEvents((prev) => [...prev, event]);
            onEventRef.current?.(event);
          }
        }
        setStatus("done");
      } catch (err) {
        if (controller.signal.aborted) {
          setStatus("idle");
          return;
        }
        setError(err instanceof Error ? err.message : "Stream failed");
        setStatus("error");
      }
    },
    [disconnect]
  );

  return { status, events, error, connect, disconnect };
}
