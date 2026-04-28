import { Section, CodeBlock } from "./components";

const AiLlmDemo = () => {
  return (
    <div className="space-y-12">
      <header>
        <div className="eyebrow mb-3">Guides</div>
        <div className="rule rule-t mb-8" />
        <h1
          className="font-sans font-medium text-fg mb-5 leading-[1.05]"
          style={{
            fontSize: "clamp(36px, 6vw, 56px)",
            letterSpacing: "-0.03em",
          }}
        >
          AI &amp; LLM.
        </h1>
        <p className="text-[15.5px] text-fg-secondary leading-[1.6] max-w-2xl">
          Patterns for building AI playgrounds, streaming UIs, and chat
          surfaces with Chumlab UI. Plus: what makes our component APIs
          friendly to LLM-assisted code generation.
        </p>
      </header>

      <Section
        title="LLM-friendly APIs"
        description="The properties that make Chumlab UI components reliable for AI tooling to emit."
      >
        <ul className="space-y-2 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl list-disc pl-5 marker:text-accent">
          <li>
            <span className="text-fg font-medium">Strict TypeScript types</span>{" "}
            — every prop, every variant, every event handler. LLMs
            autocomplete and type-check against the same surface area you
            do.
          </li>
          <li>
            <span className="text-fg font-medium">JSDoc + @example blocks</span>{" "}
            on every public component. The published{" "}
            <code className="font-mono text-[12px] text-accent">llms.txt</code>{" "}
            file at the root makes the entire API discoverable to retrieval
            tools (Cursor, Claude, Copilot) without scraping.
          </li>
          <li>
            <span className="text-fg font-medium">Predictable className merge</span>{" "}
            — overrides win, defaults compose. LLMs don&rsquo;t have to
            guess about precedence.
          </li>
          <li>
            <span className="text-fg font-medium">Composable primitives</span>{" "}
            — <code className="font-mono text-[12px] text-accent">Dropdown.Trigger</code>,
            {" "}<code className="font-mono text-[12px] text-accent">Dropdown.Content</code>,
            {" "}<code className="font-mono text-[12px] text-accent">Dropdown.Item</code>.
            Smaller surface, fewer props, less for an LLM to guess at.
          </li>
        </ul>
      </Section>

      <Section
        title="Streaming UIs"
        description="The primitives we reach for when building chat or playground experiences."
      >
        <ul className="space-y-2 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl list-disc pl-5 marker:text-accent">
          <li>
            <span className="text-fg font-medium">Toast</span> — surfacing
            non-blocking status (model switched, tokens left, request rate
            limited). Stacking is built in.
          </li>
          <li>
            <span className="text-fg font-medium">Loader</span> — pulse,
            shimmer, and dots variants for the typical &quot;thinking&quot;
            states between streamed tokens.
          </li>
          <li>
            <span className="text-fg font-medium">Modal / Drawer</span> —
            tool-call confirmations, settings panels, prompt history.
          </li>
          <li>
            <span className="text-fg font-medium">Accordion</span> —
            collapsible reasoning traces, plan steps, or chain-of-thought
            sections without overwhelming the conversation.
          </li>
        </ul>
      </Section>

      <Section
        title="Token-by-token streaming"
        description="A pattern for rendering streamed assistant output without re-mounting on every token."
      >
        <CodeBlock
          code={`function StreamingMessage({ content }: { content: string }) {
  // Render a single text node and let React reconcile diffs char by char.
  // No nested spans — that's what causes the flicker you see in some chat UIs.
  return (
    <p className="text-[14px] leading-[1.6] text-fg whitespace-pre-wrap">
      {content}
      <span className="inline-block w-[2px] h-[14px] bg-accent animate-cursor ml-0.5" />
    </p>
  );
}`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          The cursor uses our built-in{" "}
          <code className="font-mono text-[12px] text-accent">animate-cursor</code>{" "}
          keyframe — same one driving the homepage&rsquo;s typed rotator.
        </p>
      </Section>

      <Section
        title="Provider-agnostic"
        description="Chumlab UI doesn't care which model or framework you use."
      >
        <p className="text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          We don&rsquo;t bundle an SDK. Pair the components with Vercel AI
          SDK, OpenAI&rsquo;s Node client, Anthropic&rsquo;s, the Google
          Gemini SDK, or your own backend stream — the components just
          render whatever string you pass in.
        </p>
      </Section>
    </div>
  );
};

export default AiLlmDemo;
