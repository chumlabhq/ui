import type { ReactNode } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Accordion } from "../../components/Accordion/index.js";
import AccordionItem from "../../components/Accordion/components/AccordionItem.js";
import AccordionTrigger from "../../components/Accordion/components/AccordionTrigger.js";
import AccordionContent from "../../components/Accordion/components/AccordionContent.js";
import { Breadcrumb } from "../../components/Breadcrumb/index.js";
import { Button } from "../../components/Button/index.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import { Checkbox } from "../../components/Checkbox/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";
import { Drawer, DrawerCloseButton, DrawerHeader } from "../../components/Drawer/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
import { InternationalPhoneInput } from "../../components/InternationalPhoneInput/index.js";
import { Modal } from "../../components/Modal/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { RadioButton, RadioGroup } from "../../components/RadioButton/index.js";
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { Stepper } from "../../components/Stepper/index.js";
import { Switch } from "../../components/Switch/index.js";
import { Table } from "../../components/Table/index.js";
import { TabPanel } from "../../components/TabPanel/index.js";
import { TimePicker } from "../../components/TimePicker/index.js";
import { Toast } from "../../components/Toast/index.js";

/** 200 characters, with spaces to wrap at. */
export const LONG_LABEL =
  "This label is deliberately long so that it wraps across several lines in a narrow column and shows whether the control beside it keeps its size or gives up width to the words that sit next to it.";

const Glyph = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const options = (t: string) => [
  { value: "a", label: t },
  { value: "b", label: `${t} B` },
];

/** Every component that draws a fixed-size visual in a row beside text a reader writes. */
export const CONTROL_SIZE: Record<string, (t: string) => ReactNode> = {
  Checkbox: (t) => <Checkbox label={t} description={t} defaultChecked />,
  Switch: (t) => <Switch label={t} description={t} defaultChecked />,
  RadioButton: (t) => (
    <RadioGroup label="Plan" defaultValue="a">
      <RadioButton value="a" label={t} description={t} />
      <RadioButton value="b" label={t} />
    </RadioGroup>
  ),
  Accordion: (t) => (
    <Accordion selectionMode="single" collapsible defaultValue="one">
      <AccordionItem value="one">
        <AccordionTrigger subtitle={t} leftSlot={<Glyph />}>
          {t}
        </AccordionTrigger>
        <AccordionContent>{t}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  Button: (t) => (
    <Button startIcon={<Glyph />} endIcon={<Glyph />}>
      {t}
    </Button>
  ),
  Stepper: (t) => (
    <Stepper
      orientation="vertical"
      value={1}
      steps={[
        { id: "one", label: t, description: t },
        { id: "two", label: t, description: t },
        { id: "three", label: t },
      ]}
    />
  ),
  TabPanel: (t) => (
    <TabPanel tabs={[{ id: "one", label: t, icon: <Glyph />, count: 3 }, { id: "two", label: t }]}>{(tab) => tab.label}</TabPanel>
  ),
  Toast: (t) => <Toast id="t" message={t} description={t} variant="success" onDismiss={() => {}} />,
  Dropdown: (t) => <Dropdown label={t} options={options(t)} defaultValue="a" defaultOpen />,
  SearchableDropdown: (t) => <SearchableDropdown label={t} options={options(t)} defaultValue="a" defaultOpen />,
  MultiSelectDropdown: (t) => <MultiSelectDropdown label={t} options={options(t)} defaultValue={["a"]} defaultOpen />,
  MultiSelectSearchableDropdown: (t) => (
    <MultiSelectSearchableDropdown label={t} options={options(t)} defaultValue={["a"]} defaultOpen />
  ),
  CascadingDropdown: (t) => (
    <CascadingDropdown
      label={t}
      options={[{ value: "p", label: t, selectionMode: "multi" as const, children: options(t) }, { value: "q", label: t }]}
      defaultOpen
    />
  ),
  DatePicker: (t) => <DatePicker label={t} description={t} />,
  TimePicker: (t) => <TimePicker label={t} description={t} />,
  InternationalPhoneInput: (t) => <InternationalPhoneInput label={t} description={t} />,
  Modal: (t) => (
    <Modal title={t} description={t} open onOpenChange={() => {}}>
      {t}
    </Modal>
  ),
  Drawer: (t) => (
    <Drawer open onOpenChange={() => {}}>
      <DrawerHeader>{t}</DrawerHeader>
      <DrawerCloseButton />
      {t}
    </Drawer>
  ),
  Breadcrumb: (t) => <Breadcrumb items={[{ id: "a", label: t }, { id: "b", label: t }, { id: "c", label: t }]} />,
  Table: (t) => (
    <Table
      data={[{ id: "1", name: t, role: t }]}
      columns={[
        { id: "name", accessorKey: "name", header: t },
        { id: "role", accessorKey: "role", header: t },
      ]}
      getRowId={(r: { id: string }) => r.id}
      sortable
      selectionMode="multiple"
    />
  ),
};

/**
 * `/__fixtures/control-size/<Component>?text=long|short&width=384|full`: one
 * component with every label it takes set to `text`, in a column `width` wide.
 *
 * Not a registry fixture, for the reason `FormRoute` gives.
 */
export default function ControlSizeRoute() {
  const { component = "" } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const render = CONTROL_SIZE[component];
  if (!render) return <p data-fixture-error="">No control-size subject for "{component}".</p>;
  const text = query.get("text") === "short" ? "Accept" : LONG_LABEL;
  const width = query.get("width") === "384" ? 384 : undefined;
  return (
    <main data-control-size={component} style={{ padding: 16 }}>
      <div data-subject style={{ width }}>
        {render(text)}
      </div>
    </main>
  );
}
