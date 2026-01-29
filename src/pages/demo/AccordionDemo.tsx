import { useState, useRef } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../components/Accordion";
import { useTheme } from "./ThemeContext";

// ============================================================================
// SECTION COMPONENT
// ============================================================================

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const Section: React.FC<SectionProps> = ({ title, description, children, isDarkMode }) => (
  <section className="space-y-4">
    <div>
      <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      )}
    </div>
    {children}
  </section>
);

// ============================================================================
// CODE BLOCK COMPONENT
// ============================================================================

interface CodeBlockProps {
  code: string;
  isDarkMode: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, isDarkMode }) => (
  <pre
    className={`p-4 rounded-lg text-sm overflow-x-auto ${
      isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-gray-100"
    }`}
  >
    <code>{code}</code>
  </pre>
);

// ============================================================================
// DEMO WRAPPER COMPONENT
// ============================================================================

interface DemoWrapperProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  className?: string;
}

const DemoWrapper: React.FC<DemoWrapperProps> = ({ children, isDarkMode, className = "" }) => (
  <div
    className={`border rounded-lg overflow-hidden ${
      isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
    } ${className}`}
  >
    {children}
  </div>
);

// ============================================================================
// MAIN ACCORDION DEMO COMPONENT
// ============================================================================

const AccordionDemo = () => {
  const { isDarkMode } = useTheme();
  
  // State for controlled examples
  const [singleValue, setSingleValue] = useState<string>("item-1");
  const [multipleValue, setMultipleValue] = useState<string[]>(["multi-1"]);
  
  // State for dynamic items example
  const [dynamicItems, setDynamicItems] = useState([
    { id: "dyn-1", title: "First Dynamic Item", content: "Content for the first item." },
    { id: "dyn-2", title: "Second Dynamic Item", content: "Content for the second item." },
  ]);
  const [nextId, setNextId] = useState(3);

  // State for async loading example
  const [asyncData, setAsyncData] = useState<Record<string, string>>({});
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  // State for form example
  const [formData, setFormData] = useState({
    personalInfo: { name: "", email: "" },
    address: { street: "", city: "", zip: "" },
    preferences: { newsletter: false, notifications: false },
  });

  // Ref for programmatic control
  const accordionRef = useRef<HTMLDivElement>(null);

  // Helper function for async loading
  const loadContent = async (itemId: string) => {
    if (asyncData[itemId] || loadingItems.has(itemId)) return;
    
    setLoadingItems((prev) => new Set(prev).add(itemId));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setAsyncData((prev) => ({
      ...prev,
      [itemId]: `This content was loaded asynchronously for ${itemId}. Timestamp: ${new Date().toLocaleTimeString()}`,
    }));
    
    setLoadingItems((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  // Dynamic items handlers
  const addItem = () => {
    setDynamicItems((prev) => [
      ...prev,
      {
        id: `dyn-${nextId}`,
        title: `Dynamic Item ${nextId}`,
        content: `This is dynamically added content for item ${nextId}.`,
      },
    ]);
    setNextId((prev) => prev + 1);
  };

  const removeItem = (id: string) => {
    setDynamicItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Dark mode aware class names
  const getAccordionClassNames = () => ({
    root: "w-full",
    item: isDarkMode
      ? "border-b border-gray-700 last:border-b-0"
      : "border-b border-gray-200 last:border-b-0",
    trigger: `flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
      isDarkMode
        ? "text-gray-100 hover:bg-gray-700 focus-visible:ring-blue-400 focus-visible:ring-offset-gray-800"
        : "text-gray-900 hover:bg-gray-50 focus-visible:ring-blue-500"
    }`,
    content: `px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`,
    icon: `h-4 w-4 shrink-0 transition-transform duration-200 ${
      isDarkMode ? "text-gray-400" : "text-gray-500"
    }`,
  });

  return (
    <div className="space-y-16">
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Accordion
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A composable, accessible accordion component following WAI-ARIA patterns.
          Supports keyboard navigation, single/multiple modes, controlled/uncontrolled state,
          RTL support, and customizable styling.
        </p>

        {/* Quick Install */}
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@kern-ui/accordion";`}
          />
        </div>
      </header>

      {/* ================================================================== */}
      {/* EXAMPLES SECTION */}
      {/* ================================================================== */}
      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Examples
        </h2>

        {/* ---------------------------------------------------------------- */}
        {/* Basic Usage */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Basic Accordion (Single Mode)"
          description="Only one item can be expanded at a time. Click to expand, click again to collapse."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" defaultValue="basic-1" collapsible classNames={getAccordionClassNames()}>
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

        {/* ---------------------------------------------------------------- */}
        {/* Non-Collapsible */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Non-Collapsible (Single Mode)"
          description="At least one item must always be open. Try clicking the expanded item - it won't close."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" defaultValue="nc-1" collapsible={false} classNames={getAccordionClassNames()}>
              <AccordionItem value="nc-1">
                <AccordionTrigger>First Item (Always One Open)</AccordionTrigger>
                <AccordionContent>
                  This accordion always keeps at least one item open.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="nc-2">
                <AccordionTrigger>Second Item</AccordionTrigger>
                <AccordionContent>
                  Click me to switch - but you can't close everything.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Multiple Expanded Items */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Multiple Expanded Items"
          description='Multiple items can be expanded simultaneously using type="multiple".'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="multiple" defaultValue={["multi-1", "multi-2"]} classNames={getAccordionClassNames()}>
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

        {/* ---------------------------------------------------------------- */}
        {/* Controlled Mode (Single) */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Controlled Mode (Single)"
          description="The expanded state is controlled externally via value and onValueChange."
          isDarkMode={isDarkMode}
        >
          <div
            className={`mb-3 p-3 rounded-lg flex items-center gap-4 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Current value:
            </span>
            <span className={`text-sm font-mono ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {singleValue || "none"}
            </span>
            <button
              className="ml-auto px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => setSingleValue("item-2")}
            >
              Open Item 2
            </button>
            <button
              className={`px-3 py-1 text-sm rounded transition-colors ${
                isDarkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
              onClick={() => setSingleValue("")}
            >
              Close All
            </button>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion
              type="single"
              value={singleValue}
              onValueChange={setSingleValue}
              collapsible
              classNames={getAccordionClassNames()}
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

        {/* ---------------------------------------------------------------- */}
        {/* Controlled Mode (Multiple) */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Controlled Mode (Multiple)"
          description="Track and control multiple expanded items externally."
          isDarkMode={isDarkMode}
        >
          <div
            className={`mb-3 p-3 rounded-lg flex items-center gap-4 flex-wrap ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Current values:
            </span>
            <span className={`text-sm font-mono ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              [{multipleValue.join(", ")}]
            </span>
            <div className="ml-auto flex gap-2">
              <button
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => setMultipleValue(["multi-1", "multi-2", "multi-3"])}
              >
                Open All
              </button>
              <button
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  isDarkMode
                    ? "bg-gray-600 text-white hover:bg-gray-500"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
                onClick={() => setMultipleValue([])}
              >
                Close All
              </button>
            </div>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion
              type="multiple"
              value={multipleValue}
              onValueChange={setMultipleValue}
              classNames={getAccordionClassNames()}
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

        {/* ---------------------------------------------------------------- */}
        {/* Keyboard Navigation */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Keyboard Navigation"
          description="Focus a trigger and use arrow keys to navigate. Full WAI-ARIA keyboard support."
          isDarkMode={isDarkMode}
        >
          <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <table className="text-sm w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                  <th className={`text-left py-2 pr-4 font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Key
                  </th>
                  <th className={`text-left py-2 font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-600" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-2 pr-4">
                    <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>Space</kbd> / <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>Enter</kbd>
                  </td>
                  <td className={`py-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Toggle expanded state
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>↓</kbd> / <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>↑</kbd>
                  </td>
                  <td className={`py-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Move to next/previous item (vertical mode)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>→</kbd> / <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>←</kbd>
                  </td>
                  <td className={`py-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Move to next/previous item (horizontal mode)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>Home</kbd>
                  </td>
                  <td className={`py-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Jump to first item
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>End</kbd>
                  </td>
                  <td className={`py-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Jump to last item
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${
                      isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
                    }`}>Tab</kbd>
                  </td>
                  <td className={`py-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Move focus out of accordion
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
              <AccordionItem value="kb-1">
                <AccordionTrigger>Click here to focus, then use ↓</AccordionTrigger>
                <AccordionContent>
                  Use keyboard to navigate between items. Press Space or Enter to toggle.
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
                <AccordionTrigger>Navigation wraps around (loop=true)</AccordionTrigger>
                <AccordionContent>
                  Pressing ↓ on the last item moves to the first, and vice versa.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Icons */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Icons (Plus/Minus)"
          description="Use expandedIcon and collapsedIcon props for custom indicators."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
              <AccordionItem value="icon-1">
                <AccordionTrigger
                  expandedIcon={<MinusIcon className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />}
                  collapsedIcon={<PlusIcon className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />}
                >
                  Click to expand
                </AccordionTrigger>
                <AccordionContent>
                  Using Plus/Minus icons instead of chevrons.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="icon-2">
                <AccordionTrigger
                  expandedIcon={<MinusIcon className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />}
                  collapsedIcon={<PlusIcon className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />}
                >
                  Another section
                </AccordionTrigger>
                <AccordionContent>Content with custom icons.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Icon Position */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Icon Position"
          description='Position icons on the left with iconPosition="left" or hide them with iconPosition="none".'
          isDarkMode={isDarkMode}
        >
          <div className="space-y-4">
            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Left position
              </p>
              <DemoWrapper isDarkMode={isDarkMode}>
                <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                  <AccordionItem value="left-1">
                    <AccordionTrigger
                      iconPosition="left"
                      expandedIcon={<ChevronUpIcon className="w-4 h-4 text-blue-500" />}
                      collapsedIcon={<ChevronDownIcon className="w-4 h-4 text-blue-500" />}
                    >
                      Icon on the left
                    </AccordionTrigger>
                    <AccordionContent>
                      The icon is positioned before the title.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="left-2">
                    <AccordionTrigger
                      iconPosition="left"
                      expandedIcon={<ChevronUpIcon className="w-4 h-4 text-blue-500" />}
                      collapsedIcon={<ChevronDownIcon className="w-4 h-4 text-blue-500" />}
                    >
                      Second item
                    </AccordionTrigger>
                    <AccordionContent>Another section with left-positioned icon.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>

            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                No icon
              </p>
              <DemoWrapper isDarkMode={isDarkMode}>
                <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                  <AccordionItem value="noicon-1">
                    <AccordionTrigger iconPosition="none">No indicator icon</AccordionTrigger>
                    <AccordionContent>
                      Clean design without expand/collapse indicators.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="noicon-2">
                    <AccordionTrigger iconPosition="none">Another clean item</AccordionTrigger>
                    <AccordionContent>Minimalist accordion style.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Disabled States */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Disabled States"
          description="Individual items or the entire accordion can be disabled."
          isDarkMode={isDarkMode}
        >
          <div className="space-y-4">
            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Disabled item
              </p>
              <DemoWrapper isDarkMode={isDarkMode}>
                <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                  <AccordionItem value="dis-1">
                    <AccordionTrigger>Available Section</AccordionTrigger>
                    <AccordionContent>This section is available.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dis-2" disabled>
                    <AccordionTrigger>Premium Feature (Locked)</AccordionTrigger>
                    <AccordionContent>This content requires a premium subscription.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="dis-3">
                    <AccordionTrigger>Another Available Section</AccordionTrigger>
                    <AccordionContent>This section is also available.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>

            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Entire accordion disabled
              </p>
              <DemoWrapper isDarkMode={isDarkMode}>
                <Accordion type="single" collapsible disabled classNames={getAccordionClassNames()}>
                  <AccordionItem value="all-dis-1">
                    <AccordionTrigger>All Disabled 1</AccordionTrigger>
                    <AccordionContent>Content 1</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="all-dis-2">
                    <AccordionTrigger>All Disabled 2</AccordionTrigger>
                    <AccordionContent>Content 2</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom Styling */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Styling with classNames"
          description="Use the classNames prop to customize all parts at once (root, item, trigger, content, icon)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper
            isDarkMode={isDarkMode}
            className={isDarkMode ? "bg-blue-900/30! border-blue-800!" : "bg-blue-50! border-blue-200!"}
          >
            <Accordion
              type="single"
              collapsible
              classNames={{
                root: "divide-y divide-blue-200 dark:divide-blue-800",
                item: isDarkMode
                  ? "border-b border-blue-800 last:border-b-0"
                  : "border-b border-blue-200 last:border-b-0",
                trigger: `flex w-full items-center justify-between px-6 py-5 text-left font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isDarkMode
                    ? "text-blue-200 hover:bg-blue-800/50"
                    : "text-blue-900 hover:bg-blue-100"
                }`,
                content: isDarkMode ? "px-6 py-5 text-blue-200" : "px-6 py-5 text-blue-800",
                icon: `h-5 w-5 transition-transform duration-200 ${
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                }`,
              }}
            >
              <AccordionItem value="styled-1">
                <AccordionTrigger>Custom Blue Theme</AccordionTrigger>
                <AccordionContent>
                  Completely customized styling using the classNames prop.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="styled-2">
                <AccordionTrigger>Consistent Styling</AccordionTrigger>
                <AccordionContent>
                  All items share the same custom styles defined once at the root.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Animation Duration */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Animation Duration"
          description="Use animationDuration to customize the expand/collapse speed (in milliseconds)."
          isDarkMode={isDarkMode}
        >
          <div className="space-y-4">
            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Fast animation (100ms)
              </p>
              <DemoWrapper isDarkMode={isDarkMode}>
                <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                  <AccordionItem value="fast-1">
                    <AccordionTrigger>Fast animation</AccordionTrigger>
                    <AccordionContent animationDuration={100}>
                      This content expands and collapses quickly at 100ms.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Slow animation (800ms)
              </p>
              <DemoWrapper isDarkMode={isDarkMode}>
                <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                  <AccordionItem value="slow-1">
                    <AccordionTrigger>Slow animation</AccordionTrigger>
                    <AccordionContent animationDuration={800}>
                      This content expands and collapses slowly at 800ms.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Animation Callbacks */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Animation Callbacks"
          description="Use onOpenStart, onOpenEnd, onCloseStart, onCloseEnd for animation hooks."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
              <AccordionItem value="anim-1">
                <AccordionTrigger>Check console for callbacks</AccordionTrigger>
                <AccordionContent
                  onOpenStart={() => console.log("Opening started")}
                  onOpenEnd={() => console.log("Opening ended")}
                  onCloseStart={() => console.log("Closing started")}
                  onCloseEnd={() => console.log("Closing ended")}
                >
                  Open the browser console and expand/collapse to see callback logs.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Force Mount */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Force Mount (Keep in DOM)"
          description="Use forceMount to keep content in DOM when collapsed (useful for SEO or animations)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
              <AccordionItem value="force-1">
                <AccordionTrigger>Force Mounted Content</AccordionTrigger>
                <AccordionContent forceMount>
                  This content stays in the DOM even when collapsed (inspect to verify).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="force-2">
                <AccordionTrigger>Lazy Rendered (Default)</AccordionTrigger>
                <AccordionContent>
                  This content is removed from DOM when collapsed.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Heading Level */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom Heading Level"
          description="Set the heading level for accessibility with headingLevel (1-6)."
          isDarkMode={isDarkMode}
        >
          <div className="space-y-4">
            {[2, 3, 4, 5].map((level) => (
              <div key={level}>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Heading level {level} (h{level})
                </p>
                <DemoWrapper isDarkMode={isDarkMode}>
                  <Accordion
                    type="single"
                    collapsible
                    headingLevel={level as 1 | 2 | 3 | 4 | 5 | 6}
                    classNames={getAccordionClassNames()}
                  >
                    <AccordionItem value={`h${level}-1`}>
                      <AccordionTrigger>This uses h{level} (inspect to verify)</AccordionTrigger>
                      <AccordionContent>
                        The trigger is wrapped in an h{level} element for proper document outline.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </DemoWrapper>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Orientation */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Orientation (Keyboard Navigation)"
          description='The orientation prop changes which arrow keys are used. Default is "vertical" (↑↓), set to "horizontal" for ←→.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" collapsible orientation="horizontal" classNames={getAccordionClassNames()}>
              <AccordionItem value="horiz-1">
                <AccordionTrigger>Focus here, use ← → to navigate</AccordionTrigger>
                <AccordionContent>
                  With orientation="horizontal", use left/right arrows.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="horiz-2">
                <AccordionTrigger>Press → to go to next item</AccordionTrigger>
                <AccordionContent>Second item content.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="horiz-3">
                <AccordionTrigger>Press ← to go to previous item</AccordionTrigger>
                <AccordionContent>Third item content.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* RTL Support */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="RTL Support (dir)"
          description='The dir prop reverses left/right arrow keys when orientation="horizontal". Use for RTL languages.'
          isDarkMode={isDarkMode}
        >
          <div
            className={`mb-4 p-3 rounded-lg ${
              isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"
            }`}
          >
            <p className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <strong>With dir="rtl" + orientation="horizontal":</strong><br />
              <kbd className={`px-1 py-0.5 border rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
              }`}>←</kbd> = next item,{" "}
              <kbd className={`px-1 py-0.5 border rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
              }`}>→</kbd> = previous item
            </p>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <div dir="rtl">
              <Accordion type="single" collapsible dir="rtl" orientation="horizontal" classNames={getAccordionClassNames()}>
                <AccordionItem value="rtl-1">
                  <AccordionTrigger>العنصر الأول - اضغط ← للتالي</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-right">
                      محتوى العنصر الأول. اضغط ← للانتقال إلى العنصر التالي.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rtl-2">
                  <AccordionTrigger>العنصر الثاني</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-right">محتوى العنصر الثاني.</div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rtl-3">
                  <AccordionTrigger>العنصر الثالث - اضغط → للسابق</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-right">محتوى العنصر الثالث.</div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* No Loop Navigation */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="No Loop Navigation"
          description="Set loop={false} to prevent keyboard navigation from wrapping around."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" collapsible loop={false} classNames={getAccordionClassNames()}>
              <AccordionItem value="noloop-1">
                <AccordionTrigger>First item (↑ won't wrap to last)</AccordionTrigger>
                <AccordionContent>
                  Press ↑ here - focus stays on this item.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="noloop-2">
                <AccordionTrigger>Middle item</AccordionTrigger>
                <AccordionContent>Normal navigation between adjacent items.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="noloop-3">
                <AccordionTrigger>Last item (↓ won't wrap to first)</AccordionTrigger>
                <AccordionContent>
                  Press ↓ here - focus stays on this item.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Custom ID and ARIA Label */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Custom ID and ARIA Label"
          description="Use id for predictable element IDs and aria-label for accessibility."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion
              type="single"
              collapsible
              id="faq-accordion"
              aria-label="Frequently Asked Questions"
              classNames={getAccordionClassNames()}
            >
              <AccordionItem value="faq-1">
                <AccordionTrigger>Inspect to see predictable IDs</AccordionTrigger>
                <AccordionContent>
                  Trigger ID: faq-accordion-trigger-faq-1, Content ID: faq-accordion-content-faq-1
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>Useful for testing and SSR</AccordionTrigger>
                <AccordionContent>
                  Predictable IDs make automated testing and server-side rendering easier.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Focus Capture Events */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Focus Capture Events"
          description="Use onFocusCapture and onBlurCapture to track focus within the accordion."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion
              type="single"
              collapsible
              onFocusCapture={() => console.log("Focus entered accordion")}
              onBlurCapture={() => console.log("Focus left accordion")}
              classNames={getAccordionClassNames()}
            >
              <AccordionItem value="focus-capture-1">
                <AccordionTrigger>Check console when focusing/blurring</AccordionTrigger>
                <AccordionContent>
                  Tab into and out of the accordion to see focus capture events logged.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="focus-capture-2">
                <AccordionTrigger>Another item</AccordionTrigger>
                <AccordionContent>Focus events fire at the accordion root level.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Render Delegation (asChild) */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Render Delegation (asChild)"
          description="Use asChild to render a different element while keeping all accordion behavior."
          isDarkMode={isDarkMode}
        >
          <div className="space-y-4">
            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Root renders as nav element
              </p>
              <Accordion type="single" collapsible asChild classNames={getAccordionClassNames()}>
                <nav
                  className={`border rounded-lg overflow-hidden ${
                    isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                  }`}
                >
                  <AccordionItem value="aschild-nav-1">
                    <AccordionTrigger>Root renders as nav element</AccordionTrigger>
                    <AccordionContent>
                      The Accordion root is now a semantic nav element.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="aschild-nav-2">
                    <AccordionTrigger>Another navigation item</AccordionTrigger>
                    <AccordionContent>
                      Useful for navigation menus with collapsible sections.
                    </AccordionContent>
                  </AccordionItem>
                </nav>
              </Accordion>
            </div>

            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Item renders as section element
              </p>
              <DemoWrapper isDarkMode={isDarkMode}>
                <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                  <AccordionItem value="aschild-section-1" asChild>
                    <section
                      className={`${
                        isDarkMode ? "border-b border-gray-700 last:border-b-0" : "border-b border-gray-200 last:border-b-0"
                      }`}
                    >
                      <AccordionTrigger>Item renders as section element</AccordionTrigger>
                      <AccordionContent>
                        The AccordionItem is now a semantic section element.
                      </AccordionContent>
                    </section>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>

            <div>
              <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Content renders as article element
              </p>
              <DemoWrapper isDarkMode={isDarkMode}>
                <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                  <AccordionItem value="aschild-content-1">
                    <AccordionTrigger>Content renders as article element</AccordionTrigger>
                    <AccordionContent asChild>
                      <article className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        The AccordionContent is now a semantic article element.
                      </article>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DemoWrapper>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Dynamic Items */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Dynamic Items"
          description="Add and remove accordion items dynamically."
          isDarkMode={isDarkMode}
        >
          <div className={`mb-3 flex gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <button
              onClick={addItem}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add Item
            </button>
            <span className="text-sm py-1">
              {dynamicItems.length} item{dynamicItems.length !== 1 ? "s" : ""}
            </span>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
              {dynamicItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>
                    <span className="flex-1">{item.title}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center justify-between">
                      <span>{item.content}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Nested Accordions */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Nested Accordions"
          description="Accordions can be nested inside each other for hierarchical content."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
              <AccordionItem value="nested-1">
                <AccordionTrigger>Parent Item 1</AccordionTrigger>
                <AccordionContent>
                  <div className={`ml-4 border-l-2 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                      <AccordionItem value="nested-1-1">
                        <AccordionTrigger>Child Item 1.1</AccordionTrigger>
                        <AccordionContent>Nested content 1.1</AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="nested-1-2">
                        <AccordionTrigger>Child Item 1.2</AccordionTrigger>
                        <AccordionContent>Nested content 1.2</AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="nested-2">
                <AccordionTrigger>Parent Item 2</AccordionTrigger>
                <AccordionContent>
                  <div className={`ml-4 border-l-2 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <Accordion type="single" collapsible classNames={getAccordionClassNames()}>
                      <AccordionItem value="nested-2-1">
                        <AccordionTrigger>Child Item 2.1</AccordionTrigger>
                        <AccordionContent>Nested content 2.1</AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Async Loading */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Async Loading Content"
          description="Load content asynchronously when an item is expanded."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion
              type="single"
              collapsible
              classNames={getAccordionClassNames()}
              onValueChange={(value) => {
                if (value) loadContent(value);
              }}
            >
              {["async-1", "async-2", "async-3"].map((id) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger>Load content for {id}</AccordionTrigger>
                  <AccordionContent>
                    {loadingItems.has(id) ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : asyncData[id] ? (
                      asyncData[id]
                    ) : (
                      "Click to load content..."
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Form Inside Accordion */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Accordion with Form"
          description="Use accordions to organize form sections."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <form onSubmit={(e) => e.preventDefault()}>
              <Accordion type="multiple" defaultValue={["form-personal"]} classNames={getAccordionClassNames()}>
                <AccordionItem value="form-personal">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <span>Personal Information</span>
                      {formData.personalInfo.name && formData.personalInfo.email && (
                        <span className="text-green-500 text-xs">✓ Complete</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.personalInfo.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, name: e.target.value },
                            }))
                          }
                          className={`w-full px-3 py-2 rounded border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.personalInfo.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, email: e.target.value },
                            }))
                          }
                          className={`w-full px-3 py-2 rounded border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="form-address">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <span>Address</span>
                      {formData.address.street && formData.address.city && formData.address.zip && (
                        <span className="text-green-500 text-xs">✓ Complete</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Street
                        </label>
                        <input
                          type="text"
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: { ...prev.address, street: e.target.value },
                            }))
                          }
                          className={`w-full px-3 py-2 rounded border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          placeholder="Street address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-1 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                address: { ...prev.address, city: e.target.value },
                              }))
                            }
                            className={`w-full px-3 py-2 rounded border ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-1 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={formData.address.zip}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                address: { ...prev.address, zip: e.target.value },
                              }))
                            }
                            className={`w-full px-3 py-2 rounded border ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                            placeholder="ZIP"
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="form-preferences">
                  <AccordionTrigger>Preferences</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.preferences.newsletter}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              preferences: { ...prev.preferences, newsletter: e.target.checked },
                            }))
                          }
                          className="rounded"
                        />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                          Subscribe to newsletter
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              preferences: { ...prev.preferences, notifications: e.target.checked },
                            }))
                          }
                          className="rounded"
                        />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                          Enable notifications
                        </span>
                      </label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Rich Content */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Rich Content"
          description="Both triggers and content support any React nodes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion type="multiple" defaultValue={["rich-1"]} classNames={getAccordionClassNames()}>
              <AccordionItem value="rich-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-semibold">Active Services</span>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        isDarkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-700"
                      }`}
                    >
                      3 running
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      API Server - Running on port 3000
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Database - Connected
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Cache Server - Online
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="rich-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="font-semibold">Alerts</span>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700"
                      }`}
                    >
                      2 critical
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-red-900/30 border border-red-800" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p className={`font-medium ${isDarkMode ? "text-red-200" : "text-red-800"}`}>
                        High CPU Usage
                      </p>
                      <p className={`text-sm ${isDarkMode ? "text-red-300" : "text-red-600"}`}>
                        Server-02 is at 95% CPU utilization
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-red-900/30 border border-red-800" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p className={`font-medium ${isDarkMode ? "text-red-200" : "text-red-800"}`}>
                        Memory Warning
                      </p>
                      <p className={`text-sm ${isDarkMode ? "text-red-300" : "text-red-600"}`}>
                        Available memory below 10%
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* With Ref */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Using Refs"
          description="Access the DOM element using forwardRef."
          isDarkMode={isDarkMode}
        >
          <div className="mb-3">
            <button
              onClick={() => {
                if (accordionRef.current) {
                  console.log("Accordion element:", accordionRef.current);
                  console.log("Accordion ID:", accordionRef.current.id);
                  alert(`Accordion ID: ${accordionRef.current.id}`);
                }
              }}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Log Ref to Console
            </button>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <Accordion
              ref={accordionRef}
              type="single"
              collapsible
              id="ref-demo-accordion"
              classNames={getAccordionClassNames()}
            >
              <AccordionItem value="ref-1">
                <AccordionTrigger>Click button above to access ref</AccordionTrigger>
                <AccordionContent>
                  The accordion exposes a ref to the root DOM element.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DemoWrapper>
        </Section>
      </div>

      {/* ================================================================== */}
      {/* API REFERENCE SECTION */}
      {/* ================================================================== */}
      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          API Reference
        </h2>

        {/* Accordion Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Accordion
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">type</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "single" | "multiple"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>required</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether one or multiple items can be open
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">value</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    string | string[]
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Controlled expanded value(s)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">defaultValue</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    string | string[]
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Initial expanded value(s) for uncontrolled mode
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onValueChange</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    (value) =&gt; void
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when expanded items change
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">collapsible</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Allow collapsing all items (single mode only)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Disable all items
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">orientation</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "vertical" | "horizontal"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"vertical"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Keyboard navigation direction (↑↓ or ←→)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">dir</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "ltr" | "rtl"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"ltr"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Reverses ←→ keys in horizontal mode for RTL
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loop</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>true</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether keyboard navigation wraps around
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">id</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>auto-generated</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    ID for predictable child element IDs
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">aria-label</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Accessible label for the accordion
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">headingLevel</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>1 | 2 | 3 | 4 | 5 | 6</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>3</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Heading level for triggers (h1-h6)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">classNames</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>AccordionClassNames</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>defaults</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom classes for root, item, trigger, content, icon
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Additional CSS class for the root element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Render as child element instead of div
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onFocusCapture</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(event) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when focus enters the accordion
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onBlurCapture</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(event) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when focus leaves the accordion
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AccordionItem Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            AccordionItem
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">value</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>required</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Unique identifier for this item
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Disable this specific item
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Additional CSS class for the item wrapper
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Render as child element instead of div
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AccordionTrigger Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            AccordionTrigger
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">expandedIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>ChevronDown (rotated)</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom icon when expanded
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">collapsedIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>ChevronDown</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom icon when collapsed
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">iconPosition</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "left" | "right" | "none"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"right"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Position of the indicator icon
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Additional CSS class for the trigger button
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Render as child element instead of button
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AccordionContent Props */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            AccordionContent
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">forceMount</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Keep content in DOM when collapsed
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">animationDuration</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>300</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Animation duration in ms
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onOpenStart</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>() =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Called when opening animation starts
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onOpenEnd</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>() =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Called when opening animation ends
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onCloseStart</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>() =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Called when closing animation starts
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onCloseEnd</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>() =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Called when closing animation ends
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Additional CSS class for the content wrapper
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Render as child element instead of div
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Attributes */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Data Attributes
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            All components expose data attributes for styling with CSS selectors:
          </p>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Attribute</th>
                  <th className="text-left py-3 pr-4 font-semibold">Component</th>
                  <th className="text-left py-3 pr-4 font-semibold">Values</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-state</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Accordion</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "has-expanded" | "all-closed"
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether any item is expanded
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-state</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Item/Trigger/Content
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "open" | "closed"
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Current expanded state
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Item/Trigger/Content
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>present when disabled</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether item is disabled
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-orientation</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>All</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "vertical" | "horizontal"
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Keyboard navigation direction
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">data-type</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Accordion</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "single" | "multiple"
                  </td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Accordion mode
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ARIA Attributes */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            ARIA Attributes
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Automatically applied for accessibility:
          </p>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Attribute</th>
                  <th className="text-left py-3 pr-4 font-semibold">Component</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">aria-expanded</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Trigger</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Current expanded state (true/false)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">aria-controls</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Trigger</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    ID of the controlled content panel
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">aria-labelledby</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Content</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    ID of the trigger that labels this content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">aria-hidden</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Content</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Hidden from screen readers when collapsed
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">role="region"</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Content</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Identifies content as a region landmark
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AccordionClassNames Type */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            AccordionClassNames Type
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`interface AccordionClassNames {
  root?: string;    // Root accordion container
  item?: string;    // Each accordion item
  trigger?: string; // Trigger button
  content?: string; // Content panel
  icon?: string;    // Expand/collapse icon
}`}
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* ACCESSIBILITY SECTION */}
      {/* ================================================================== */}
      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Accessibility
        </h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            WAI-ARIA Compliance
          </h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>Follows the WAI-ARIA Accordion Pattern</li>
            <li>Proper heading hierarchy using configurable heading levels (h1-h6)</li>
            <li>Full keyboard navigation support (Arrow keys, Home, End, Tab)</li>
            <li>Screen reader friendly with proper ARIA attributes</li>
            <li>Focus management with visible focus indicators</li>
            <li>Supports RTL text direction for internationalization</li>
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Keyboard Shortcuts
          </h3>
          <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>Enter</kbd> / <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>Space</kbd> - Toggle the focused accordion item
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>↑</kbd> / <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>↓</kbd> - Navigate between items (vertical orientation)
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>←</kbd> / <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>→</kbd> - Navigate between items (horizontal orientation)
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>Home</kbd> - Jump to first item
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>End</kbd> - Jump to last item
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"
              }`}>Tab</kbd> - Move focus to next focusable element
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccordionDemo;
