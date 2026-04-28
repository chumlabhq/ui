import { Section, CodeBlock } from "./components";

const StylingDemo = () => {
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
          Styling.
        </h1>
        <p className="text-[15.5px] text-fg-secondary leading-[1.6] max-w-2xl">
          Three ways to override any Chumlab UI primitive, ranked by effort.
          Pick whichever fits your project — they all compose cleanly.
        </p>
      </header>

      <Section
        title="1. className"
        description="The path of least resistance. Pass a className to any primitive and it merges with the defaults."
      >
        <CodeBlock
          code={`<Button className="rounded-full bg-emerald-500 hover:bg-emerald-600">
  Subscribe
</Button>`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Works with Tailwind, CSS Modules, plain CSS, or any combination.
          The library uses the Tailwind merge convention so utility
          conflicts resolve to your override.
        </p>
      </Section>

      <Section
        title="2. The classes prop"
        description="When you need to target an internal element (not just the root) without ejecting."
      >
        <CodeBlock
          code={`<Modal
  classes={{
    overlay: "bg-black/85 backdrop-blur-sm",
    panel: "rounded-2xl border-emerald-500/30",
    title: "font-serif italic",
  }}
>
  ...
</Modal>`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Every composite primitive (Modal, Drawer, Accordion, Table,
          Pagination, etc.) exposes a typed <code className="font-mono text-[12px] text-accent">classes</code>{" "}
          prop with named slots. The TypeScript types tell you what slots
          are available — IDE autocompletion does the rest.
        </p>
      </Section>

      <Section
        title="3. CSS variables"
        description="Theme-level overrides that propagate through every primitive."
      >
        <CodeBlock
          code={`:root {
  --accent: oklch(64% 0.18 248);
  --bg-base: #0b0d10;
  --border-faint: rgba(255, 255, 255, 0.06);
}`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          See the{" "}
          <a
            href="/guides/theming"
            className="text-accent hover:text-fg transition-colors underline-offset-4 hover:underline"
          >
            Theming guide
          </a>{" "}
          for the full token list.
        </p>
      </Section>

      <Section
        title="4. Unstyled mode"
        description="When you want to keep our accessibility logic but bring your own visuals top to bottom."
      >
        <CodeBlock
          code={`import { Dropdown } from "@chumlab/ui/dropdown/unstyled";

<Dropdown.Root>
  <Dropdown.Trigger className="my-button-styles" />
  <Dropdown.Content className="my-menu-styles">
    <Dropdown.Item className="my-item-styles">One</Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Available for the bigger composite primitives. You get focus
          management, keyboard navigation, ARIA wiring, and portal
          rendering — and zero default classes.
        </p>
      </Section>
    </div>
  );
};

export default StylingDemo;
