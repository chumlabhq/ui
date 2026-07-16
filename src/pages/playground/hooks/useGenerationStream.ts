import { useCallback, useRef, useState } from "react";
import type { PipelineEvent, PlaygroundGateInfo } from "../types";

export type GenerationStreamStatus =
  | "idle"
  | "connecting"
  | "streaming"
  | "done"
  | "error";

interface UseGenerationStreamOptions {
  onEvent?: (event: PipelineEvent) => void;
  onDone?: () => void;
}

// The generation stream is raw fetch + reader by design: RTK Query buffers
// whole responses and cannot surface SSE deltas as they arrive.
export function useGenerationStream({
  onEvent,
  onDone,
}: UseGenerationStreamOptions = {}) {
  const [status, setStatus] = useState<GenerationStreamStatus>("idle");
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gate, setGate] = useState<PlaygroundGateInfo | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onEventRef = useRef(onEvent);
  const onDoneRef = useRef(onDone);
  onEventRef.current = onEvent;
  onDoneRef.current = onDone;

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
      setGate(null);
      setStatus("connecting");

      try {
        const res = await fetch(url, {
          ...init,
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          let message = `Stream request failed (${res.status})`;
          try {
            const body = (await res.json()) as {
              message?: string;
              details?: PlaygroundGateInfo;
            };
            if (body.details?.code) setGate(body.details);
            if (body.message) message = body.message;
          } catch {
            // Non-JSON error body; keep the status-based message.
          }
          throw new Error(message);
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
        onDoneRef.current?.();
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

  return { status, events, error, gate, connect, disconnect };
}
