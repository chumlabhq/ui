import { useCallback } from "react";
import { Button } from "../../components/ui";
import { useGenerationStream } from "./hooks/useGenerationStream";
import type { PipelineEvent } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Playground() {
  const { status, events, error, connect } = useGenerationStream({
    onEvent: useCallback((event: PipelineEvent) => {
      if (import.meta.env.DEV) {
        console.debug("[playground] sse event", event);
      }
    }, []),
  });

  const runStreamTest = () => {
    void connect(`${API_BASE_URL}/generation/stream-test`);
  };

  return (
    <main className="min-h-screen bg-bg-base text-fg">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="eyebrow">AI Playground</p>
        <h1 className="mt-3 text-4xl font-medium">
          Build with <span className="serif-accent">Chumlab.</span>
        </h1>
        <p className="mt-4 text-fg-secondary">
          The generation pipeline mounts here. This shell verifies the SSE
          transport against the frozen event schema.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button variant="secondary" size="sm" onClick={runStreamTest}>
            Run stream test
          </Button>
          <span className="text-sm text-fg-tertiary">
            {status}
            {events.length > 0 && ` · ${events.length} events`}
            {error && ` · ${error}`}
          </span>
        </div>

        {events.length > 0 && (
          <ul className="rule-t mt-8 pt-6 font-mono text-xs text-fg-secondary">
            {events.map((event, i) => (
              <li key={i} className="py-1">
                {event.stage} · {event.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
