import { Section } from "./components";

const IntroductionDemo = () => {
  return (
    <div className="space-y-12">
      <header>
        <div className="eyebrow mb-3">Overview</div>
        <div className="rule rule-t mb-8" />
        <h1
          className="font-sans font-medium text-fg mb-5 leading-[1.05]"
          style={{
            fontSize: "clamp(36px, 6vw, 56px)",
            letterSpacing: "-0.03em",
          }}
        >
          Introduction.
        </h1>
        <p className="text-[15.5px] text-fg-secondary leading-[1.6] max-w-2xl">
          Chumlab UI is an open-source React component library for builders who
          care about craft. 30+ accessible, themeable primitives shipped with
          TypeScript types, full keyboard support, and zero vendor lock-in. MIT
          licensed, free forever.
        </p>
      </header>

      <Section
        title="What's inside"
        description="A growing catalog of composable primitives — not a kitchen sink."
      >
        <ul className="space-y-3 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          <li>
            <span className="text-fg font-medium">Forms</span> — Input,
            TextArea, Checkbox, RadioButton, Switch, Slider, Dropdown,
            SearchableDropdown, MultiSelect, Cascading, OTPInput, DatePicker,
            TimePicker, InternationalPhoneInput.
          </li>
          <li>
            <span className="text-fg font-medium">Overlays</span> — Modal,
            Drawer, Tooltip, Toast.
          </li>
          <li>
            <span className="text-fg font-medium">Data display</span> — Table
            (sorting + pagination + selection), Pagination, Avatar, Breadcrumb,
            CountryFlag.
          </li>
          <li>
            <span className="text-fg font-medium">Layout & feedback</span> —
            Accordion, TabPanel, Stepper, ResizablePanel, Loader.
          </li>
        </ul>
      </Section>

      <Section
        title="Design principles"
        description="The non-negotiables we apply to every primitive."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {[
            {
              title: "Accessibility built in",
              body: "WCAG 2.1 AA across every primitive. Keyboard navigation, focus management, ARIA, and reduced motion are not bolt-ons.",
            },
            {
              title: "Themeable to the bone",
              body: "Override anything with className. Theme via CSS variables. Use unstyled variants when you want full control.",
            },
            {
              title: "Production-ready, day one",
              body: "Controlled and uncontrolled modes. SSR-safe. Strict TypeScript. Battle-tested edge cases.",
            },
            {
              title: "Built for speed",
              body: "Zero runtime CSS-in-JS. Tree-shakeable imports. Tailwind v4 under the hood. Components average 2.1 KB gzipped.",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="p-5 bg-bg-elevated"
              style={{ border: "0.5px solid var(--border-faint)" }}
            >
              <div className="text-[14px] font-medium text-fg mb-1.5">
                {p.title}
              </div>
              <p className="text-[13px] text-fg-secondary leading-[1.55]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Who it's for"
        description="If any of these sound like you, Chumlab UI was built with you in mind."
      >
        <ul className="space-y-2 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl list-disc pl-5 marker:text-accent">
          <li>
            Engineers who want a working component library without re-inventing
            accessibility every project.
          </li>
          <li>
            Founders shipping product features instead of plumbing — drop it in,
            move on.
          </li>
          <li>
            Designers handing off to dev with a system whose CSS variables map
            cleanly to Figma tokens.
          </li>
          <li>
            Teams adopting AI-assisted development who need primitives that are
            easy for an LLM to reason about.
          </li>
        </ul>
      </Section>
    </div>
  );
};

export default IntroductionDemo;
