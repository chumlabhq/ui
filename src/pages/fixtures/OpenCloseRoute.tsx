import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/Breadcrumb/index.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";
import { Drawer, DrawerCloseButton, DrawerHeader } from "../../components/Drawer/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
import { InternationalPhoneInput } from "../../components/InternationalPhoneInput/index.js";
import { Modal } from "../../components/Modal/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { Pagination } from "../../components/Pagination/index.js";
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { Table } from "../../components/Table/index.js";
import { TimePicker } from "../../components/TimePicker/index.js";
import { Tooltip } from "../../components/Tooltip/index.js";
import { COLUMNS, OPTIONS, ROWS } from "../../__tests__/fixtures/_data.js";

const NESTED = [
  { value: "fruit", label: "Fruit", children: [{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }] },
  { value: "veg", label: "Veg", children: [{ value: "c", label: "Carrot" }] },
];
/** No `href`: choosing a collapsed crumb must not leave the page under test. */
const CRUMB_TRAIL = ["Home", "Docs", "Guides", "Forms", "Fields", "Here"].map((label) => ({ id: label.toLowerCase(), label }));
const FILTERABLE = { role: { options: [{ label: "Engineer", value: "Engineer" }], multi: true } };

/** An overlay has no trigger of its own: a button below the fold opens it. */
function WithTrigger({ label, children }: { label: string; children: (open: boolean, setOpen: (open: boolean) => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {label}
      </button>
      {children(open, setOpen)}
    </>
  );
}

/**
 * Every popup in the library. `render(true)` mounts it with `defaultOpen`;
 * `render(false)` mounts it closed, with a trigger the spec opens it from.
 * The four without `defaultOpen` are only ever opened by the spec.
 */
export const OPEN_CLOSE: Record<string, { defaultOpen: boolean; render: (open: boolean) => ReactNode }> = {
  Dropdown: { defaultOpen: true, render: (open) => <Dropdown label="Fruit" options={OPTIONS} defaultOpen={open} /> },
  SearchableDropdown: { defaultOpen: true, render: (open) => <SearchableDropdown label="Fruit" options={OPTIONS} defaultOpen={open} showSearch /> },
  MultiSelectDropdown: { defaultOpen: true, render: (open) => <MultiSelectDropdown label="Fruit" options={OPTIONS} defaultOpen={open} /> },
  MultiSelectSearchableDropdown: {
    defaultOpen: true,
    render: (open) => <MultiSelectSearchableDropdown label="Fruit" options={OPTIONS} defaultOpen={open} showSearch />,
  },
  CascadingDropdown: {
    defaultOpen: true,
    render: (open) => <CascadingDropdown label="Food" options={NESTED} defaultOpen={open} showMenuSearch />,
  },
  DatePicker: { defaultOpen: true, render: (open) => <DatePicker label="Date" defaultOpen={open} /> },
  TimePicker: { defaultOpen: true, render: (open) => <TimePicker label="Time" defaultOpen={open} /> },
  Tooltip: {
    defaultOpen: true,
    render: (open) => (
      <Tooltip content="Tip" defaultOpen={open}>
        <button type="button">Trigger</button>
      </Tooltip>
    ),
  },
  Modal: {
    defaultOpen: true,
    render: (open) =>
      open ? (
        <Modal title="Title" defaultOpen>
          <button type="button">Inside</button>
        </Modal>
      ) : (
        <WithTrigger label="Open Modal">
          {(isOpen, setOpen) => (
            <Modal title="Title" open={isOpen} onOpenChange={setOpen}>
              <button type="button">Inside</button>
            </Modal>
          )}
        </WithTrigger>
      ),
  },
  Drawer: {
    defaultOpen: true,
    render: (open) =>
      open ? (
        <Drawer defaultOpen>
          <DrawerHeader>Drawer</DrawerHeader>
          <DrawerCloseButton />
          <button type="button">Inside</button>
        </Drawer>
      ) : (
        <WithTrigger label="Open Drawer">
          {(isOpen, setOpen) => (
            <Drawer open={isOpen} onOpenChange={setOpen}>
              <DrawerHeader>Drawer</DrawerHeader>
              <DrawerCloseButton />
              <button type="button">Inside</button>
            </Drawer>
          )}
        </WithTrigger>
      ),
  },
  InternationalPhoneInput: { defaultOpen: false, render: () => <InternationalPhoneInput label="Phone" /> },
  Pagination: { defaultOpen: false, render: () => <Pagination defaultValue={1} totalPages={5} showRowsPerPage rowsPerPage={10} /> },
  Breadcrumb: { defaultOpen: false, render: () => <Breadcrumb items={CRUMB_TRAIL} maxVisible={3} /> },
  Table: { defaultOpen: false, render: () => <Table data={ROWS} columns={COLUMNS} filterable filterableColumns={FILTERABLE} /> },
};

declare global {
  interface Window {
    __mountSubject?: (open: boolean) => void;
    __pushSubjectDown?: () => void;
  }
}

/**
 * `/__fixtures/open-close/<Component>`: one popup 3,000 px below the fold, for
 * `open-close.spec.ts`.
 *
 * Mounted by `window.__mountSubject(open)` rather than on load, so the spec
 * reads scrollY and the focused element on either side of the mount with
 * nothing it clicked holding the focus. `window.__pushSubjectDown()` inserts
 * 3,000 px above the component without a scroll event, which is how a trigger
 * leaves the screen while its popup stays open: most popups close on scroll.
 * `overflow-anchor: none`, or Chromium and Firefox would scroll to keep the
 * trigger where it was.
 *
 * Not a registry fixture, for the reason `FormRoute` gives: every fixture is
 * walked by visual, a11y-full and contrast-painted, and a 6,000 px page with one
 * component on it is not a state of that component.
 */
export default function OpenCloseRoute() {
  const { component = "" } = useParams();
  const entry = OPEN_CLOSE[component];
  const [mounted, setMounted] = useState<null | boolean>(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    window.__mountSubject = (open) => setMounted(open);
    window.__pushSubjectDown = () => setPushed(true);
    return () => {
      delete window.__mountSubject;
      delete window.__pushSubjectDown;
    };
  }, []);

  if (!entry) return <p data-fixture-error="">No open-close subject for "{component}".</p>;

  return (
    <main data-open-close={component} style={{ padding: 24, overflowAnchor: "none" }}>
      <p data-outside style={{ height: 120, margin: 0 }}>
        Outside
      </p>
      <div style={{ height: 3000 }} />
      {pushed && <div data-pushed style={{ height: 3000 }} />}
      <div data-subject style={{ maxWidth: 480 }}>
        {mounted !== null && entry.render(mounted)}
      </div>
      <div style={{ height: 3000 }} />
    </main>
  );
}
