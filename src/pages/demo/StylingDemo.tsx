import { useState } from "react";
import { Section, CodeBlock, DemoWrapper } from "./components/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
import { Button } from "../../components/Button/index.js";
import { Switch } from "../../components/Switch/index.js";
import { Checkbox } from "../../components/Checkbox/index.js";

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
          conflicts resolve to your override &mdash; including against its own{" "}
          <code className="font-mono text-[12px] text-accent">cl-</code> token
          utilities, so{" "}
          <code className="font-mono text-[12px] text-accent">rounded-none</code>{" "}
          genuinely replaces a component&rsquo;s{" "}
          <code className="font-mono text-[12px] text-accent">rounded-cl-md</code>.
          You never need{" "}
          <code className="font-mono text-[12px] text-accent">!important</code>.
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
          code={`import { Dropdown } from "@chumlab/ui";

<Dropdown
  options={options}
  unstyled
  classes={{
    trigger: "my-trigger-styles",
    content: "my-menu-styles",
    option: "my-option-styles",
  }}
/>`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Every component accepts{" "}
          <code className="font-mono text-[12px] text-accent">unstyled</code>. It
          drops the default classes and keeps everything else — focus management,
          keyboard navigation, ARIA wiring, and portal rendering. Name the slots
          you want through{" "}
          <code className="font-mono text-[12px] text-accent">classes</code>.
        </p>

        <DemoWrapper className="mt-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-6">
              <span className="w-24 text-[12px] text-fg-tertiary">styled</span>
              <Button>Save</Button>
              <Switch defaultChecked aria-label="Styled switch" />
              <Checkbox defaultChecked label="Styled" />
            </div>
            <div className="flex items-center gap-6">
              <span className="w-24 text-[12px] text-fg-tertiary">unstyled</span>
              <Button unstyled>Save</Button>
              <Switch unstyled defaultChecked aria-label="Unstyled switch" />
              <Checkbox unstyled defaultChecked label="Unstyled" />
            </div>
          </div>
        </DemoWrapper>
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          The second row is the same three components with everything decorative
          removed. They still focus, still toggle, still announce themselves —
          what is gone is only the paint. Tab through both rows to hear that
          they behave identically.
        </p>
      </Section>

      <Section
        title="Render as your own element"
        description="`asChild` merges a component's props, styling and behaviour onto the child you give it, instead of rendering its own wrapper."
      >
        <CodeBlock
          code={`import { Button } from "@chumlab/ui";

// Renders an <a>, not a <button>, and keeps everything Button does.
<Button asChild>
  <a href="/pricing">See pricing</a>
</Button>`}
        />
        <DemoWrapper className="mt-6">
          <div className="flex items-center gap-6">
            <Button>A real button</Button>
            <Button asChild>
              <a href="#asChild">An anchor wearing Button</a>
            </Button>
          </div>
        </DemoWrapper>
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          The second control is an{" "}
          <code className="font-mono text-[12px] text-accent">&lt;a&gt;</code> —
          right-click it and you will be offered "open in new tab", which a
          button cannot do. Use this when the semantics have to change but the
          appearance and keyboard handling should not. Only the child's own
          element survives; anything Button would have wrapped it in does not.
        </p>
      </Section>

      <Section
        title="Where floating content renders"
        description="Menus, calendars and tooltips portal to the end of `document.body` so they cannot be clipped. `portalContainer` sends them somewhere else."
      >
        <CodeBlock
          code={`const [container, setContainer] = useState<HTMLElement | null>(null);

<div ref={setContainer} className="relative isolate">
  <Dropdown options={options} portalContainer={container} />
</div>`}
        />
        <PortalContainerExample />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Both menus behave identically; only their position in the DOM differs.
          Reach for this when the surface has to live inside a subtree —
          a shadow root, a container with its own stacking context, or a modal
          whose focus trap would otherwise treat the menu as outside itself.
          The cost is that an ancestor with{" "}
          <code className="font-mono text-[12px] text-accent">overflow: hidden</code>{" "}
          will clip it, which is the clipping the default avoids.
        </p>
      </Section>
    </div>
  );
};

const PORTAL_OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

/**
 * Two identical dropdowns, one portalled to the body and one into the box
 * beside it. Inspecting the DOM is the demonstration — there is nothing to see
 * on screen, which is the point.
 */
const PortalContainerExample = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <DemoWrapper className="mt-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-2">default — portals to body</div>
          <Dropdown options={PORTAL_OPTIONS} placeholder="Pick a fruit" />
        </div>
        <div>
          <div className="eyebrow mb-2">portalContainer — renders in this box</div>
          <div
            ref={setContainer}
            className="relative isolate rounded-cl-md border border-border-faint p-3"
          >
            <Dropdown
              options={PORTAL_OPTIONS}
              placeholder="Pick a fruit"
              portalContainer={container}
            />
          </div>
        </div>
      </div>
    </DemoWrapper>
  );
};

export default StylingDemo;
