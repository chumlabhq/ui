import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@chumlab/ui/accordion";
import { Avatar } from "@chumlab/ui/avatar";
import { Breadcrumb } from "@chumlab/ui/breadcrumb";
import { Button } from "@chumlab/ui/button";
import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";
import { Checkbox } from "@chumlab/ui/checkbox";
import { CountryFlag } from "@chumlab/ui/country-flag";
import { DatePicker } from "@chumlab/ui/date-picker";
import { Dropdown } from "@chumlab/ui/dropdown";
import { Input } from "@chumlab/ui/input";
import { InternationalPhoneInput } from "@chumlab/ui/international-phone-input";
import { CircularLoader, DotLoader, LinearLoader, PulseLoader } from "@chumlab/ui/loader";
import { MultiSelectDropdown } from "@chumlab/ui/multi-select-dropdown";
import { MultiSelectSearchableDropdown } from "@chumlab/ui/multi-select-searchable-dropdown";
import { OtpInput } from "@chumlab/ui/otp-input";
import { Pagination } from "@chumlab/ui/pagination";
import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";
import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";
import { Slider } from "@chumlab/ui/slider";
import { Stepper } from "@chumlab/ui/stepper";
import { Switch } from "@chumlab/ui/switch";
import { Table } from "@chumlab/ui/table";
import { TabPanel } from "@chumlab/ui/tab-panel";
import { TextArea } from "@chumlab/ui/textarea";
import { TimePicker } from "@chumlab/ui/time-picker";
import { Tooltip } from "@chumlab/ui/tooltip";
import type { ReactNode } from "react";
import { DrawerDemo, HydrationCanary, ModalDemo, ToastDemo } from "./interactive";

/**
 * All thirty components, once each, for every general consumer template.
 *
 * The matrix rendered four of them — a control, an overlay, an anchored surface
 * and a data surface — which proved the package installs and resolves. It could
 * not prove that the other twenty-six do anything in a real framework: a
 * component reading `document` at module scope, or missing its "use client",
 * takes down only the build that imports it.
 *
 * Every entry is imported from its OWN subpath rather than the root barrel, so
 * the thirty `exports` entries are exercised by an import a bundler has to
 * resolve, not only by publint reading the manifest.
 *
 * Deliberately not marked "use client": under the App Router this module is a
 * server component, so every client boundary below has to come from the
 * library's own directives. Marking it would test the template instead of the
 * package. That is also why every prop here is a plain value — a function prop
 * crossing the server boundary is a Next error about the consumer. The three
 * components that cannot be driven without one (Modal, Drawer and Toast all
 * need a host to own `open`) come from `interactive.tsx`, which is the consumer
 * client boundary a real application would write for them.
 */
const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

const CRUMBS = [
  { id: "home", label: "Home", href: "/" },
  { id: "docs", label: "Docs", href: "/docs" },
  { id: "here", label: "Here" },
];

const STEPS = [
  { id: "one", label: "Details" },
  { id: "two", label: "Payment" },
  { id: "three", label: "Done" },
];

// Both enabled: the fixture set's second tab is disabled, which is the state a
// tab-switch smoke test cannot move off.
const TABS = [
  { id: "one", label: "First" },
  { id: "two", label: "Second" },
];

const ROWS = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Admiral" },
];

const COLUMNS = [
  { id: "name", accessorKey: "name", header: "Name" },
  { id: "role", accessorKey: "role", header: "Role" },
];

const NESTED = [
  {
    value: "fruit",
    label: "Fruit",
    children: [
      { value: "a", label: "Apple" },
      { value: "b", label: "Banana" },
    ],
  },
];

export interface Entry {
  name: string;
  node: ReactNode;
}

export const ENTRIES: Entry[] = [
  {
    name: "Accordion",
    node: (
      <Accordion type="single" collapsible>
        <AccordionItem value="one">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First body</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  { name: "Avatar", node: <Avatar name="Ada Lovelace" /> },
  { name: "Breadcrumb", node: <Breadcrumb items={CRUMBS} /> },
  { name: "Button", node: <Button>Save</Button> },
  { name: "CascadingDropdown", node: <CascadingDropdown options={NESTED} label="Produce" /> },
  { name: "Checkbox", node: <Checkbox label="Accept" /> },
  { name: "CountryFlag", node: <CountryFlag code="US" /> },
  { name: "DatePicker", node: <DatePicker label="Date" /> },
  { name: "Drawer", node: <DrawerDemo /> },
  { name: "Dropdown", node: <Dropdown options={OPTIONS} label="Fruit" /> },
  { name: "Input", node: <Input label="Email" /> },
  { name: "InternationalPhoneInput", node: <InternationalPhoneInput label="Phone" /> },
  {
    name: "Loader",
    // All four, because the subpath exports four and a loader is exactly the
    // shape that renders on a server and then animates on a client.
    node: (
      <>
        <CircularLoader />
        <LinearLoader />
        <DotLoader />
        <PulseLoader />
      </>
    ),
  },
  { name: "Modal", node: <ModalDemo /> },
  { name: "MultiSelectDropdown", node: <MultiSelectDropdown options={OPTIONS} label="Fruit" /> },
  {
    name: "MultiSelectSearchableDropdown",
    node: <MultiSelectSearchableDropdown options={OPTIONS} label="Fruit" />,
  },
  { name: "OtpInput", node: <OtpInput length={4} label="Code" /> },
  { name: "Pagination", node: <Pagination defaultValue={1} totalPages={5} /> },
  {
    name: "RadioButton",
    node: (
      <RadioGroup label="Fruit">
        <RadioButton value="a" label="Apple" />
        <RadioButton value="b" label="Banana" />
      </RadioGroup>
    ),
  },
  { name: "ResizablePanel", node: <ResizablePanel><div>Panel</div></ResizablePanel> },
  { name: "SearchableDropdown", node: <SearchableDropdown options={OPTIONS} label="Fruit" /> },
  { name: "Slider", node: <Slider label="Volume" defaultValue={40} /> },
  // Started on the second step, by id rather than by index — `value` is a step
  // id — so the first step is complete. Completed steps are the only ones a
  // consumer can click, and a Stepper on step one has nothing to drive.
  { name: "Stepper", node: <Stepper steps={STEPS} defaultValue="two" /> },
  { name: "Switch", node: <Switch label="Notify" /> },
  {
    name: "Table",
    // Sortable and filterable: the sort control is the cheapest affordance to
    // assert, and the filter is Table's only portalled dialog — the part of it
    // a server render has to skip and a client render has to add.
    node: (
      <Table
        data={ROWS}
        columns={COLUMNS}
        sortable
        filterableColumns={{ role: { options: [{ label: "Engineer", value: "Engineer" }] } }}
      />
    ),
  },
  { name: "TabPanel", node: <TabPanel tabs={TABS} /> },
  { name: "TextArea", node: <TextArea label="Bio" /> },
  { name: "TimePicker", node: <TimePicker label="Time" /> },
  { name: "Toast", node: <ToastDemo /> },
  {
    name: "Tooltip",
    node: (
      <Tooltip content="Tip">
        <button type="button">Hover</button>
      </Tooltip>
    ),
  },
];

/**
 * A deliberate hydration mismatch, routed like a component.
 *
 * It is the positive control for the hydration check and it runs on every pass,
 * because a channel that has never fired is a channel nobody has tested — and
 * this one is read differently in each framework. Kept out of ENTRIES so the
 * grid page and the component sweep stay clean.
 */
export const CANARY: Entry = { name: "__canary", node: <HydrationCanary /> };

export const NAMES = [...ENTRIES.map((entry) => entry.name), CANARY.name];
