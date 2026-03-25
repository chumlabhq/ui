import { useState, useRef } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionShimmer,
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../components/Accordion";
import type { AccordionRef } from "../../components/Accordion";
import { Section, CodeBlock, DemoWrapper, PropsTable, PropRow } from "./components";
import { useTheme } from "./ThemeContext";

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icon = ({
  d,
  size = 16,
  className = "",
}: {
  d: string;
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {d.split("|").map((path, i) => (
      <path key={i} d={path} />
    ))}
  </svg>
);

const BoltIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" className={className} />
);
const ShieldIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className={className} />
);
const SettingsIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  // Accordion component classes
  accordion: {
    root: "w-full",
    item: dark
      ? "border-b border-gray-700 last:border-b-0"
      : "border-b border-gray-200 last:border-b-0",
    trigger: `flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
      dark
        ? "text-gray-100 hover:bg-gray-700 focus-visible:ring-blue-400 focus-visible:ring-offset-gray-800"
        : "text-gray-900 hover:bg-gray-50 focus-visible:ring-blue-500"
    }`,
    triggerInner: "flex-1 text-left",
    content: `px-4 py-4 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`,
    contentWrapper: "overflow-hidden transition-[max-height,opacity,visibility]",
    icon: `h-4 w-4 shrink-0 transition-transform duration-200 ${dark ? "text-gray-400" : "text-gray-500"}`,
    iconWrapper: "shrink-0",
    subtitle: `font-normal mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`,
    heading: "",
  },
  // Variant overrides
  accordionBordered: {
    root: `w-full border rounded-lg overflow-hidden ${dark ? "border-gray-700" : "border-gray-200"}`,
    item: dark ? "border-b border-gray-700 last:border-b-0" : "border-b border-gray-200 last:border-b-0",
  },
  accordionSeparated: {
    root: "w-full space-y-2",
    item: `border rounded-lg overflow-hidden ${dark ? "border-gray-700" : "border-gray-200"}`,
  },
  accordionFlush: {
    root: "w-full",
    item: "",
    trigger: `flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
      dark
        ? "text-gray-100 hover:text-blue-400 focus-visible:ring-blue-400 focus-visible:ring-offset-gray-800"
        : "text-gray-900 hover:text-blue-600 focus-visible:ring-blue-500"
    }`,
  },
  // Demo UI classes (matching InputDemo/TextAreaDemo pattern)
  sectionLabel: `text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-gray-600" : "text-gray-300"}`,
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  cardDense: `rounded-xl border p-4 ${dark ? "border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  code: `px-1.5 py-0.5 rounded-md text-[11px] font-mono font-medium ${dark ? "bg-white/[0.06] text-gray-300" : "bg-gray-100 text-gray-600"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  badge: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${dark ? "bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-400/20" : "bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-600/10"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600`,
  stateDisplay: `text-sm font-mono ${dark ? "text-gray-400" : "text-gray-600"}`,
  divider: `border-t ${dark ? "border-white/[0.06]" : "border-gray-100"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const AccordionDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  // Controlled state
  const [singleValue, setSingleValue] = useState<string | null>("item-1");
  const [multipleValue, setMultipleValue] = useState<string[]>(["multi-1"]);

  // Imperative ref
  const accordionRef = useRef<AccordionRef>(null);

  // Dynamic items
  const [dynamicItems, setDynamicItems] = useState([
    { id: "dyn-1", title: "First Dynamic Item", content: "Content for the first item." },
    { id: "dyn-2", title: "Second Dynamic Item", content: "Content for the second item." },
  ]);
  const [nextId, setNextId] = useState(3);

  // Shimmer loading
  const [isLoading, setIsLoading] = useState(true);

  // Toggle log
  const [toggleLog, setToggleLog] = useState<string[]>([]);

  const addItem = () => {
    setDynamicItems((prev) => [
      ...prev,
      { id: `dyn-${nextId}`, title: `Dynamic Item ${nextId}`, content: `Content for item ${nextId}.` },
    ]);
    setNextId((prev) => prev + 1);
  };

  const removeItem = (id: string) => {
    setDynamicItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className={`absolute inset-0 ${dark
          ? "bg-gradient-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50"
          : "bg-gradient-to-br from-indigo-50 via-white to-blue-50/80"
        }`} />
        <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`} />
        <div className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`} />

        <div className="relative">
          <h1 className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
            Accordion
          </h1>
          <p className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}>
            A composable, accessible accordion component following WAI-ARIA patterns.
            Supports keyboard navigation, single/multiple modes, controlled/uncontrolled state,
            RTL support, and fully customizable styling.
          </p>

          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@kern-ui/accordion";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic (Single Mode) ────────────────────────────────────────── */}
      <Section
        title="Basic Accordion (Single Mode)"
        description="Only one item can be expanded at a time. Click to expand, click again to collapse."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" defaultValue="basic-1" collapsible classes={c.accordion}>
            <AccordionItem value="basic-1">
              <AccordionTrigger>What is React?</AccordionTrigger>
              <AccordionContent>
                React is a JavaScript library for building user interfaces. It lets you
                compose complex UIs from small and isolated pieces of code called components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="basic-2">
              <AccordionTrigger>What is TypeScript?</AccordionTrigger>
              <AccordionContent>
                TypeScript is a strongly typed programming language that builds on JavaScript,
                giving you better tooling at any scale.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="basic-3">
              <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
              <AccordionContent>
                Tailwind CSS is a utility-first CSS framework packed with classes that can
                be composed to build any design, directly in your markup.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Non-Collapsible ────────────────────────────────────────────── */}
      <Section
        title="Non-Collapsible (Single Mode)"
        description="At least one item must always be open. The expanded item cannot be collapsed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" defaultValue="nc-1" collapsible={false} classes={c.accordion}>
            <AccordionItem value="nc-1">
              <AccordionTrigger>First Item (Always One Open)</AccordionTrigger>
              <AccordionContent>
                This accordion always keeps at least one item open.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nc-2">
              <AccordionTrigger>Second Item</AccordionTrigger>
              <AccordionContent>
                Click me to switch - but you can&apos;t close everything.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Multiple Mode ──────────────────────────────────────────────── */}
      <Section
        title="Multiple Expanded Items"
        description='Multiple items can be expanded simultaneously using type="multiple".'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" defaultValue={["multi-1", "multi-2"]} classes={c.accordion}>
            <AccordionItem value="multi-1">
              <AccordionTrigger>First Section</AccordionTrigger>
              <AccordionContent>This section can be open along with others.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-2">
              <AccordionTrigger>Second Section</AccordionTrigger>
              <AccordionContent>Both sections can be expanded at the same time.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-3">
              <AccordionTrigger>Third Section</AccordionTrigger>
              <AccordionContent>Open or close any section independently.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Max Expanded ──────────────────────────────────────────────── */}
      <Section
        title="Max Expanded (Multiple Mode)"
        description="Limit how many items can be open simultaneously with maxExpanded."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" maxExpanded={2} classes={c.accordion}>
            <AccordionItem value="max-1">
              <AccordionTrigger>First (open me)</AccordionTrigger>
              <AccordionContent>You can open up to 2 items at once.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="max-2">
              <AccordionTrigger>Second (open me too)</AccordionTrigger>
              <AccordionContent>Two items are now open.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="max-3">
              <AccordionTrigger>Third (blocked when 2 are open)</AccordionTrigger>
              <AccordionContent>Close one of the others first.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Default Expand All ────────────────────────────────────────── */}
      <Section
        title="Default Expand All"
        description='Use defaultExpandAll to open every item on mount (multiple mode only).'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" defaultExpandAll classes={c.accordion}>
            <AccordionItem value="dea-1">
              <AccordionTrigger>All items start open</AccordionTrigger>
              <AccordionContent>This was expanded on mount.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="dea-2">
              <AccordionTrigger>Second item</AccordionTrigger>
              <AccordionContent>Also expanded on mount.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Heading Level ─────────────────────────────────────────────── */}
      <Section
        title="Heading Level"
        description="Set the semantic heading level for triggers (h1-h6). Defaults to h3."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {([2, 3, 4] as const).map((level) => (
            <div key={level}>
              <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>headingLevel={level}</p>
              <DemoWrapper isDarkMode={dark} layout="block">
                <Accordion type="single" collapsible headingLevel={level} classes={c.accordion}>
                  <AccordionItem value={`hl-${level}`}>
                    <AccordionTrigger>Trigger wrapped in h{level}</AccordionTrigger>
                    <AccordionContent>Content under an h{level} heading.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Controlled (Single) ────────────────────────────────────────── */}
      <Section
        title="Controlled Mode (Single)"
        description="The expanded state is controlled externally via value and onValueChange."
        isDarkMode={dark}
      >
        <div className={`mb-3 p-3 rounded-lg flex items-center gap-3 flex-wrap ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
          <span className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Current:</span>
          <span className={c.stateDisplay}>{singleValue ?? "null"}</span>
          <div className="ml-auto flex gap-2">
            <button className={c.btnPrimary} onClick={() => setSingleValue("item-2")}>Open Item 2</button>
            <button className={c.btn} onClick={() => setSingleValue(null)}>Close All</button>
          </div>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion
            type="single"
            value={singleValue ?? undefined}
            onValueChange={setSingleValue}
            collapsible
            classes={c.accordion}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Item 1</AccordionTrigger>
              <AccordionContent>Content for item 1</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Item 2</AccordionTrigger>
              <AccordionContent>Content for item 2</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Item 3</AccordionTrigger>
              <AccordionContent>Content for item 3</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled (Multiple) ──────────────────────────────────────── */}
      <Section
        title="Controlled Mode (Multiple)"
        description="Track and control multiple expanded items externally."
        isDarkMode={dark}
      >
        <div className={`mb-3 p-3 rounded-lg flex items-center gap-3 flex-wrap ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
          <span className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Current:</span>
          <span className={c.stateDisplay}>[{multipleValue.join(", ")}]</span>
          <div className="ml-auto flex gap-2">
            <button className={c.btnPrimary} onClick={() => setMultipleValue(["multi-1", "multi-2", "multi-3"])}>Open All</button>
            <button className={c.btn} onClick={() => setMultipleValue([])}>Close All</button>
          </div>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" value={multipleValue} onValueChange={setMultipleValue} classes={c.accordion}>
            <AccordionItem value="multi-1">
              <AccordionTrigger>First</AccordionTrigger>
              <AccordionContent>First content</AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-2">
              <AccordionTrigger>Second</AccordionTrigger>
              <AccordionContent>Second content</AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-3">
              <AccordionTrigger>Third</AccordionTrigger>
              <AccordionContent>Third content</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Sizes ──────────────────────────────────────────────────────── */}
      <Section
        title="Sizes"
        description="Three built-in sizes: sm, md (default), and lg."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                size=&quot;{size}&quot;
              </p>
              <DemoWrapper isDarkMode={dark} layout="block">
                <Accordion type="single" collapsible size={size} classes={{ ...c.accordion }}>
                  <AccordionItem value={`${size}-1`}>
                    <AccordionTrigger>First Item</AccordionTrigger>
                    <AccordionContent>Content in {size} size.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`${size}-2`}>
                    <AccordionTrigger>Second Item</AccordionTrigger>
                    <AccordionContent>More content in {size} size.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Variants ───────────────────────────────────────────────────── */}
      <Section
        title="Variants"
        description="Four visual variants: default, bordered, separated, and flush."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>default</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="v-1"><AccordionTrigger>Default Variant</AccordionTrigger><AccordionContent>Standard look.</AccordionContent></AccordionItem>
                <AccordionItem value="v-2"><AccordionTrigger>Second Item</AccordionTrigger><AccordionContent>Content.</AccordionContent></AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>bordered</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={{ ...c.accordion, ...c.accordionBordered }}>
                <AccordionItem value="vb-1"><AccordionTrigger>Bordered Variant</AccordionTrigger><AccordionContent>Wrapped in a border.</AccordionContent></AccordionItem>
                <AccordionItem value="vb-2"><AccordionTrigger>Second Item</AccordionTrigger><AccordionContent>Content.</AccordionContent></AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>separated</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={{ ...c.accordion, ...c.accordionSeparated }}>
                <AccordionItem value="vs-1"><AccordionTrigger>Separated Variant</AccordionTrigger><AccordionContent>Each item is its own card.</AccordionContent></AccordionItem>
                <AccordionItem value="vs-2"><AccordionTrigger>Second Item</AccordionTrigger><AccordionContent>Content.</AccordionContent></AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>flush</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={{ ...c.accordion, ...c.accordionFlush }}>
                <AccordionItem value="vf-1"><AccordionTrigger>Flush Variant</AccordionTrigger><AccordionContent>Minimal borders.</AccordionContent></AccordionItem>
                <AccordionItem value="vf-2"><AccordionTrigger>Second Item</AccordionTrigger><AccordionContent>Content.</AccordionContent></AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Disabled ───────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Disable the entire accordion or individual items."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>Entire accordion disabled</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible disabled classes={c.accordion}>
                <AccordionItem value="d-1"><AccordionTrigger>Disabled Item 1</AccordionTrigger><AccordionContent>Content.</AccordionContent></AccordionItem>
                <AccordionItem value="d-2"><AccordionTrigger>Disabled Item 2</AccordionTrigger><AccordionContent>Content.</AccordionContent></AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>Individual item disabled</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="di-1"><AccordionTrigger>Enabled Item</AccordionTrigger><AccordionContent>This works.</AccordionContent></AccordionItem>
                <AccordionItem value="di-2" disabled><AccordionTrigger>Disabled Item</AccordionTrigger><AccordionContent>Can&apos;t open this.</AccordionContent></AccordionItem>
                <AccordionItem value="di-3"><AccordionTrigger>Another Enabled</AccordionTrigger><AccordionContent>This also works.</AccordionContent></AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Custom Icons ───────────────────────────────────────────────── */}
      <Section
        title="Custom Icons"
        description="Use expandedIcon/collapsedIcon props, iconPosition, and iconAnimation to customize indicators."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>Plus/Minus icons</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="icon-1">
                  <AccordionTrigger
                    expandedIcon={<MinusIcon className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />}
                    collapsedIcon={<PlusIcon className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />}
                  >
                    Click to expand
                  </AccordionTrigger>
                  <AccordionContent>Using Plus/Minus icons.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="icon-2">
                  <AccordionTrigger
                    expandedIcon={<MinusIcon className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />}
                    collapsedIcon={<PlusIcon className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />}
                  >
                    Another section
                  </AccordionTrigger>
                  <AccordionContent>Content with custom icons.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>Icon on left</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="left-1">
                  <AccordionTrigger
                    iconPosition="left"
                    expandedIcon={<ChevronUpIcon className="w-4 h-4 text-blue-500" />}
                    collapsedIcon={<ChevronDownIcon className="w-4 h-4 text-blue-500" />}
                  >
                    Icon on the left
                  </AccordionTrigger>
                  <AccordionContent>The icon is positioned before the title.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>No icon (iconPosition=&quot;none&quot;)</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="noicon-1">
                  <AccordionTrigger iconPosition="none">No icon shown</AccordionTrigger>
                  <AccordionContent>The icon is completely hidden.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Icon Animation ───────────────────────────────────────────── */}
      <Section
        title="Icon Animation"
        description='iconAnimation controls how the indicator animates: "rotate" (default), "switch", or "none".'
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>iconAnimation=&quot;rotate&quot; (default)</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="anim-rotate">
                  <AccordionTrigger iconAnimation="rotate">Toggle to see rotate animation</AccordionTrigger>
                  <AccordionContent>The chevron rotates 180 degrees.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>iconAnimation=&quot;switch&quot;</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="anim-switch">
                  <AccordionTrigger
                    iconAnimation="switch"
                    expandedIcon={<MinusIcon className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />}
                    collapsedIcon={<PlusIcon className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />}
                  >
                    Toggle to see switch animation
                  </AccordionTrigger>
                  <AccordionContent>Icon swaps between plus and minus.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>iconAnimation=&quot;none&quot;</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="anim-none">
                  <AccordionTrigger iconAnimation="none">Toggle with no animation</AccordionTrigger>
                  <AccordionContent>Icon has no transition.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Subtitles & Slots ──────────────────────────────────────────── */}
      <Section
        title="Subtitles & Slots"
        description="Add subtitles and custom left/right slot content to triggers."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible classes={c.accordion}>
            <AccordionItem value="slot-1">
              <AccordionTrigger
                subtitle="Learn about our performance features"
                leftSlot={<BoltIcon className={`w-4 h-4 ${dark ? "text-yellow-400" : "text-yellow-500"}`} />}
              >
                Performance
              </AccordionTrigger>
              <AccordionContent>Optimized for speed and efficiency.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="slot-2">
              <AccordionTrigger
                subtitle="Security features and compliance"
                leftSlot={<ShieldIcon className={`w-4 h-4 ${dark ? "text-green-400" : "text-green-500"}`} />}
                rightSlot={<span className={`text-[10px] px-1.5 py-0.5 rounded-full ${dark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-600"}`}>New</span>}
              >
                Security
              </AccordionTrigger>
              <AccordionContent>Enterprise-grade security built in.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="slot-3">
              <AccordionTrigger
                subtitle="Customize to your needs"
                leftSlot={<SettingsIcon className={`w-4 h-4 ${dark ? "text-blue-400" : "text-blue-500"}`} />}
              >
                Settings
              </AccordionTrigger>
              <AccordionContent>Full customization options available.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── RTL ────────────────────────────────────────────────────────── */}
      <Section
        title="RTL Support"
        description='Set dir="rtl" for right-to-left layouts. Keyboard navigation is automatically reversed.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible dir="rtl" classes={c.accordion}>
            <AccordionItem value="rtl-1">
              <AccordionTrigger>العنصر الأول</AccordionTrigger>
              <AccordionContent>محتوى العنصر الأول - يدعم الكتابة من اليمين إلى اليسار بالكامل.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="rtl-2">
              <AccordionTrigger>العنصر الثاني</AccordionTrigger>
              <AccordionContent>محتوى العنصر الثاني.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Keyboard Navigation ────────────────────────────────────────── */}
      <Section
        title="Keyboard Navigation"
        description="Full WAI-ARIA keyboard support. Focus a trigger and try the keys below."
        isDarkMode={dark}
      >
        <div className={`mb-4 p-4 rounded-lg ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["Space / Enter", "Toggle expanded state"],
              ["↓ / ↑", "Next / previous item (vertical)"],
              ["→ / ←", "Next / previous item (horizontal)"],
              ["Home", "Jump to first item"],
              ["End", "Jump to last item"],
              ["Tab", "Move focus out of accordion"],
            ].map(([key, action]) => (
              <div key={key} className="flex items-center gap-3 py-1">
                <kbd className={c.kbd}>{key}</kbd>
                <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{action}</span>
              </div>
            ))}
          </div>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible classes={c.accordion}>
            <AccordionItem value="kb-1">
              <AccordionTrigger>Click here to focus, then use arrow keys</AccordionTrigger>
              <AccordionContent>Press Space or Enter to toggle.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="kb-2">
              <AccordionTrigger>Press Home to go to first</AccordionTrigger>
              <AccordionContent>Second item content</AccordionContent>
            </AccordionItem>
            <AccordionItem value="kb-3">
              <AccordionTrigger>Press End to go to last</AccordionTrigger>
              <AccordionContent>Third item content</AccordionContent>
            </AccordionItem>
            <AccordionItem value="kb-4">
              <AccordionTrigger>Navigation wraps around (loop=true)</AccordionTrigger>
              <AccordionContent>Pressing down on the last item moves to the first, and vice versa.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Imperative Ref ─────────────────────────────────────────────── */}
      <Section
        title="Imperative Ref API"
        description="Control the accordion programmatically via ref methods."
        isDarkMode={dark}
      >
        <div className={`mb-3 p-3 rounded-lg flex flex-wrap gap-2 ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
          <button className={c.btnPrimary} onClick={() => accordionRef.current?.expandAll()}>Expand All</button>
          <button className={c.btn} onClick={() => accordionRef.current?.collapseAll()}>Collapse All</button>
          <button className={c.btn} onClick={() => accordionRef.current?.toggle("ref-2")}>Toggle Item 2</button>
          <button className={c.btn} onClick={() => accordionRef.current?.focusItem("ref-1")}>Focus Item 1</button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion
            type="multiple"
            ref={accordionRef}
            classes={c.accordion}
            onExpandedChange={(e) => {
              setToggleLog((prev) => [
                `${e.value} ${e.isExpanded ? "expanded" : "collapsed"} (${e.expandedCount}/${e.totalCount})`,
                ...prev.slice(0, 4),
              ]);
            }}
          >
            <AccordionItem value="ref-1">
              <AccordionTrigger>First Item</AccordionTrigger>
              <AccordionContent>Controlled via ref.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="ref-2">
              <AccordionTrigger>Second Item</AccordionTrigger>
              <AccordionContent>Toggle me with the button above.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="ref-3">
              <AccordionTrigger>Third Item</AccordionTrigger>
              <AccordionContent>Expand all to see me.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
        {toggleLog.length > 0 && (
          <div className={`mt-3 p-3 rounded-lg text-xs font-mono space-y-1 ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
            {toggleLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        )}
      </Section>

      {/* ─── Shimmer / Loading ──────────────────────────────────────────── */}
      <Section
        title="Shimmer / Loading State"
        description="Show a loading skeleton while data is being fetched."
        isDarkMode={dark}
      >
        <div className={`mb-3 flex gap-2 ${dark ? "" : ""}`}>
          <button className={c.btn} onClick={() => setIsLoading(!isLoading)}>
            {isLoading ? "Show Content" : "Show Shimmer"}
          </button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          {isLoading ? (
            <AccordionShimmer count={3} size="md" />
          ) : (
            <Accordion type="single" collapsible classes={c.accordion}>
              <AccordionItem value="loaded-1"><AccordionTrigger>Loaded Item 1</AccordionTrigger><AccordionContent>Content loaded.</AccordionContent></AccordionItem>
              <AccordionItem value="loaded-2"><AccordionTrigger>Loaded Item 2</AccordionTrigger><AccordionContent>Content loaded.</AccordionContent></AccordionItem>
              <AccordionItem value="loaded-3"><AccordionTrigger>Loaded Item 3</AccordionTrigger><AccordionContent>Content loaded.</AccordionContent></AccordionItem>
            </Accordion>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Dynamic Items ──────────────────────────────────────────────── */}
      <Section
        title="Dynamic Items"
        description="Add and remove items dynamically."
        isDarkMode={dark}
      >
        <div className={`mb-3 flex gap-2`}>
          <button className={c.btnPrimary} onClick={addItem}>Add Item</button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" classes={c.accordion}>
            {dynamicItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger
                  rightSlot={
                    <button
                      className={`text-xs px-2 py-0.5 rounded ${dark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
                      onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    >
                      Remove
                    </button>
                  }
                >
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Lazy Loading & Unmount ─────────────────────────────────────── */}
      <Section
        title="Lazy Loading & Unmount on Close"
        description="Use lazyLoad to defer rendering until first open, or unmountOnClose to remove from DOM when closed."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>lazyLoad (renders only after first open)</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="lazy-1">
                  <AccordionTrigger>Lazy Loaded Content</AccordionTrigger>
                  <AccordionContent lazyLoad>This content was not in the DOM until you opened it.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>unmountOnClose (removed from DOM when closed)</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="unmount-1">
                  <AccordionTrigger>Unmount on Close</AccordionTrigger>
                  <AccordionContent unmountOnClose>This content is removed from the DOM when closed.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Animation ──────────────────────────────────────────────────── */}
      <Section
        title="Animation Customization"
        description="Adjust animation duration, easing, and reduce motion support."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {[
            { label: "Fast (100ms)", duration: 100, easing: "ease-out" as const },
            { label: "Default (300ms)", duration: 300, easing: "ease-in-out" as const },
            { label: "Slow (800ms)", duration: 800, easing: "ease-in-out" as const },
            { label: "No animation (reduceMotion)", duration: 300, easing: "ease-in-out" as const, reduceMotion: true as const },
          ].map(({ label, duration, easing, reduceMotion }) => (
            <div key={label}>
              <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
              <DemoWrapper isDarkMode={dark} layout="block">
                <Accordion
                  type="single"
                  collapsible
                  animationDuration={duration}
                  animationEasing={easing}
                  reduceMotion={reduceMotion ?? "auto"}
                  classes={c.accordion}
                >
                  <AccordionItem value={`anim-${label}`}>
                    <AccordionTrigger>Toggle me</AccordionTrigger>
                    <AccordionContent>Animation: {label}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="Set unstyled=true to strip all default classes. Apply your own via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion
            type="single"
            collapsible
            unstyled
            classes={{
              root: "w-full",
              item: `border-b ${dark ? "border-gray-700" : "border-gray-200"}`,
              trigger: `flex w-full items-center justify-between py-3 text-sm font-medium ${dark ? "text-gray-200" : "text-gray-800"}`,
              triggerInner: "flex-1 text-left",
              content: `py-2 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`,
              contentWrapper: "overflow-hidden transition-[max-height,opacity,visibility]",
              icon: `w-4 h-4 transition-transform duration-200 ${dark ? "text-gray-500" : "text-gray-400"}`,
              iconWrapper: "shrink-0",
              heading: "",
            }}
          >
            <AccordionItem value="unstyled-1">
              <AccordionTrigger>Custom Styled Item</AccordionTrigger>
              <AccordionContent>All styling provided via classes prop.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="unstyled-2">
              <AccordionTrigger>Another Custom Item</AccordionTrigger>
              <AccordionContent>Full control over every class.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Print Mode ─────────────────────────────────────────────────── */}
      <Section
        title="Expand on Print"
        description="Set expandOnPrint to automatically show all content when printing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible expandOnPrint classes={c.accordion}>
            <AccordionItem value="print-1">
              <AccordionTrigger>Visible in Print</AccordionTrigger>
              <AccordionContent>This content will be visible when printing, even if collapsed on screen.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="print-2">
              <AccordionTrigger>Also Visible in Print</AccordionTrigger>
              <AccordionContent>All collapsed content expands for print media.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Prevent Close ──────────────────────────────────────────────── */}
      <Section
        title="Prevent Close Guard"
        description="Use preventClose to confirm before collapsing. Supports sync and async (Promise) guards."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion
            type="single"
            collapsible
            defaultValue="pc-1"
            classes={c.accordion}
            preventClose={(value) => {
              return !window.confirm(`Close "${value}"? You have unsaved changes.`);
            }}
          >
            <AccordionItem value="pc-1">
              <AccordionTrigger>Try closing me</AccordionTrigger>
              <AccordionContent>A confirmation dialog will appear before this closes.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="pc-2">
              <AccordionTrigger>Another guarded item</AccordionTrigger>
              <AccordionContent>Same guard applies to all items.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Announce Expanded ─────────────────────────────────────────── */}
      <Section
        title="Screen Reader Announcements"
        description="Set announceExpanded to announce expand/collapse changes via a live region."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" announceExpanded classes={c.accordion}>
            <AccordionItem value="ann-1">
              <AccordionTrigger>Toggle me (check screen reader)</AccordionTrigger>
              <AccordionContent>Screen readers will announce the state change.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="ann-2">
              <AccordionTrigger>Another item</AccordionTrigger>
              <AccordionContent>Announces count of expanded items.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Force Mount ──────────────────────────────────────────────── */}
      <Section
        title="Force Mount Content"
        description="Use forceMount to always render content in the DOM, even when collapsed (useful for SEO or form fields)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible classes={c.accordion}>
            <AccordionItem value="fm-1">
              <AccordionTrigger>Always in DOM</AccordionTrigger>
              <AccordionContent forceMount>This content is always rendered (check DOM inspector). It uses aria-hidden when collapsed.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Animation Callbacks ──────────────────────────────────────── */}
      <Section
        title="Animation Callbacks"
        description="Hook into animation lifecycle with onOpenStart, onOpenEnd, onCloseStart, onCloseEnd per content panel."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible classes={c.accordion}>
            <AccordionItem value="cb-1">
              <AccordionTrigger>Toggle and check console</AccordionTrigger>
              <AccordionContent
                onOpenStart={() => console.log("[onOpenStart] Animation starting")}
                onOpenEnd={() => console.log("[onOpenEnd] Animation complete")}
                onCloseStart={() => console.log("[onCloseStart] Closing")}
                onCloseEnd={() => console.log("[onCloseEnd] Closed")}
              >
                Open your browser console to see animation lifecycle events.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Item onToggle ────────────────────────────────────────────── */}
      <Section
        title="Per-Item Toggle Callback"
        description="Use onToggle on AccordionItem to react to individual item state changes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" classes={c.accordion}>
            <AccordionItem value="tog-1" onToggle={(expanded) => console.log(`Item 1: ${expanded ? "opened" : "closed"}`)}>
              <AccordionTrigger>Item 1 (check console)</AccordionTrigger>
              <AccordionContent>onToggle fires with the new expanded state.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="tog-2" onToggle={(expanded) => console.log(`Item 2: ${expanded ? "opened" : "closed"}`)}>
              <AccordionTrigger>Item 2 (check console)</AccordionTrigger>
              <AccordionContent>Each item can have its own toggle callback.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Shimmer Variants ─────────────────────────────────────────── */}
      <Section
        title="Shimmer Options"
        description="AccordionShimmer supports count, size, variant, animate, and showContent."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>With subtitle preview (showContent)</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <AccordionShimmer count={3} showContent />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>No animation</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <AccordionShimmer count={2} animate={false} />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>Small size</p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <AccordionShimmer count={2} size="sm" />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Props Table ────────────────────────────────────────────────── */}
      <Section title="Accordion Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="type" type='"single" | "multiple"' description="Selection mode" isDarkMode={dark} />
            <PropRow name="value" type="string | string[]" description="Controlled expanded value(s)" isDarkMode={dark} />
            <PropRow name="defaultValue" type="string | string[]" description="Initial expanded value(s)" isDarkMode={dark} />
            <PropRow name="onValueChange" type="(v) => void" description="Callback when value changes" isDarkMode={dark} />
            <PropRow name="collapsible" type="boolean" defaultVal="false" description="Allow collapsing all items (single mode)" isDarkMode={dark} />
            <PropRow name="disabled" type="boolean" defaultVal="false" description="Disable all items" isDarkMode={dark} />
            <PropRow name="orientation" type='"vertical" | "horizontal"' defaultVal='"vertical"' description="Orientation for keyboard navigation" isDarkMode={dark} />
            <PropRow name="dir" type='"ltr" | "rtl"' defaultVal='"ltr"' description="Text direction" isDarkMode={dark} />
            <PropRow name="loop" type="boolean" defaultVal="true" description="Loop keyboard navigation" isDarkMode={dark} />
            <PropRow name="size" type='"sm" | "md" | "lg"' defaultVal='"md"' description="Size preset" isDarkMode={dark} />
            <PropRow name="variant" type='"default" | "bordered" | "separated" | "flush"' defaultVal='"default"' description="Visual variant" isDarkMode={dark} />
            <PropRow name="headingLevel" type="1-6" defaultVal="3" description="Heading level for triggers" isDarkMode={dark} />
            <PropRow name="classes" type="AccordionClasses" description="Custom class overrides for all slots" isDarkMode={dark} />
            <PropRow name="unstyled" type="boolean" defaultVal="false" description="Strip all default styling" isDarkMode={dark} />
            <PropRow name="animationDuration" type="number" defaultVal="300" description="Animation duration in ms" isDarkMode={dark} />
            <PropRow name="animationEasing" type="string" defaultVal='"ease-in-out"' description="CSS easing function" isDarkMode={dark} />
            <PropRow name="reduceMotion" type='boolean | "auto"' defaultVal='"auto"' description="Disable animations" isDarkMode={dark} />
            <PropRow name="expandOnPrint" type="boolean" defaultVal="false" description="Expand all items when printing" isDarkMode={dark} />
            <PropRow name="maxExpanded" type="number" description="Max expanded items (multiple mode)" isDarkMode={dark} />
            <PropRow name="defaultExpandAll" type="boolean" defaultVal="false" description="Expand all on mount (multiple mode)" isDarkMode={dark} />
            <PropRow name="storageKey" type="string | StorageConfig" description="Persist state to storage" isDarkMode={dark} />
            <PropRow name="preventClose" type="(v) => boolean | Promise<boolean>" description="Guard before closing an item" isDarkMode={dark} />
            <PropRow name="preventCloseTimeout" type="number" defaultVal="10000" description="Timeout for async preventClose" isDarkMode={dark} />
            <PropRow name="onExpandedChange" type="(event) => void" description="Detailed expand/collapse event" isDarkMode={dark} />
            <PropRow name="announceExpanded" type="boolean" defaultVal="false" description="Announce changes to screen readers" isDarkMode={dark} />
            <PropRow name="asChild" type="boolean" defaultVal="false" description="Merge props onto child element" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      <Section title="AccordionItem Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="value" type="string" description="Unique identifier for this item" isDarkMode={dark} />
            <PropRow name="disabled" type="boolean" defaultVal="false" description="Disable this item" isDarkMode={dark} />
            <PropRow name="onToggle" type="(isExpanded) => void" description="Callback when this item toggles" isDarkMode={dark} />
            <PropRow name="asChild" type="boolean" defaultVal="false" description="Merge props onto child element" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      <Section title="AccordionTrigger Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="iconPosition" type='"left" | "right" | "none"' defaultVal='"right"' description="Position of the indicator icon" isDarkMode={dark} />
            <PropRow name="expandedIcon" type="ReactNode" description="Custom icon when expanded" isDarkMode={dark} />
            <PropRow name="collapsedIcon" type="ReactNode" description="Custom icon when collapsed" isDarkMode={dark} />
            <PropRow name="iconAnimation" type='"rotate" | "switch" | "none"' defaultVal='"rotate"' description="Icon animation style" isDarkMode={dark} />
            <PropRow name="subtitle" type="ReactNode" description="Secondary text below the trigger" isDarkMode={dark} />
            <PropRow name="leftSlot" type="ReactNode" description="Content before the trigger text" isDarkMode={dark} />
            <PropRow name="rightSlot" type="ReactNode" description="Content after the trigger text" isDarkMode={dark} />
            <PropRow name="asChild" type="boolean" defaultVal="false" description="Merge props onto child element" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      <Section title="AccordionContent Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="forceMount" type="boolean" defaultVal="false" description="Always render in DOM" isDarkMode={dark} />
            <PropRow name="lazyLoad" type="boolean" defaultVal="false" description="Defer render until first open" isDarkMode={dark} />
            <PropRow name="unmountOnClose" type="boolean" defaultVal="false" description="Remove from DOM when closed" isDarkMode={dark} />
            <PropRow name="animationDuration" type="number" description="Override accordion-level duration" isDarkMode={dark} />
            <PropRow name="animationEasing" type="string" description="Override accordion-level easing" isDarkMode={dark} />
            <PropRow name="onOpenStart" type="() => void" description="Called when open animation starts" isDarkMode={dark} />
            <PropRow name="onOpenEnd" type="() => void" description="Called when open animation ends" isDarkMode={dark} />
            <PropRow name="onCloseStart" type="() => void" description="Called when close animation starts" isDarkMode={dark} />
            <PropRow name="onCloseEnd" type="() => void" description="Called when close animation ends" isDarkMode={dark} />
            <PropRow name="asChild" type="boolean" defaultVal="false" description="Merge props onto child element" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" description="Use these for CSS-based state styling." isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="data-state" type="Accordion, Item, Trigger, Content" description='"has-expanded"|"all-closed" (root), "open"|"closed" (items)' isDarkMode={dark} />
            <PropRow name="data-disabled" type="Item, Trigger" description="Present when disabled" isDarkMode={dark} />
            <PropRow name="data-pending" type="Item" description="Present during async preventClose" isDarkMode={dark} />
            <PropRow name="data-orientation" type="Accordion, Item, Trigger, Content" description='"vertical"|"horizontal"' isDarkMode={dark} />
            <PropRow name="data-value" type="Item" description="The item's value string" isDarkMode={dark} />
            <PropRow name="data-type" type="Accordion" description='"single"|"multiple"' isDarkMode={dark} />
            <PropRow name="data-size" type="Accordion" description="Size preset value" isDarkMode={dark} />
            <PropRow name="data-variant" type="Accordion" description="Variant value" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" description="WAI-ARIA Accordion pattern compliance." isDarkMode={dark}>
        <div className={c.card}>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              "Triggers are native <button> elements inside heading elements (configurable level)",
              "aria-expanded on triggers reflects open/closed state",
              "aria-controls links each trigger to its content region",
              "Content panels have role=\"region\" with aria-labelledby pointing to trigger",
              "aria-hidden on collapsed content prevents screen reader access",
              "Disabled items use native disabled attribute (removed from tab order)",
              "Live region announcer (opt-in) announces expand/collapse to screen readers",
              "prefers-reduced-motion automatically disables animations",
              "Full RTL support with reversed keyboard navigation",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>&#10003;</span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>Keyboard Reference</p>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              ["Space / Enter", "Toggle the focused accordion item"],
              ["Arrow Down / Arrow Up", "Move focus to next/previous trigger (vertical mode)"],
              ["Arrow Right / Arrow Left", "Move focus to next/previous trigger (horizontal mode)"],
              ["Home", "Move focus to the first trigger"],
              ["End", "Move focus to the last trigger"],
              ["Tab", "Move focus into/out of the accordion (standard tab order)"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default AccordionDemo;
