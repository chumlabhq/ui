import { Section, CodeBlock } from "./components";

const TOKENS: Array<{ name: string; description: string }> = [
  { name: "--bg-base", description: "Page background. The base canvas." },
  { name: "--bg-elevated", description: "Cards, popovers, modals — anything raised off the canvas." },
  { name: "--bg-overlay", description: "Floating layers stacked above elevated surfaces (toasts, dropdowns)." },
  { name: "--text-primary", description: "Body text. Highest contrast." },
  { name: "--text-secondary", description: "Secondary copy, labels, descriptions." },
  { name: "--text-tertiary", description: "Muted helpers, placeholders, timestamps." },
  { name: "--text-muted", description: "Disabled or de-emphasized text." },
  { name: "--border-faint", description: "Hairline rules, card borders." },
  { name: "--border-soft", description: "Slightly stronger separator. Inputs, dropdowns." },
  { name: "--border-active", description: "Strong border for hover/focused interactive elements." },
  { name: "--accent", description: "Primary accent. Active states, focus rings, links." },
];

const ThemingDemo = () => {
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
          Theming.
        </h1>
        <p className="text-[15.5px] text-fg-secondary leading-[1.6] max-w-2xl">
          Chumlab UI ships a small set of CSS variables that drive every
          surface, text, border, and accent. Override them once at the root
          and the library follows.
        </p>
      </header>

      <Section
        title="Light & dark out of the box"
        description="Set data-theme on <html> and the same tokens flip to their light values automatically."
      >
        <CodeBlock
          code={`<html data-theme="dark">  <!-- or "light" -->
  ...
</html>`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          The header in this site uses the global theme provider —
          clicking the sun/moon button writes the attribute and persists it
          to <code className="font-mono text-[12px] text-accent">localStorage</code>.
        </p>
      </Section>

      <Section
        title="Token reference"
        description="The full set of tokens. Override any of them to retheme without touching component source."
      >
        <div className="overflow-hidden" style={{ border: "0.5px solid var(--border-faint)" }}>
          <table className="w-full text-left text-[13px]">
            <thead className="bg-bg-elevated">
              <tr>
                <th
                  className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary"
                  style={{ borderBottom: "0.5px solid var(--border-faint)" }}
                >
                  Token
                </th>
                <th
                  className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-tertiary"
                  style={{ borderBottom: "0.5px solid var(--border-faint)" }}
                >
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {TOKENS.map((t, i) => (
                <tr
                  key={t.name}
                  style={{
                    borderBottom:
                      i < TOKENS.length - 1
                        ? "0.5px solid var(--border-faint)"
                        : "none",
                  }}
                >
                  <td className="px-4 py-2.5 font-mono text-accent">
                    {t.name}
                  </td>
                  <td className="px-4 py-2.5 text-fg-secondary">
                    {t.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Custom palettes"
        description="Theme to your brand by overriding the relevant tokens at the root."
      >
        <CodeBlock
          code={`/* app/globals.css */

:root[data-theme="dark"] {
  --bg-base: #0b0d10;
  --bg-elevated: #14171d;
  --accent: #22d3ee;
}

:root[data-theme="light"] {
  --bg-base: #fcfcfa;
  --bg-elevated: #ffffff;
  --accent: #0ea5e9;
}`}
        />
        <p className="mt-4 text-[14px] text-fg-secondary leading-[1.6] max-w-2xl">
          Token names stay stable across versions, so palette overrides
          are forward-compatible.
        </p>
      </Section>
    </div>
  );
};

export default ThemingDemo;
