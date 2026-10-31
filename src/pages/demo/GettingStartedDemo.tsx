import { useState } from "react";
import { Section, CodeBlock } from "./components/index.js";

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className="px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer"
    style={{
      background: active ? "var(--text-primary)" : "transparent",
      color: active ? "var(--bg-base)" : "var(--text-secondary)",
      border: "0.5px solid var(--border-faint)",
    }}
  >
    {children}
  </button>
);

const StepNumber = ({ n }: { n: number }) => (
  <span
    className="font-serif italic shrink-0 inline-block leading-none"
    style={{ color: "var(--accent)", fontSize: 22 }}
  >
    {String(n).padStart(2, "0")}
  </span>
);

const GettingStartedDemo = () => {
  const [method, setMethod] = useState<"npm" | "cdn">("npm");

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
          Getting <span className="serif-accent">started.</span>
        </h1>
        <p className="text-[15.5px] text-fg-secondary leading-[1.6] max-w-2xl">
          Get started with @chumlab/ui by including it in your project using NPM
          or CDN. Built on Tailwind CSS v4 with 30 production-ready, accessible
          React components.
        </p>
      </header>

      <Section
        title="Prerequisites"
        description="Make sure you have the following installed before getting started."
      >
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Node.js", version: "18+" },
            { name: "React", version: "18 or 19" },
            { name: "Tailwind CSS", version: "v4" },
          ].map(({ name, version }) => (
            <div
              key={name}
              className="inline-flex items-center gap-2 px-3 py-2 text-[13px] bg-bg-elevated text-fg"
              style={{ border: "0.5px solid var(--border-faint)" }}
            >
              <span className="font-medium">{name}</span>
              <span className="text-fg-tertiary">{version}</span>
            </div>
          ))}
        </div>
      </Section>

      <div>
        <div
          className="flex gap-0 mb-6"
          role="tablist"
          aria-label="Installation method"
        >
          <TabButton active={method === "npm"} onClick={() => setMethod("npm")}>
            Install via NPM
          </TabButton>
          <TabButton active={method === "cdn"} onClick={() => setMethod("cdn")}>
            Include via CDN
          </TabButton>
        </div>

        {method === "npm" ? (
          <div
            className="space-y-10"
            role="tabpanel"
            aria-label="NPM installation"
          >
            <Section
              title={
                <span className="inline-flex items-center gap-3">
                  <StepNumber n={1} />
                  Install the package
                </span>
              }
              description="Install @chumlab/ui as a dependency using your package manager."
            >
              <CodeBlock code="npm install @chumlab/ui" />
              <p className="text-[13px] mt-3 text-fg-tertiary">
                Or use{" "}
                <code
                  className="text-[13px]"
                  style={{ color: "var(--accent)" }}
                >
                  yarn add @chumlab/ui
                </code>{" "}
                /{" "}
                <code
                  className="text-[13px]"
                  style={{ color: "var(--accent)" }}
                >
                  pnpm add @chumlab/ui
                </code>
              </p>
            </Section>

            <Section
              title={
                <span className="inline-flex items-center gap-3">
                  <StepNumber n={2} />
                  Import the stylesheet
                </span>
              }
              description="Required. Without this the components render structurally correct but completely unstyled."
            >
              <CodeBlock code={`import "@chumlab/ui/styles.css";`} />
              <p className="text-[13px] mt-3 text-fg-tertiary">
                Import it once, at your app entry. It is precompiled — it carries
                the design tokens and the layout rules the components are built
                from, so they work with no Tailwind in your project. It contains
                no CSS reset, so your own page styling is untouched.
              </p>
              <p className="text-[13px] mt-3 text-fg-tertiary">
                Already running Tailwind? Import{" "}
                <code className="text-[13px]" style={{ color: "var(--accent)" }}>
                  @chumlab/ui/tokens.css
                </code>{" "}
                instead and point Tailwind at the package so it generates the
                utilities alongside your own:
              </p>
              <div className="mt-3">
                <CodeBlock
                  code={`@import "tailwindcss";\n@import "@chumlab/ui/tokens.css";\n\n@source "../node_modules/@chumlab/ui/dist";`}
                />
              </div>
              <p className="text-[13px] mt-3 text-fg-tertiary">
                Import one or the other, not both. The{" "}
                <code className="text-[13px]" style={{ color: "var(--accent)" }}>
                  @source
                </code>{" "}
                path resolves relative to your CSS file.
              </p>
            </Section>

            <Section
              title={
                <span className="inline-flex items-center gap-3">
                  <StepNumber n={3} />
                  Import and use components
                </span>
              }
              description="Import any component from its subpath. Tree-shaking is automatic."
            >
              <CodeBlock
                code={`import { Button } from "@chumlab/ui/button";\nimport { Input } from "@chumlab/ui/input";\nimport { Modal } from "@chumlab/ui/modal";`}
              />
            </Section>
          </div>
        ) : (
          <div
            className="space-y-10"
            role="tabpanel"
            aria-label="CDN installation"
          >
            <Section
              title={
                <span className="inline-flex items-center gap-3">
                  <StepNumber n={1} />
                  Include the stylesheet
                </span>
              }
              description="Add the CSS file inside your <head> tag."
            >
              <CodeBlock
                code={`<link\n  href="https://cdn.jsdelivr.net/npm/@chumlab/ui/dist/styles.css"\n  rel="stylesheet"\n/>`}
              />
            </Section>

            <Section
              title={
                <span className="inline-flex items-center gap-3">
                  <StepNumber n={2} />
                  Include the JavaScript
                </span>
              }
              description="The build imports react by bare specifier, so the browser needs an import map to resolve it."
            >
              <CodeBlock
                code={`<script type="importmap">\n  {\n    "imports": {\n      "react": "https://esm.sh/react@19",\n      "react-dom": "https://esm.sh/react-dom@19",\n      "react/jsx-runtime": "https://esm.sh/react@19/jsx-runtime",\n      "clsx": "https://esm.sh/clsx@2",\n      "tailwind-merge": "https://esm.sh/tailwind-merge@3"\n    }\n  }\n</script>\n\n<script type="module">\n  import { Button } from "https://cdn.jsdelivr.net/npm/@chumlab/ui/dist/index.js";\n</script>`}
              />
              <p className="text-[13px] mt-3 text-fg-tertiary">
                Table and DatePicker additionally need{" "}
                <code className="text-[13px]" style={{ color: "var(--accent)" }}>
                  @tanstack/react-table
                </code>{" "}
                and{" "}
                <code className="text-[13px]" style={{ color: "var(--accent)" }}>
                  date-fns
                </code>{" "}
                in the map. Import the component subpath instead of the root
                barrel to avoid pulling them in.
              </p>
            </Section>

            <div
              className="p-4 text-[13px] leading-relaxed bg-bg-elevated text-fg"
              style={{ borderLeft: "2px solid var(--accent)" }}
            >
              <span
                className="font-medium me-2"
                style={{ color: "var(--accent)" }}
              >
                Note
              </span>
              The CDN method is best for prototyping. For production use,
              install via NPM to get tree-shaking, TypeScript types, and subpath
              imports.
            </div>
          </div>
        )}
      </div>

      <Section
        title="Quick example"
        description="Copy this verbatim. Following the three steps above, it renders a styled button."
      >
        <CodeBlock
          code={`import "@chumlab/ui/styles.css";\nimport { Button } from "@chumlab/ui/button";\n\nexport default function App() {\n  return (\n    <Button\n      className="px-4 py-2 rounded-cl-md bg-cl-accent text-cl-on-accent"\n      onClick={() => console.log("Clicked!")}\n    >\n      Click me\n    </Button>\n  );\n}`}
        />
        <p className="text-[13px] mt-3 text-fg-tertiary">
          The stylesheet carries the utilities the components themselves use —
          the{" "}
          <code className="text-[13px]" style={{ color: "var(--accent)" }}>
            cl-
          </code>{" "}
          token scale plus their layout classes. It is not a general Tailwind
          build, so arbitrary utilities of your own still need Tailwind or your
          own CSS. Anything you pass via{" "}
          <code className="text-[13px]" style={{ color: "var(--accent)" }}>
            className
          </code>{" "}
          wins over the component&apos;s defaults.
        </p>
      </Section>

      <Section
        title="What's included"
        description="Every component is tree-shakeable with subpath exports."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              label: "Layout",
              desc: "Table, Tabs, Accordion, Resizable Panel, Stepper",
            },
            {
              label: "Forms",
              desc: "Button, Input, Checkbox, Radio, Switch, Slider, Date and Time Picker",
            },
            {
              label: "Feedback",
              desc: "Modal, Drawer, Toast, Tooltip, Loader",
            },
            {
              label: "Selection",
              desc: "Dropdown, Searchable, Multi-Select, Cascading",
            },
            { label: "Navigation", desc: "Breadcrumb, Pagination, Tab Panel" },
            { label: "Data entry", desc: "OTP Input, Phone Input, Text Area" },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="p-4 bg-bg-elevated"
              style={{ border: "0.5px solid var(--border-faint)" }}
            >
              <div className="text-[14px] font-medium text-fg mb-2">
                {label}
              </div>
              <p className="text-[12.5px] leading-relaxed text-fg-tertiary">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default GettingStartedDemo;
