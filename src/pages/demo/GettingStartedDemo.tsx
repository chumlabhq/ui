import { useState } from "react";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock } from "./components";

const TabButton = ({
  active,
  onClick,
  children,
  dark,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dark: boolean;
}) => (
  <button
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors ${
      active
        ? dark
          ? "bg-white/10 text-white"
          : "bg-gray-900 text-white"
        : dark
          ? "text-gray-400 hover:text-white hover:bg-white/[0.04]"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const StepNumber = ({ n, dark }: { n: number; dark: boolean }) => (
  <span
    className={`shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-semibold ${
      dark
        ? "bg-indigo-500/20 text-indigo-400"
        : "bg-indigo-100 text-indigo-700"
    }`}
  >
    {n}
  </span>
);

const GettingStartedDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const [method, setMethod] = useState<"npm" | "cdn">("npm");

  const noteColor = dark ? "text-gray-500" : "text-gray-500";
  const codeHighlight = dark ? "text-blue-400" : "text-blue-600";

  return (
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-indigo-50 via-white to-blue-50/80"}`}
        />
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`}
        />
        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            Getting Started
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            Get started with @chumlab/ui by including it in your project using
            NPM or CDN. Built on Tailwind CSS v4 with 30+ production-ready,
            accessible React components.
          </p>
        </div>
      </header>

      {/* ─── Prerequisites ──────────────────────────────────────────────── */}
      <Section
        title="Prerequisites"
        description="Make sure you have the following installed before getting started."
        isDarkMode={dark}
      >
        <div className={`flex flex-wrap gap-3`}>
          {[
            { name: "Node.js", version: "18+" },
            { name: "React", version: "18 or 19" },
            { name: "Tailwind CSS", version: "v4" },
          ].map(({ name, version }) => (
            <div
              key={name}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] ${
                dark
                  ? "bg-white/[0.04] border border-white/[0.06] text-gray-300"
                  : "bg-gray-50 border border-gray-200 text-gray-700"
              }`}
            >
              <span className="font-medium">{name}</span>
              <span className={dark ? "text-gray-500" : "text-gray-400"}>
                {version}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Method Toggle ──────────────────────────────────────────────── */}
      <div>
        <div className="flex gap-1 mb-6" role="tablist" aria-label="Installation method">
          <TabButton active={method === "npm"} onClick={() => setMethod("npm")} dark={dark}>
            Install via NPM
          </TabButton>
          <TabButton active={method === "cdn"} onClick={() => setMethod("cdn")} dark={dark}>
            Include via CDN
          </TabButton>
        </div>

        {method === "npm" ? (
          <div className="space-y-10" role="tabpanel" aria-label="NPM installation">
            {/* Step 1: Install */}
            <Section
              title={
                <span className="inline-flex items-center gap-2.5">
                  <StepNumber n={1} dark={dark} />
                  Install the package
                </span>
              }
              description="Install @chumlab/ui as a dependency using your package manager."
              isDarkMode={dark}
            >
              <CodeBlock code="npm install @chumlab/ui" isDarkMode={dark} />
              <p className={`text-[13px] mt-3 ${noteColor}`}>
                Or use <code className={`text-[13px] ${codeHighlight}`}>yarn add @chumlab/ui</code> / <code className={`text-[13px] ${codeHighlight}`}>pnpm add @chumlab/ui</code>
              </p>
            </Section>

            {/* Step 2: Tailwind */}
            <Section
              title={
                <span className="inline-flex items-center gap-2.5">
                  <StepNumber n={2} dark={dark} />
                  Configure Tailwind CSS
                </span>
              }
              description="Add the @source directive to your CSS file so Tailwind scans the library's classes."
              isDarkMode={dark}
            >
              <CodeBlock
                code={`@import "tailwindcss";\n\n@source "../node_modules/@chumlab/ui/dist/**/*.js";`}
                isDarkMode={dark}
              />
              <p className={`text-[13px] mt-3 ${noteColor}`}>
                Add the <code className={`text-[13px] ${codeHighlight}`}>@source</code> line
                right below your existing <code className={`text-[13px] ${codeHighlight}`}>@import "tailwindcss"</code> — typically
                in <code className={`text-[13px] ${codeHighlight}`}>app.css</code>, <code className={`text-[13px] ${codeHighlight}`}>globals.css</code>, or <code className={`text-[13px] ${codeHighlight}`}>index.css</code>.
              </p>
            </Section>

            {/* Step 3: Use */}
            <Section
              title={
                <span className="inline-flex items-center gap-2.5">
                  <StepNumber n={3} dark={dark} />
                  Import and use components
                </span>
              }
              description="Import any component from its subpath. Tree-shaking is automatic."
              isDarkMode={dark}
            >
              <CodeBlock
                code={`import { Button } from "@chumlab/ui/button";\nimport { Input } from "@chumlab/ui/input";\nimport { Modal } from "@chumlab/ui/modal";`}
                isDarkMode={dark}
              />
            </Section>
          </div>
        ) : (
          <div className="space-y-10" role="tabpanel" aria-label="CDN installation">
            {/* CDN Step 1: CSS */}
            <Section
              title={
                <span className="inline-flex items-center gap-2.5">
                  <StepNumber n={1} dark={dark} />
                  Include the stylesheet
                </span>
              }
              description="Add the CSS file inside your <head> tag."
              isDarkMode={dark}
            >
              <CodeBlock
                code={`<link\n  href="https://cdn.jsdelivr.net/npm/@chumlab/ui@0.1.0/dist/style.css"\n  rel="stylesheet"\n/>`}
                isDarkMode={dark}
              />
            </Section>

            {/* CDN Step 2: JS */}
            <Section
              title={
                <span className="inline-flex items-center gap-2.5">
                  <StepNumber n={2} dark={dark} />
                  Include the JavaScript
                </span>
              }
              description="Add the script before the closing </body> tag."
              isDarkMode={dark}
            >
              <CodeBlock
                code={`<script\n  src="https://cdn.jsdelivr.net/npm/@chumlab/ui@0.1.0/dist/index.js"\n  type="module"\n></script>`}
                isDarkMode={dark}
              />
            </Section>

            <div
              className={`p-4 rounded-xl text-[13px] leading-relaxed ${
                dark
                  ? "bg-amber-900/20 border border-amber-800/40 text-amber-300"
                  : "bg-amber-50 border border-amber-200 text-amber-800"
              }`}
            >
              The CDN method is best for prototyping. For production use, install via NPM to get tree-shaking, TypeScript types, and subpath imports.
            </div>
          </div>
        )}
      </div>

      {/* ─── Quick Example ──────────────────────────────────────────────── */}
      <Section
        title="Quick Example"
        description="A minimal example to verify everything is working."
        isDarkMode={dark}
      >
        <CodeBlock
          code={`import { Button } from "@chumlab/ui/button";\n\nexport default function App() {\n  return (\n    <Button\n      className="px-4 py-2 rounded-lg bg-indigo-600 text-white"\n      onClick={() => alert("Clicked!")}\n    >\n      Click me\n    </Button>\n  );\n}`}
          isDarkMode={dark}
        />
      </Section>

      {/* ─── What's Included ────────────────────────────────────────────── */}
      <Section
        title="What's Included"
        description="Every component is tree-shakeable with subpath exports."
        isDarkMode={dark}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {([
            {
              label: "Layout",
              desc: "Table, Tabs, Accordion, Resizable Panel, Stepper",
              icon: (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h5a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm9 0a1 1 0 011-1h3a1 1 0 011 1v6a1 1 0 01-1 1h-3a1 1 0 01-1-1v-6z" clipRule="evenodd" />
                </svg>
              ),
            },
            {
              label: "Forms",
              desc: "Button, Input, Checkbox, Radio, Switch, Slider, Date/Time Picker",
              icon: (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              ),
            },
            {
              label: "Feedback",
              desc: "Modal, Drawer, Toast, Tooltip, Loader",
              icon: (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              ),
            },
            {
              label: "Selection",
              desc: "Dropdown, Searchable, Multi-Select, Cascading",
              icon: (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
              ),
            },
            {
              label: "Navigation",
              desc: "Breadcrumb, Pagination, Tab Panel",
              icon: (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13 1a1 1 0 10-2 0v1.586l-2.293-2.293a1 1 0 00-1.414 1.414L13.586 15H12a1 1 0 100 2h4a1 1 0 001-1v-4z" clipRule="evenodd" />
                </svg>
              ),
            },
            {
              label: "Data Entry",
              desc: "OTP Input, Phone Input, Text Area",
              icon: (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              ),
            },
          ] as const).map(({ icon, label, desc }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 ${dark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-white"}`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className={`shrink-0 ${dark ? "text-indigo-400" : "text-indigo-600"}`}>
                  {icon}
                </span>
                <span className={`text-[14px] font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                  {label}
                </span>
              </div>
              <p className={`text-[12px] leading-relaxed ${dark ? "text-gray-500" : "text-gray-500"}`}>
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
