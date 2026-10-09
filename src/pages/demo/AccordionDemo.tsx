import type { AccordionClasses } from "../../components/Accordion/index.js";
import {
  useState,
  useRef } from "react";
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
  } from "../../components/Accordion/index.js";
import type { AccordionRef } from "../../components/Accordion/index.js";
import { Switch } from "../../components/Switch/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  CopyPasteBlock,
  SetupNote,
  CodeBlock,
} from "./components/index.js";

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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const getClasses = () => ({
  accordion: {
    root: "w-full",
    item: "border-b border-cl-border last:border-b-0",
    trigger: `flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg`,
    icon: `h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary`,
  } satisfies AccordionClasses,

  /* Class strings this page reuses in its own markup. Not `classes`
     keys — Accordion has no such slots, and passing them there styled
     nothing. */
  accordionExtra: {
    triggerInner: "flex-1 text-left",
    contentWrapper:
      "overflow-hidden transition-[max-height,opacity,visibility]",
    iconWrapper: "shrink-0",
    subtitle: `font-normal mt-0.5 text-cl-text-tertiary`,
    heading: "",
  },
  accordionBordered: {
    root: `w-full border rounded-cl-md overflow-hidden border-cl-border`,
    item: "border-b border-cl-border last:border-b-0",
  },
  accordionSeparated: {
    root: "w-full space-y-2",
    item: `border rounded-cl-md overflow-hidden border-cl-border`,
  },
  accordionFlush: {
    root: "w-full",
    item: "",
    trigger: `flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-cl-text hover:text-cl-accent focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg`,
  },
  sectionLabel: `text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary`,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 cardDense: `rounded-cl-lg p-4 bg-cl-bg-elevated`,
  code: `px-1.5 py-0.5 rounded-cl-md text-[11px] font-mono font-medium bg-cl-bg-elevated text-cl-text-secondary`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  badge: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-cl-md text-[11px] font-semibold uppercase tracking-wider bg-cl-accent-bg text-cl-accent-hover ring-1 ring-inset ring-cl-accent/10`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer`,
  stateDisplay: `text-sm font-mono text-cl-text-secondary`,
  divider: `border-t border-cl-border`,
});

const AccordionDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();

  const [singleValue, setSingleValue] = useState<string | null>("item-1");
  const [multipleValue, setMultipleValue] = useState<string[]>(["multi-1"]);

  const accordionRef = useRef<AccordionRef>(null);

  const [dynamicItems, setDynamicItems] = useState([
    {
      id: "dyn-1",
      title: "First Dynamic Item",
      content: "Content for the first item.",
    },
    {
      id: "dyn-2",
      title: "Second Dynamic Item",
      content: "Content for the second item.",
    },
  ]);
  const [nextId, setNextId] = useState(3);

  const [toggleLog, setToggleLog] = useState<string[]>([]);
  const [openStartCount, setOpenStartCount] = useState(0);
  const [openEndCount, setOpenEndCount] = useState(0);
  const [closeStartCount, setCloseStartCount] = useState(0);
  const [closeEndCount, setCloseEndCount] = useState(0);
  const [itemOneExpanded, setItemOneExpanded] = useState("not fired yet");
  const [itemTwoExpanded, setItemTwoExpanded] = useState("not fired yet");
  const [guardUnsaved, setGuardUnsaved] = useState(true);
  const [guardDecision, setGuardDecision] = useState("not fired yet");

  const addItem = () => {
    setDynamicItems((prev) => [
      ...prev,
      {
        id: `dyn-${nextId}`,
        title: `Dynamic Item ${nextId}`,
        content: `Content for item ${nextId}.`,
      },
    ]);
    setNextId((prev) => prev + 1);
  };

  const removeItem = (id: string) => {
    setDynamicItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-10">
      <DocsHero
        title="Accordion"
        description="A composable, accessible accordion component following WAI-ARIA patterns. Supports keyboard navigation, single/multiple modes, controlled/uncontrolled state, RTL support, and fully customizable styling."
        code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@chumlab/ui/accordion";`}
      />

      <SetupNote />

      <CopyPasteBlock name="Accordion" />

      {/* ─── Basic (Single Mode) ────────────────────────────────────────── */}
      <Section
        title="Variants"
        description="Four surface treatments. The behaviour is identical; only the frame changes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col gap-8">
            {(["default", "bordered", "separated", "flush"] as const).map((variant) => (
              <div key={variant}>
                <div className="eyebrow mb-2">{variant}</div>
                <Accordion type="single" collapsible variant={variant} defaultValue={`v-${variant}`}>
                  <AccordionItem value={`v-${variant}`}>
                    <AccordionTrigger>Shipping</AccordionTrigger>
                    <AccordionContent>Dispatched within two working days.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`v-${variant}-2`}>
                    <AccordionTrigger>Returns</AccordionTrigger>
                    <AccordionContent>Thirty days, unworn, receipt not required.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Horizontal orientation"
        description="Horizontal orientation lays the items along the inline axis and swaps the arrow keys that move between them — Left and Right rather than Up and Down."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible orientation="horizontal" defaultValue="h-1">
            <AccordionItem value="h-1">
              <AccordionTrigger>Overview</AccordionTrigger>
              <AccordionContent>The first panel, opened along the inline axis.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="h-2">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>Arrow Left and Right move between the triggers here.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      <Section
        title="Focus wrapping"
        description="`loop` decides what ArrowDown does on the last trigger: wrap to the first, or stop. Tab to a trigger and hold ArrowDown on each to feel the difference."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="eyebrow mb-2">loop</div>
              <Accordion type="single" collapsible loop>
                <AccordionItem value="loop-1">
                  <AccordionTrigger>First</AccordionTrigger>
                  <AccordionContent>Wraps round to First from Last.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="loop-2">
                  <AccordionTrigger>Last</AccordionTrigger>
                  <AccordionContent>ArrowDown here goes back to First.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div>
              <div className="eyebrow mb-2">loop={"{false}"} (default)</div>
              <Accordion type="single" collapsible loop={false}>
                <AccordionItem value="noloop-1">
                  <AccordionTrigger>First</AccordionTrigger>
                  <AccordionContent>Stops at the ends.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="noloop-2">
                  <AccordionTrigger>Last</AccordionTrigger>
                  <AccordionContent>ArrowDown here stays put.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Basic Usage"
        description="A simple accordion where only one item can be expanded at a time."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {/* Basic usage — works out-of-the-box with built-in styles */}
          <Accordion
            type="single"
            defaultValue="basic-1"
            collapsible
          >
            <AccordionItem value="basic-1">
              <AccordionTrigger>What is React?</AccordionTrigger>
              <AccordionContent>
                React is a JavaScript library for building user interfaces. It
                lets you compose complex UIs from small and isolated pieces of
                code called components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="basic-2">
              <AccordionTrigger>What is TypeScript?</AccordionTrigger>
              <AccordionContent>
                TypeScript is a strongly typed programming language that builds
                on JavaScript, giving you better tooling at any scale.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="basic-3">
              <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
              <AccordionContent>
                Tailwind CSS is a utility-first CSS framework packed with
                classes that can be composed to build any design, directly in
                your markup.
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
          <Accordion
            type="single"
            defaultValue="nc-1"
            collapsible={false}
            classes={c.accordion}
          >
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
          <Accordion
            type="multiple"
            defaultValue={["multi-1", "multi-2"]}
            classes={c.accordion}
          >
            <AccordionItem value="multi-1">
              <AccordionTrigger>First Section</AccordionTrigger>
              <AccordionContent>
                This section can be open along with others.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-2">
              <AccordionTrigger>Second Section</AccordionTrigger>
              <AccordionContent>
                Both sections can be expanded at the same time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-3">
              <AccordionTrigger>Third Section</AccordionTrigger>
              <AccordionContent>
                Open or close any section independently.
              </AccordionContent>
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
              <AccordionContent>
                You can open up to 2 items at once.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="max-2">
              <AccordionTrigger>Second (open me too)</AccordionTrigger>
              <AccordionContent>Two items are now open.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="max-3">
              <AccordionTrigger>
                Third (blocked when 2 are open)
              </AccordionTrigger>
              <AccordionContent>
                Close one of the others first.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Default Expand All ────────────────────────────────────────── */}
      <Section
        title="Default Expand All"
        description="Use defaultExpandAll to open every item on mount (multiple mode only)."
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
              <p
                className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
              >
                headingLevel={level}
              </p>
              <DemoWrapper isDarkMode={dark} layout="block">
                <Accordion
                  type="single"
                  collapsible
                  headingLevel={level}
                  classes={c.accordion}
                >
                  <AccordionItem value={`hl-${level}`}>
                    <AccordionTrigger>
                      Trigger wrapped in h{level}
                    </AccordionTrigger>
                    <AccordionContent>
                      Content under an h{level} heading.
                    </AccordionContent>
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
        <div
          className={`mb-3 p-3 rounded-cl-md flex flex-col sm:flex-row sm:items-center gap-3 bg-cl-bg-elevated`}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`text-xs font-medium text-cl-text-secondary`}
            >
              Current:
            </span>
            <span className={c.stateDisplay}>{singleValue ?? "null"}</span>
          </div>
          <div className="sm:ml-auto flex gap-2">
            <button
              className={c.btnPrimary}
              onClick={() => setSingleValue("item-2")}
            >
              Open Item 2
            </button>
            <button className={c.btn} onClick={() => setSingleValue(null)}>
              Close All
            </button>
          </div>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion
            type="single"
            value={singleValue}
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
        <div
          className={`mb-3 p-3 rounded-cl-md flex flex-col sm:flex-row sm:items-center gap-3 bg-cl-bg-elevated`}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`text-xs font-medium text-cl-text-secondary`}
            >
              Current:
            </span>
            <span className={c.stateDisplay}>[{multipleValue.join(", ")}]</span>
          </div>
          <div className="sm:ml-auto flex gap-2">
            <button
              className={c.btnPrimary}
              onClick={() =>
                setMultipleValue(["multi-1", "multi-2", "multi-3"])
              }
            >
              Open All
            </button>
            <button className={c.btn} onClick={() => setMultipleValue([])}>
              Close All
            </button>
          </div>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion
            type="multiple"
            value={multipleValue}
            onValueChange={setMultipleValue}
            classes={c.accordion}
          >
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
              <p
                className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
              >
                size=&quot;{size}&quot;
              </p>
              <DemoWrapper isDarkMode={dark} layout="block">
                <Accordion
                  type="single"
                  collapsible
                  size={size}
                  classes={{
                    root: c.accordion.root,
                    item: c.accordion.item,
                    itemText: c.accordionExtra.triggerInner,
                    content: c.accordionExtra.contentWrapper,
                    icon: c.accordionExtra.iconWrapper,
                    description: c.accordionExtra.subtitle,
                    header: c.accordionExtra.heading,
                  }}
                >
                  <AccordionItem value={`${size}-1`}>
                    <AccordionTrigger>First Item</AccordionTrigger>
                    <AccordionContent>Content in {size} size.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`${size}-2`}>
                    <AccordionTrigger>Second Item</AccordionTrigger>
                    <AccordionContent>
                      More content in {size} size.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
          ))}
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
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              Entire accordion disabled
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion
                type="single"
                collapsible
                disabled
                classes={c.accordion}
              >
                <AccordionItem value="d-1">
                  <AccordionTrigger>Disabled Item 1</AccordionTrigger>
                  <AccordionContent>Content.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="d-2">
                  <AccordionTrigger>Disabled Item 2</AccordionTrigger>
                  <AccordionContent>Content.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              Individual item disabled
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="di-1">
                  <AccordionTrigger>Enabled Item</AccordionTrigger>
                  <AccordionContent>This works.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="di-2" disabled>
                  <AccordionTrigger>Disabled Item</AccordionTrigger>
                  <AccordionContent>Can&apos;t open this.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="di-3">
                  <AccordionTrigger>Another Enabled</AccordionTrigger>
                  <AccordionContent>This also works.</AccordionContent>
                </AccordionItem>
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
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              Plus/Minus icons
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="icon-1">
                  <AccordionTrigger
                    expandedIcon={
                      <MinusIcon
                        className={`w-4 h-4 text-cl-text-secondary`}
                      />
                    }
                    collapsedIcon={
                      <PlusIcon
                        className={`w-4 h-4 text-cl-text-secondary`}
                      />
                    }
                  >
                    Click to expand
                  </AccordionTrigger>
                  <AccordionContent>Using Plus/Minus icons.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="icon-2">
                  <AccordionTrigger
                    expandedIcon={
                      <MinusIcon
                        className={`w-4 h-4 text-cl-text-secondary`}
                      />
                    }
                    collapsedIcon={
                      <PlusIcon
                        className={`w-4 h-4 text-cl-text-secondary`}
                      />
                    }
                  >
                    Another section
                  </AccordionTrigger>
                  <AccordionContent>
                    Content with custom icons.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              Icon on left
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="left-1">
                  <AccordionTrigger
                    iconPosition="left"
                    expandedIcon={
                      <ChevronUpIcon className="w-4 h-4 text-cl-accent" />
                    }
                    collapsedIcon={
                      <ChevronDownIcon className="w-4 h-4 text-cl-accent" />
                    }
                  >
                    Icon on the left
                  </AccordionTrigger>
                  <AccordionContent>
                    The icon is positioned before the title.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              No icon (iconPosition=&quot;none&quot;)
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="noicon-1">
                  <AccordionTrigger iconPosition="none">
                    No icon shown
                  </AccordionTrigger>
                  <AccordionContent>
                    The icon is completely hidden.
                  </AccordionContent>
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
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              iconAnimation=&quot;rotate&quot; (default)
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="anim-rotate">
                  <AccordionTrigger iconAnimation="rotate">
                    Toggle to see rotate animation
                  </AccordionTrigger>
                  <AccordionContent>
                    The chevron rotates 180 degrees.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              iconAnimation=&quot;switch&quot;
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="anim-switch">
                  <AccordionTrigger
                    iconAnimation="switch"
                    expandedIcon={
                      <MinusIcon
                        className={`w-4 h-4 text-cl-text-secondary`}
                      />
                    }
                    collapsedIcon={
                      <PlusIcon
                        className={`w-4 h-4 text-cl-text-secondary`}
                      />
                    }
                  >
                    Toggle to see switch animation
                  </AccordionTrigger>
                  <AccordionContent>
                    Icon swaps between plus and minus.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              iconAnimation=&quot;none&quot;
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="anim-none">
                  <AccordionTrigger iconAnimation="none">
                    Toggle with no animation
                  </AccordionTrigger>
                  <AccordionContent>Icon has no transition.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
        </div>
      </Section>

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
                leftSlot={
                  <BoltIcon
                    className={`w-4 h-4 text-cl-text`}
                  />
                }
              >
                Performance
              </AccordionTrigger>
              <AccordionContent>
                Optimized for speed and efficiency.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="slot-2">
              <AccordionTrigger
                subtitle="Security features and compliance"
                leftSlot={
                  <ShieldIcon
                    className={`w-4 h-4 text-cl-success`}
                  />
                }
                rightSlot={
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full bg-cl-success-bg text-cl-text`}
                  >
                    New
                  </span>
                }
              >
                Security
              </AccordionTrigger>
              <AccordionContent>
                Enterprise-grade security built in.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="slot-3">
              <AccordionTrigger
                subtitle="Customize to your needs"
                leftSlot={
                  <SettingsIcon
                    className={`w-4 h-4 text-cl-accent`}
                  />
                }
              >
                Settings
              </AccordionTrigger>
              <AccordionContent>
                Full customization options available.
              </AccordionContent>
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
              <AccordionContent>
                محتوى العنصر الأول - يدعم الكتابة من اليمين إلى اليسار بالكامل.
              </AccordionContent>
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
        title="Try it: Keyboard Navigation"
        description="Full WAI-ARIA keyboard support. Focus a trigger and try the keys below."
        isDarkMode={dark}
      >
        <div
          className={`mb-4 p-4 rounded-cl-md bg-cl-bg-elevated`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
                <span
                  className={`text-xs text-cl-text-secondary`}
                >
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible classes={c.accordion}>
            <AccordionItem value="kb-1">
              <AccordionTrigger>
                Click here to focus, then use arrow keys
              </AccordionTrigger>
              <AccordionContent>
                Press Space or Enter to toggle.
              </AccordionContent>
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
              <AccordionTrigger>
                Navigation wraps around (loop=true)
              </AccordionTrigger>
              <AccordionContent>
                Pressing down on the last item moves to the first, and vice
                versa.
              </AccordionContent>
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
        <div
          className={`mb-3 p-3 rounded-cl-md flex flex-wrap gap-2 bg-cl-bg-elevated`}
        >
          <button
            className={c.btnPrimary}
            onClick={() => accordionRef.current?.expandAll()}
          >
            Expand All
          </button>
          <button
            className={c.btn}
            onClick={() => accordionRef.current?.collapseAll()}
          >
            Collapse All
          </button>
          <button
            className={c.btn}
            onClick={() => accordionRef.current?.toggle("ref-2")}
          >
            Toggle Item 2
          </button>
          <button
            className={c.btn}
            onClick={() => accordionRef.current?.focusItem("ref-1")}
          >
            Focus Item 1
          </button>
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
              <AccordionContent>
                Toggle me with the button above.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ref-3">
              <AccordionTrigger>Third Item</AccordionTrigger>
              <AccordionContent>Expand all to see me.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
        {toggleLog.length > 0 && (
          <div
            className={`mt-3 p-3 rounded-cl-md text-xs font-mono space-y-1 bg-cl-bg-hover text-cl-text-tertiary`}
          >
            {toggleLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        )}
      </Section>

      {/* ─── Dynamic Items ──────────────────────────────────────────────── */}
      <Section
        title="Dynamic Items"
        description="Add and remove items dynamically."
        isDarkMode={dark}
      >
        <div className={`mb-3 flex gap-2`}>
          <button className={c.btnPrimary} onClick={addItem}>
            Add Item
          </button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" classes={c.accordion}>
            {dynamicItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger
                  rightSlot={
                    <span
                      role="button"
                      tabIndex={0}
                      className={`text-xs px-2 py-0.5 rounded cursor-pointer text-cl-error hover:bg-cl-bg-elevated`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          removeItem(item.id);
                        }
                      }}
                    >
                      Remove
                    </span>
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

      {/* ─── Storage Persistence ──────────────────────────────────────── */}
      <Section
        title="Storage Persistence"
        description="Use storageKey to persist expanded state across page reloads via localStorage."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion
            type="multiple"
            storageKey="accordion-demo-persist"
            classes={c.accordion}
          >
            <AccordionItem value="persist-1">
              <AccordionTrigger>Persistent Item 1</AccordionTrigger>
              <AccordionContent>
                Expand this item and refresh the page — it will remain open.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="persist-2">
              <AccordionTrigger>Persistent Item 2</AccordionTrigger>
              <AccordionContent>
                State is saved to localStorage under the key
                &quot;accordion-demo-persist&quot;.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="persist-3">
              <AccordionTrigger>Persistent Item 3</AccordionTrigger>
              <AccordionContent>
                Clear localStorage to reset the state.
              </AccordionContent>
            </AccordionItem>
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
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              lazyLoad (renders only after first open)
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="lazy-1">
                  <AccordionTrigger>Lazy Loaded Content</AccordionTrigger>
                  <AccordionContent lazyLoad>
                    This content was not in the DOM until you opened it.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
          <div>
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              unmountOnClose (removed from DOM when closed)
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Accordion type="single" collapsible classes={c.accordion}>
                <AccordionItem value="unmount-1">
                  <AccordionTrigger>Unmount on Close</AccordionTrigger>
                  <AccordionContent unmountOnClose>
                    This content is removed from the DOM when closed.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Animation ──────────────────────────────────────────────────── */}
      <Section
        title="Composition with asChild"
        description="Render your own element for a part, keeping its behaviour, ARIA and keyboard handling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="single" collapsible defaultValue="ac-1">
            <AccordionItem value="ac-1">
              <AccordionTrigger asChild>
                <button className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium cursor-pointer text-cl-text hover:bg-cl-bg-hover">
                  Your own button, styled your way
                </button>
              </AccordionTrigger>
              <AccordionContent>
                `asChild` hands the trigger&rsquo;s props to the element you pass, so this is your
                markup with the accordion&rsquo;s keyboard handling and `aria-expanded` on it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ac-2">
              <AccordionTrigger>An ordinary trigger</AccordionTrigger>
              <AccordionContent>
                Both behave identically; only the rendered element differs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
        <p className="text-[13px] text-fg-tertiary leading-[1.6] max-w-2xl mt-3">
          The child replaces the part&rsquo;s own element. `AccordionTrigger` still renders its
          heading around it (`headingLevel`), so pass an interactive element such as a
          `button`, not a heading. `AccordionItem`, `AccordionTrigger` and `AccordionContent`
          all take it.
        </p>
      </Section>

      <Section
        title="Your own open and close animation"
        description="The panel's height is a CSS custom property, so the animation is yours to replace."
        isDarkMode={dark}
      >
        <p className="text-[14px] text-fg-secondary leading-[1.6] max-w-2xl mb-4">
          <code className="font-mono text-[12px] text-accent">AccordionContent</code>{" "}
          measures its content once each time it opens and writes the result to{" "}
          <code className="font-mono text-[12px] text-accent">--cl-accordion-content-height</code>{" "}
          on the panel. The shipped keyframes animate <code className="font-mono text-[12px] text-accent">height</code>{" "}
          between <code className="font-mono text-[12px] text-accent">0</code> and that value. Write your own against
          the same variable and point the panel at them — the measurement keeps working, because it is
          the component that does it.
        </p>
        <CodeBlock
          code={`/* your stylesheet */
@keyframes my-accordion-open {
  from { height: 0; opacity: 0; }
  to   { height: var(--cl-accordion-content-height); opacity: 1; }
}

@keyframes my-accordion-close {
  from { height: var(--cl-accordion-content-height); opacity: 1; }
  to   { height: 0; opacity: 0; }
}

/* the panel carries data-state, so you can select on it */
[data-state="open"]  > .my-panel { animation: my-accordion-open  240ms ease-out forwards; }
[data-state="closed"] > .my-panel { animation: my-accordion-close 240ms ease-in  forwards; }`}
        />
        <p className="text-[13px] text-fg-tertiary leading-[1.6] max-w-2xl mt-3">
          The animating element is a bare clipper — no padding, margin or border. Keep it that way:
          padding on the element whose height is animating stops it collapsing cleanly, which reads as
          a stutter and then a snap. Put your padding on the inner element, which is what{" "}
          <code className="font-mono text-[12px] text-accent">classes.body</code> styles.
        </p>
      </Section>

      <Section
        title="Animation Customization"
        description="Adjust animation duration, easing, and reduce motion support."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {[
            {
              label: "Fast (100ms)",
              duration: 100,
              easing: "ease-out" as const,
            },
            {
              label: "Default (300ms)",
              duration: 300,
              easing: "ease-in-out" as const,
            },
            {
              label: "Slow (800ms)",
              duration: 800,
              easing: "ease-in-out" as const,
            },
            {
              label: "No animation (reduceMotion)",
              duration: 300,
              easing: "ease-in-out" as const,
              reduceMotion: true as const,
            },
          ].map(({ label, duration, easing, reduceMotion }) => (
            <div key={label}>
              <p
                className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
              >
                {label}
              </p>
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

      {/* ─── Print Mode ─────────────────────────────────────────────────── */}
      <Section
        title="Expand on Print"
        description="Set expandOnPrint to automatically show all content when printing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion
            type="single"
            collapsible
            expandOnPrint
            classes={c.accordion}
          >
            <AccordionItem value="print-1">
              <AccordionTrigger>Visible in Print</AccordionTrigger>
              <AccordionContent>
                This content will be visible when printing, even if collapsed on
                screen.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="print-2">
              <AccordionTrigger>Also Visible in Print</AccordionTrigger>
              <AccordionContent>
                All collapsed content expands for print media.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoWrapper>
      </Section>

      {/* ─── Prevent Close ──────────────────────────────────────────────── */}
      <Section
        title="Prevent Close Guard"
        description="Use preventClose to guard collapsing: return true to keep the item open. Supports sync and async (Promise) guards."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Switch
            label="Unsaved changes"
            checked={guardUnsaved}
            onValueChange={setGuardUnsaved}
          />
          <Accordion
            type="single"
            collapsible
            defaultValue="pc-1"
            classes={c.accordion}
            preventClose={(value) => {
              setGuardDecision(JSON.stringify({ value, prevented: guardUnsaved }));
              return guardUnsaved;
            }}
          >
            <AccordionItem value="pc-1">
              <AccordionTrigger>Try closing me</AccordionTrigger>
              <AccordionContent>
                While "Unsaved changes" is on, the guard keeps this open.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pc-2">
              <AccordionTrigger>Another guarded item</AccordionTrigger>
              <AccordionContent>
                Same guard applies to all items.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
            preventClose: {guardDecision}
          </div>
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
              <AccordionTrigger>
                Toggle me (check screen reader)
              </AccordionTrigger>
              <AccordionContent>
                Screen readers will announce the state change.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ann-2">
              <AccordionTrigger>Another item</AccordionTrigger>
              <AccordionContent>
                Announces count of expanded items.
              </AccordionContent>
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
              <AccordionContent forceMount>
                This content is always rendered (check DOM inspector). It uses
                aria-hidden when collapsed.
              </AccordionContent>
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
              <AccordionTrigger>Toggle to fire the callbacks</AccordionTrigger>
              <AccordionContent
                onOpenStart={() => setOpenStartCount((n) => n + 1)}
                onOpenEnd={() => setOpenEndCount((n) => n + 1)}
                onCloseStart={() => setCloseStartCount((n) => n + 1)}
                onCloseEnd={() => setCloseEndCount((n) => n + 1)}
              >
                Each lifecycle callback is counted in the readout below.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div
            className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
            data-demo-action
          >
            <div>onOpenStart: {openStartCount ? `fired ${openStartCount}×` : "not fired yet"}</div>
            <div>onOpenEnd: {openEndCount ? `fired ${openEndCount}×` : "not fired yet"}</div>
            <div>onCloseStart: {closeStartCount ? `fired ${closeStartCount}×` : "not fired yet"}</div>
            <div>onCloseEnd: {closeEndCount ? `fired ${closeEndCount}×` : "not fired yet"}</div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Item onExpandedChange ──────────────────────────────────── */}
      <Section
        title="Per-Item Expanded Callback"
        description="Use onExpandedChange on AccordionItem to react to individual item state changes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Accordion type="multiple" classes={c.accordion}>
            <AccordionItem
              value="tog-1"
              onExpandedChange={(expanded) =>
                setItemOneExpanded(JSON.stringify(expanded))
              }
            >
              <AccordionTrigger>Item 1</AccordionTrigger>
              <AccordionContent>
                onExpandedChange fires with the new expanded state.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="tog-2"
              onExpandedChange={(expanded) =>
                setItemTwoExpanded(JSON.stringify(expanded))
              }
            >
              <AccordionTrigger>Item 2</AccordionTrigger>
              <AccordionContent>
                Each item can have its own expanded change callback.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div
            className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
            data-demo-action
          >
            <div>Item 1 onExpandedChange: {itemOneExpanded}</div>
            <div>Item 2 onExpandedChange: {itemTwoExpanded}</div>
          </div>
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
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              With subtitle preview (showContent)
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <AccordionShimmer count={3} showContent />
            </DemoWrapper>
          </div>
          <div>
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              No animation
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <AccordionShimmer count={2} animate={false} />
            </DemoWrapper>
          </div>
          <div>
            <p
              className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
            >
              Small size
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <AccordionShimmer count={2} size="sm" />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="Accordion" />

      {/* ─── Accessibility ────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onValueChange` (single or multiple) when expansion state lives in React. Use `defaultValue` for uncontrolled usage. Pick one mode for the lifetime of the instance; avoid toggling between controlled and uncontrolled."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "`preventClose` can delay collapse until an async callback resolves—handle loading and errors in the parent.",
          "Duplicate `AccordionItem` values break focus order and state; keep values unique.",
          "When using persistence, reconcile stored IDs with the current item list before first paint to avoid flash.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide a visible label or `aria-label` / `aria-labelledby` on the root when there is no page heading.",
          "Use `type=\"single\"` or `multiple` consistently with your product navigation model.",
          "Test keyboard and screen reader behavior when nesting links or buttons inside triggers.",
        ]}
        donts={[
          "Do not put essential page navigation only inside collapsed regions without an alternate path.",
          "Do not switch from `defaultValue` to `value` (or the reverse) after mount.",
          "Do not use duplicate item `value` strings across items.",
        ]}
      />
    </div>
  );
};

export default AccordionDemo;
