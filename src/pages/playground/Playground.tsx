import { useCallback, useState } from "react";
import { Button } from "../../components/ui";
import PreviewFrame from "./components/PreviewFrame";
import { useGenerationStream } from "./hooks/useGenerationStream";
import type { PipelineEvent, PlaygroundGateInfo, VerifyError } from "./types";
import type { PreviewTheme } from "../../lib/preview/runtime";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SAMPLE_SNIPPET = `import { Button } from "@chumlab/ui/button";
import { Sparkle } from "@phosphor-icons/react";

export default function Sample() {
  return (
    <div className="min-h-screen bg-bg-base p-10">
      <div className="rounded-lg bg-bg-elevated p-6 text-fg">
        <p className="text-sm">Vendor bundle, tokens and icons are live.</p>
        <Button className="mt-4" startIcon={<Sparkle weight="fill" />}>
          Chumlab Button
        </Button>
      </div>
    </div>
  );
}
`;

const BROKEN_SNIPPET = `export default function Broken() {
  throw new Error("Deliberate render failure");
}
`;

function GateNotice({ gate }: { gate: PlaygroundGateInfo }) {
  if (gate.code === "not_invited") {
    return (
      <div className="rule mt-8 rounded-lg bg-bg-elevated p-6">
        <p className="eyebrow">Invite only</p>
        <h2 className="mt-2 text-xl font-medium">
          You&apos;re on the <span className="serif-accent">waitlist.</span>
        </h2>
        <p className="mt-3 text-sm text-fg-secondary">
          {gate.position != null
            ? `Position #${gate.position} · estimated wait ${gate.estimatedWait}. `
            : "Sign up from the homepage to join the waitlist. "}
          We invite in rolling batches and will email you.
        </p>
      </div>
    );
  }

  return (
    <div className="rule mt-8 rounded-lg bg-bg-elevated p-6">
      <p className="eyebrow">Daily limit</p>
      <h2 className="mt-2 text-xl font-medium">
        You&apos;ve used today&apos;s <span className="serif-accent">generations.</span>
      </h2>
      <p className="mt-3 text-sm text-fg-secondary">
        {gate.limit != null && `All ${gate.limit} runs are spent. `}
        {gate.resetsAt &&
          `Your quota resets at ${new Date(gate.resetsAt).toLocaleString()}.`}
      </p>
    </div>
  );
}

export default function Playground() {
  const { status, events, error, gate, connect } = useGenerationStream({
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
            {error && !gate && ` · ${error}`}
          </span>
        </div>

        {gate && <GateNotice gate={gate} />}

        {events.length > 0 && (
          <ul className="rule-t mt-8 pt-6 font-mono text-xs text-fg-secondary">
            {events.map((event, i) => (
              <li key={i} className="py-1">
                {event.stage} · {event.status}
              </li>
            ))}
          </ul>
        )}

        <PreviewHarness />
      </div>
    </main>
  );
}

// Phase 2A proof harness for the preview runtime; replaced by the real
// generation flow in Phase 3.
function PreviewHarness() {
  const [code, setCode] = useState<string | null>(null);
  const [theme, setTheme] = useState<PreviewTheme>("dark");
  const [result, setResult] = useState<string>("no render yet");

  const handleRendered = useCallback(() => setResult("rendered"), []);
  const handleRenderError = useCallback(
    (error: VerifyError) => setResult(`${error.kind} error · ${error.message}`),
    []
  );

  return (
    <section className="rule-t mt-12 pt-8">
      <p className="eyebrow">Preview runtime</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCode(SAMPLE_SNIPPET)}
        >
          Render sample
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCode(BROKEN_SNIPPET)}
        >
          Render broken
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          Theme: {theme}
        </Button>
        <span className="text-sm text-fg-tertiary">{result}</span>
      </div>
      <PreviewFrame
        code={code}
        theme={theme}
        onRendered={handleRendered}
        onRenderError={handleRenderError}
        className="rule mt-6 h-96 w-full rounded-lg"
      />
    </section>
  );
}
