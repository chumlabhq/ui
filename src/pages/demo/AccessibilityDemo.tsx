import { Section } from "./components";

const AccessibilityDemo = () => {
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
          Accessibility.
        </h1>
        <p className="text-[15.5px] text-fg-secondary leading-[1.6] max-w-2xl">
          Chumlab UI targets WCAG 2.1 AA across every primitive. If something
          isn&rsquo;t accessible, treat it as a bug — open an issue and we ship
          a fix.
        </p>
      </header>

      <Section
        title="Keyboard navigation"
        description="Every interactive primitive responds to the standard keyboard contract."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl text-[13px]">
          {[
            ["Tab / Shift+Tab", "Move focus between interactive elements."],
            ["Enter / Space", "Activate buttons, toggles, and triggers."],
            [
              "Arrow keys",
              "Navigate within composite widgets (tabs, menus, sliders).",
            ],
            ["Home / End", "Jump to first or last item in a list-like widget."],
            ["Esc", "Close overlays (Modal, Drawer, Tooltip, Dropdown)."],
            [
              "Type-ahead",
              "Jump to matching option in Dropdown and SearchableDropdown.",
            ],
          ].map(([key, desc]) => (
            <div
              key={key}
              className="p-3 bg-bg-elevated"
              style={{ border: "0.5px solid var(--border-faint)" }}
            >
              <kbd className="font-mono text-[11px] text-accent">{key}</kbd>
              <p className="mt-1 text-fg-secondary leading-[1.55]">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="ARIA & semantics"
        description="We use native HTML where we can and ARIA where we must."
      >
        <ul className="space-y-2 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl list-disc pl-5 marker:text-accent">
          <li>
            Roles & states (
            <code className="font-mono text-[12px] text-accent">
              aria-expanded
            </code>
            ,{" "}
            <code className="font-mono text-[12px] text-accent">
              aria-selected
            </code>
            ,{" "}
            <code className="font-mono text-[12px] text-accent">
              aria-current
            </code>
            ) are wired on every composite widget.
          </li>
          <li>
            Live regions announce toasts, errors, and dynamic feedback —
            <code className="font-mono text-[12px] text-accent">
              {" "}
              aria-live=&quot;polite&quot;
            </code>{" "}
            by default,{" "}
            <code className="font-mono text-[12px] text-accent">
              assertive
            </code>{" "}
            for errors.
          </li>
          <li>
            Modals and Drawers trap focus on open and restore it to the invoking
            element on close.
          </li>
          <li>
            Form primitives wire{" "}
            <code className="font-mono text-[12px] text-accent">label</code> /{" "}
            <code className="font-mono text-[12px] text-accent">
              aria-describedby
            </code>{" "}
            /{" "}
            <code className="font-mono text-[12px] text-accent">
              aria-invalid
            </code>{" "}
            correctly so screen readers announce errors and hints.
          </li>
        </ul>
      </Section>

      <Section
        title="Reduced motion"
        description="Every animation respects the user's OS-level preference."
      >
        <p className="text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Components query{" "}
          <code className="font-mono text-[12px] text-accent">
            (prefers-reduced-motion: reduce)
          </code>{" "}
          and short-circuit transitions to instant snap-to-final-state. Drawers
          don&rsquo;t slide, toasts don&rsquo;t bounce, accordions don&rsquo;t
          animate height. Behaviour is identical; only the motion is removed.
        </p>
      </Section>

      <Section
        title="Color & contrast"
        description="Tokens are picked to meet AA contrast in both light and dark modes."
      >
        <p className="text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Body text on background passes 4.5:1. Interactive text on filled
          accents passes 3:1. Focus rings use a 2px{" "}
          <code className="font-mono text-[12px] text-accent">accent</code> halo
          with a 2px offset for visibility on any surface.
        </p>
      </Section>

      <Section title="Testing" description="What we run on every release.">
        <ul className="space-y-2 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl list-disc pl-5 marker:text-accent">
          <li>Automated axe-core scans against every demo page.</li>
          <li>
            Manual screen-reader sweeps (VoiceOver, NVDA) for new primitives and
            any change to focus management.
          </li>
          <li>
            Keyboard-only smoke tests in CI for the big composite widgets
            (Modal, Drawer, Dropdown, Table, DatePicker).
          </li>
        </ul>
      </Section>
    </div>
  );
};

export default AccessibilityDemo;
