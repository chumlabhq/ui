/** @jsxImportSource react */
/**
 * Where a consumer's props land.
 *
 * Three routing rules, held at runtime for every component export of the 30
 * indexed directories:
 *
 *   root      `className`, `style` and `classes.root` land on one element, the
 *             component's root. A slot is named for what it styles, so the
 *             element `classes.root` reaches is the element `className` does.
 *   control   `id`, `aria-label`, `aria-labelledby` and `aria-describedby` land
 *             on the primary control — the ref target, which refs.contract
 *             holds to the element a keyboard user operates — and on no other
 *             element. A composite whose primary element is a group
 *             (`group`, `radiogroup`, `tablist`) is named and described as the
 *             group, and its members carry their own names. `name` lands only on fields inside the component: the
 *             control, a group's member inputs, or the hidden input that
 *             submits a custom control's value.
 *   ids       no id is rendered twice, the consumer's or the component's own.
 *
 * Each was broken somewhere before A2e: RadioButton spread `id` onto its
 * `<label>` as well as its `<input>`, DatePicker and TimePicker spread
 * `aria-label` onto a role-less root `<div>`, and CascadingDropdown put
 * `className` with its `control` slot on the outer element and `classes.root`
 * on an inner one.
 *
 * Population: every export of the indexed barrels that renders an element, read
 * from the barrels themselves, so an export with no case below fails. Left out,
 * each for its reason: React contexts (providers, not components), the glyph
 * icons (decorative SVGs with no control), and ToastProvider (a context with no
 * element of its own).
 */
import { createRef, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import index from "../../../ai/component-index.json";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, AccordionShimmer } from "../../components/Accordion/index.js";
import { Avatar, AvatarGroup, AvatarGroupCount, AvatarBadge, AvatarShimmer, AvatarGroupShimmer } from "../../components/Avatar/index.js";
import { Breadcrumb } from "../../components/Breadcrumb/index.js";
import { Button, ButtonGroup } from "../../components/Button/index.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import { Checkbox } from "../../components/Checkbox/index.js";
import { CountryFlag, CountryFlagGroup, CountryFlagGroupCount, CountryFlagShimmer, CountryFlagGroupShimmer } from "../../components/CountryFlag/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton } from "../../components/Drawer/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
import { Input, InputLabel } from "../../components/Input/index.js";
import { InternationalPhoneInput } from "../../components/InternationalPhoneInput/index.js";
import { CircularLoader, LinearLoader, DotLoader, PulseLoader } from "../../components/Loader/index.js";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../../components/Modal/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { OtpInput } from "../../components/OtpInput/index.js";
import { Pagination } from "../../components/Pagination/index.js";
import { RadioGroup, RadioButton } from "../../components/RadioButton/index.js";
import { ResizablePanel } from "../../components/ResizablePanel/index.js";
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { Slider } from "../../components/Slider/index.js";
import { Stepper } from "../../components/Stepper/index.js";
import { Switch } from "../../components/Switch/index.js";
import { TabPanel } from "../../components/TabPanel/index.js";
import { Table } from "../../components/Table/index.js";
import { TextArea, TextAreaLabel } from "../../components/TextArea/index.js";
import { TimePicker } from "../../components/TimePicker/index.js";
import { Toast } from "../../components/Toast/index.js";
import { Tooltip } from "../../components/Tooltip/index.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

const PROBE = {
  className: "probe-class",
  style: { "--probe": "on" } as CSSProperties,
  id: "probe-id",
  "aria-label": "Probe name",
  "aria-labelledby": "probe-labelledby",
  "aria-describedby": "probe-describedby",
};
type Probe = typeof PROBE & { name?: string; classes?: { root: string } };

/**
 * The probe props, spread as a consumer would. Typed as a bare object: the
 * routing rules are about any attribute a consumer may pass, and narrowing each
 * spread to the component's own props would hide the very props under test.
 */
const spread = (p: Probe): object => p;

interface Case {
  /** `Dir/Export`, as the barrel names it. */
  id: string;
  /** The ref target is the root: a container, a label, a shimmer, a button. */
  container?: boolean;
  /** Takes `name` (declared or passed through to a native control). */
  name?: boolean;
  /** Has a `classes.root` slot. */
  rootSlot?: boolean;
  render: (p: Probe, ref: { current: unknown }) => ReactElement;
  /** The root, where it is not the first element rendered or the ref target. */
  root?: (control: Element) => Element | null;
  /** The control, where the export takes no element ref. */
  control?: (root: Element) => Element | null;
}

const r = (ref: { current: unknown }) => ref as never;
const inAccordion = (node: ReactNode) => (
  <Accordion selectionMode="single" defaultValue="i">
    <AccordionItem value="i">{node}</AccordionItem>
  </Accordion>
);
const inOpenModal = (node: ReactNode) => <Modal open aria-label="Modal">{node}</Modal>;
const inOpenDrawer = (node: ReactNode) => <Drawer open aria-label="Drawer">{node}</Drawer>;

const CASES: Case[] = [
  { id: "Accordion/Accordion", rootSlot: true, control: (root) => root, render: (p) => <Accordion {...spread(p)} selectionMode="single">{null}</Accordion> },
  { id: "Accordion/AccordionItem", container: true, render: (p, ref) => <Accordion selectionMode="single"><AccordionItem {...spread(p)} ref={r(ref)} value="i">x</AccordionItem></Accordion> },
  { id: "Accordion/AccordionTrigger", render: (p, ref) => inAccordion(<AccordionTrigger {...spread(p)} ref={r(ref)}>Title</AccordionTrigger>), root: (c) => c },
  { id: "Accordion/AccordionContent", container: true, render: (p, ref) => inAccordion(<AccordionContent {...spread(p)} ref={r(ref)}>Body</AccordionContent>) },
  { id: "Accordion/AccordionShimmer", container: true, rootSlot: true, render: (p, ref) => <AccordionShimmer {...spread(p)} ref={r(ref)} /> },
  { id: "Avatar/Avatar", container: true, rootSlot: true, render: (p, ref) => <Avatar {...spread(p)} ref={r(ref)} name="Ada Lovelace" /> },
  { id: "Avatar/AvatarGroup", container: true, rootSlot: true, render: (p, ref) => <AvatarGroup {...spread(p)} ref={r(ref)}><Avatar name="Ada" /></AvatarGroup> },
  { id: "Avatar/AvatarGroupCount", container: true, render: (p, ref) => <AvatarGroupCount {...spread(p)} ref={r(ref)} count={3} /> },
  { id: "Avatar/AvatarBadge", container: true, render: (p, ref) => <AvatarBadge {...spread(p)} ref={r(ref)} count={3} /> },
  { id: "Avatar/AvatarShimmer", container: true, rootSlot: true, render: (p, ref) => <AvatarShimmer {...spread(p)} ref={r(ref)} /> },
  { id: "Avatar/AvatarGroupShimmer", container: true, render: (p, ref) => <AvatarGroupShimmer {...spread(p)} ref={r(ref)} /> },
  { id: "Breadcrumb/Breadcrumb", container: true, rootSlot: true, render: (p, ref) => <Breadcrumb {...spread(p)} ref={r(ref)} items={[{ id: "home", label: "Home" }]} /> },
  { id: "Button/Button", render: (p, ref) => <Button {...spread(p)} ref={r(ref)}>Go</Button>, root: (c) => c },
  { id: "Button/ButtonGroup", container: true, render: (p, ref) => <ButtonGroup {...spread(p)} ref={r(ref)}><Button>Go</Button></ButtonGroup> },
  { id: "CascadingDropdown/CascadingDropdown", name: true, rootSlot: true, render: (p, ref) => <CascadingDropdown {...spread(p)} ref={r(ref)} options={OPTIONS} /> },
  { id: "Checkbox/Checkbox", name: true, rootSlot: true, render: (p, ref) => <Checkbox {...spread(p)} ref={r(ref)} label="Agree" /> },
  { id: "CountryFlag/CountryFlag", container: true, rootSlot: true, render: (p, ref) => <CountryFlag {...spread(p)} ref={r(ref)} code="US" /> },
  { id: "CountryFlag/CountryFlagGroup", container: true, rootSlot: true, render: (p, ref) => <CountryFlagGroup {...spread(p)} ref={r(ref)}><CountryFlag code="US" /></CountryFlagGroup> },
  { id: "CountryFlag/CountryFlagGroupCount", container: true, render: (p, ref) => <CountryFlagGroupCount {...spread(p)} ref={r(ref)} count={3} /> },
  { id: "CountryFlag/CountryFlagShimmer", container: true, rootSlot: true, render: (p, ref) => <CountryFlagShimmer {...spread(p)} ref={r(ref)} /> },
  { id: "CountryFlag/CountryFlagGroupShimmer", container: true, render: (p, ref) => <CountryFlagGroupShimmer {...spread(p)} ref={r(ref)} /> },
  { id: "DatePicker/DatePicker", name: true, rootSlot: true, render: (p, ref) => <DatePicker {...spread(p)} ref={r(ref)} /> },
  { id: "Drawer/Drawer", container: true, rootSlot: true, render: (p, ref) => <Drawer {...spread(p)} ref={r(ref)} open>Body</Drawer> },
  { id: "Drawer/DrawerHeader", container: true, render: (p, ref) => inOpenDrawer(<DrawerHeader {...spread(p)} ref={r(ref)}>Head</DrawerHeader>) },
  { id: "Drawer/DrawerBody", container: true, render: (p, ref) => inOpenDrawer(<DrawerBody {...spread(p)} ref={r(ref)}>Body</DrawerBody>) },
  { id: "Drawer/DrawerFooter", container: true, render: (p, ref) => inOpenDrawer(<DrawerFooter {...spread(p)} ref={r(ref)}>Foot</DrawerFooter>) },
  { id: "Drawer/DrawerCloseButton", render: (p, ref) => inOpenDrawer(<DrawerCloseButton {...spread(p)} ref={r(ref)} />), root: (c) => c },
  { id: "Dropdown/Dropdown", name: true, rootSlot: true, render: (p, ref) => <Dropdown {...spread(p)} ref={r(ref)} options={OPTIONS} /> },
  { id: "Input/Input", name: true, rootSlot: true, render: (p, ref) => <Input {...spread(p)} ref={r(ref)} /> },
  { id: "Input/InputLabel", control: (root) => root, render: (p) => <InputLabel {...spread(p)} label="Name" /> },
  { id: "InternationalPhoneInput/InternationalPhoneInput", name: true, rootSlot: true, render: (p, ref) => <InternationalPhoneInput {...spread(p)} ref={r(ref)} /> },
  { id: "Loader/CircularLoader", container: true, rootSlot: true, render: (p, ref) => <CircularLoader {...spread(p)} ref={r(ref)} /> },
  { id: "Loader/LinearLoader", container: true, rootSlot: true, render: (p, ref) => <LinearLoader {...spread(p)} ref={r(ref)} /> },
  { id: "Loader/DotLoader", container: true, rootSlot: true, render: (p, ref) => <DotLoader {...spread(p)} ref={r(ref)} /> },
  { id: "Loader/PulseLoader", container: true, rootSlot: true, render: (p, ref) => <PulseLoader {...spread(p)} ref={r(ref)} /> },
  { id: "Modal/Modal", container: true, rootSlot: true, render: (p, ref) => <Modal {...spread(p)} ref={r(ref)} open>Body</Modal> },
  { id: "Modal/ModalHeader", container: true, render: (p, ref) => inOpenModal(<ModalHeader {...spread(p)} ref={r(ref)}>Head</ModalHeader>) },
  { id: "Modal/ModalBody", container: true, render: (p, ref) => inOpenModal(<ModalBody {...spread(p)} ref={r(ref)}>Body</ModalBody>) },
  { id: "Modal/ModalFooter", container: true, render: (p, ref) => inOpenModal(<ModalFooter {...spread(p)} ref={r(ref)}>Foot</ModalFooter>) },
  { id: "MultiSelectDropdown/MultiSelectDropdown", name: true, rootSlot: true, render: (p, ref) => <MultiSelectDropdown {...spread(p)} ref={r(ref)} options={OPTIONS} /> },
  { id: "MultiSelectSearchableDropdown/MultiSelectSearchableDropdown", name: true, rootSlot: true, render: (p, ref) => <MultiSelectSearchableDropdown {...spread(p)} ref={r(ref)} options={OPTIONS} /> },
  { id: "OtpInput/OtpInput", name: true, rootSlot: true, render: (p, ref) => <OtpInput {...spread(p)} ref={r(ref)} /> },
  { id: "Pagination/Pagination", container: true, rootSlot: true, render: (p, ref) => <Pagination {...spread(p)} ref={r(ref)} defaultValue={1} totalPages={3} /> },
  { id: "RadioButton/RadioGroup", container: true, name: true, rootSlot: true, render: (p, ref) => <RadioGroup {...spread(p)} ref={r(ref)}><RadioButton value="a" label="A" /></RadioGroup> },
  {
    id: "RadioButton/RadioButton",
    rootSlot: true,
    render: (p, ref) => <RadioGroup aria-label="Group"><RadioButton {...spread(p)} ref={r(ref)} value="a" label="A" /></RadioGroup>,
    root: (c) => c.closest("label"),
  },
  { id: "ResizablePanel/ResizablePanel", rootSlot: true, render: (p, ref) => <ResizablePanel {...spread(p)} ref={r(ref)}>Side</ResizablePanel> },
  { id: "SearchableDropdown/SearchableDropdown", name: true, rootSlot: true, render: (p, ref) => <SearchableDropdown {...spread(p)} ref={r(ref)} options={OPTIONS} /> },
  { id: "Slider/Slider", name: true, rootSlot: true, render: (p, ref) => <Slider {...spread(p)} ref={r(ref)} defaultValue={40} /> },
  { id: "Stepper/Stepper", container: true, rootSlot: true, render: (p, ref) => <Stepper {...spread(p)} ref={r(ref)} steps={[{ id: "a", label: "A" }]} /> },
  { id: "Switch/Switch", name: true, rootSlot: true, render: (p, ref) => <Switch {...spread(p)} ref={r(ref)} label="Wifi" /> },
  { id: "TabPanel/TabPanel", container: true, rootSlot: true, render: (p, ref) => <TabPanel {...spread(p)} ref={r(ref)} tabs={[{ id: "a", label: "A" }]} /> },
  { id: "Table/Table", container: true, rootSlot: true, render: (p, ref) => <Table {...spread(p)} ref={r(ref)} data={[]} columns={[]} /> },
  { id: "TextArea/TextArea", name: true, rootSlot: true, render: (p, ref) => <TextArea {...spread(p)} ref={r(ref)} /> },
  { id: "TextArea/TextAreaLabel", control: (root) => root, render: (p) => <TextAreaLabel {...spread(p)} label="Notes" /> },
  { id: "TimePicker/TimePicker", name: true, rootSlot: true, render: (p, ref) => <TimePicker {...spread(p)} ref={r(ref)} /> },
  { id: "Toast/Toast", container: true, rootSlot: true, render: (p, ref) => <Toast {...spread(p)} ref={r(ref)} id="probe-id" message="Saved" onDismiss={() => {}} /> },
  { id: "Tooltip/Tooltip", container: true, render: (p, ref) => <Tooltip {...spread(p)} ref={r(ref)} content="tip" open><button type="button">trigger</button></Tooltip> },
];

// ── Named exceptions ───────────────────────────────────────────────────────

/**
 * A routing miss known and scheduled, by case and check. One that excuses
 * nothing fails its case, so each falls out the moment it is fixed. A2e fixed
 * the control routing (the A2d ref targets, RadioButton, OtpInput's group and
 * the fields' aria-describedby); what remains is scheduled for A2f, before
 * publish.
 */
const A2F_ROOT = "fixed in A2f (root routing): ";
const A2F_SPREAD = "fixed in A2f (not spread): ";
const on = (id: string, checks: Check[], reason: string) => checks.map((check) => ({ id, check, reason }));
const ALL_ARIA: Check[] = ["id", "aria-label", "aria-labelledby", "aria-describedby"];
const EXCEPTIONS: { id: string; check: Check; reason: string }[] = [
  ...on("Checkbox/Checkbox", ["style"], `${A2F_ROOT}style goes to the native input, className to the root`),
  ...on("Input/Input", ["style"], `${A2F_ROOT}style goes to the native input, className to the root`),
  ...on("TextArea/TextArea", ["style"], `${A2F_ROOT}style is dropped while className reaches the root`),
  ...on("Accordion/AccordionContent", ["className"], `${A2F_ROOT}className lands on the inner wrapper, not the region`),
  ...on("Modal/Modal", ["style", "classes.root"], `${A2F_ROOT}className is on the dialog, classes.root on the portal wrapper, style on neither`),
  ...on("Drawer/Drawer", ["style", "classes.root"], `${A2F_ROOT}className is on the dialog, classes.root on the portal wrapper, style on neither`),
  ...on("Tooltip/Tooltip", ["style"], `${A2F_ROOT}style is dropped while className reaches the content`),
  ...on("Modal/Modal", ["id"], `${A2F_SPREAD}the dialog keeps its generated id`),
  ...on("Drawer/Drawer", ["id"], `${A2F_SPREAD}the dialog keeps its generated id`),
  ...on("Tooltip/Tooltip", ALL_ARIA, `${A2F_SPREAD}the content takes className alone`),
  ...on("Modal/ModalHeader", ["style", ...ALL_ARIA], `${A2F_SPREAD}takes className and children alone`),
  ...on("Modal/ModalBody", ["style", ...ALL_ARIA], `${A2F_SPREAD}takes className and children alone`),
  ...on("Modal/ModalFooter", ["style", ...ALL_ARIA], `${A2F_SPREAD}takes className and children alone`),
  ...on("Input/InputLabel", ["style", ...ALL_ARIA], `${A2F_SPREAD}a label helper typed with label, required, htmlFor and className only`),
  ...on("TextArea/TextAreaLabel", ["style", ...ALL_ARIA], `${A2F_SPREAD}a label helper typed with label, required, htmlFor and className only`),
  ...on("Accordion/AccordionShimmer", ALL_ARIA, `${A2F_SPREAD}the status region keeps its own name and drops the consumer's`),
  ...on("Avatar/AvatarShimmer", ALL_ARIA, `${A2F_SPREAD}the status region keeps its own name and drops the consumer's`),
  ...on("Avatar/AvatarGroupShimmer", ALL_ARIA, `${A2F_SPREAD}the status region keeps its own name and drops the consumer's`),
  ...on("Toast/Toast", ALL_ARIA, `${A2F_SPREAD}\`id\` is the toast's key, and the status region drops the consumer's ARIA`),
  ...on("Accordion/AccordionItem", ["aria-describedby"], `${A2F_SPREAD}overwritten by the item's own`),
  ...on("Stepper/Stepper", ["aria-labelledby", "aria-describedby"], `${A2F_SPREAD}the navigation takes aria-label alone`),
  ...on("Table/Table", ["id", "aria-labelledby", "aria-describedby"], `${A2F_SPREAD}the region takes aria-label alone`),
  ...on("TabPanel/TabPanel", ["id", "aria-describedby"], `${A2F_SPREAD}the tablist takes aria-label and aria-labelledby alone`),
  ...on(
    "InternationalPhoneInput/InternationalPhoneInput",
    ["aria-label", "aria-labelledby", "aria-describedby"],
    "fixed in A2f: a composite whose group should carry the name; aria-label lands on the group and the input both, the others on the input",
  ),
  ...on(
    "DatePicker/DatePicker",
    ["name"],
    "found by A2e: DatePicker declares `name` but renders no field, so it submits nothing in a form. Reported, not yet scheduled",
  ),
];

// ── The population ─────────────────────────────────────────────────────────

const DIRS = (index as { components: { name: string }[] }).components.map((c) => c.name);
const barrels = import.meta.glob("../../components/*/index.ts", { eager: true }) as Record<string, Record<string, unknown>>;
const isComponent = (v: unknown) => typeof v === "function" || (typeof v === "object" && v !== null && "$$typeof" in v);
const POPULATION = DIRS.flatMap((dir) =>
  Object.entries(barrels[`../../components/${dir}/index.ts`] ?? {})
    .filter(([name, v]) => /^[A-Z]/.test(name) && isComponent(v))
    .filter(([name]) => !/Context$/.test(name) && !/Icon$/.test(name) && name !== "ToastProvider")
    .map(([name]) => `${dir}/${name}`),
);

// ── The checks ─────────────────────────────────────────────────────────────

const describeEl = (el: Element | null | undefined) =>
  el ? `<${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${el.getAttribute("role") ? ` role=${el.getAttribute("role")}` : ""}>` : "nothing";
const all = (sel: string) => [...document.querySelectorAll(sel)];
const tokens = (el: Element, attr: string) => (el.getAttribute(attr) ?? "").split(/\s+/);
const FIELD_TAGS = new Set(["INPUT", "SELECT", "TEXTAREA"]);

type Check = "root" | "className" | "style" | "classes.root" | "control" | "id" | "aria-label" | "aria-labelledby" | "aria-describedby" | "name" | "ids";
interface Miss {
  check: Check;
  text: string;
}

const GROUP_ROLES = '[role="group"], [role="radiogroup"], [role="tablist"]';

/**
 * Where a component's name and description go. A composite whose primary
 * element is a group — a radiogroup, a tablist, OtpInput's cells — is named as
 * the group, and its members carry their own names; anything else is named on
 * its control. The group is the root itself, the nearest group around the
 * control inside the root, or, where the control is the root, the group inside.
 */
function namedElement(root: Element, control: Element): Element {
  if (root.matches(GROUP_ROLES)) return root;
  if (control !== root) {
    const around = control.parentElement?.closest(GROUP_ROLES);
    if (around && root.contains(around)) return around;
    return control;
  }
  return root.querySelector(GROUP_ROLES) ?? control;
}

/** Every routing miss of one rendered case. */
function misses(c: Case): Miss[] {
  const ref = createRef<unknown>();
  const p: Probe = { ...PROBE, ...(c.name ? { name: "probe-name" } : {}), ...(c.rootSlot ? { classes: { root: "probe-root-slot" } } : {}) };
  const { container } = render(
    <>
      {c.render(p, ref)}
      <span id="probe-labelledby">Labelled</span>
      <span id="probe-describedby">Described</span>
    </>,
  );
  const out: Miss[] = [];
  const refEl = ref.current instanceof Element ? ref.current : null;
  const first = container.firstElementChild;
  const control = c.control ? c.control(first!) : refEl;
  const root = c.root ? c.root(control!) : c.container ? refEl : first;
  if (!root) return [{ check: "root", text: `no root found (ref is ${describeEl(refEl)})` }];
  if (!control) return [{ check: "control", text: `no control found (ref is ${describeEl(refEl)})` }];
  const named = namedElement(root, control);

  const one = (check: Check, els: Element[], want: Element) => {
    if (els.length !== 1 || els[0] !== want) out.push({ check, text: `${check} on [${els.map(describeEl).join(", ")}], want ${describeEl(want)}` });
  };
  one("className", all(".probe-class"), root);
  one("style", all("[style]").filter((e) => (e as HTMLElement).style.getPropertyValue("--probe") === "on"), root);
  if (c.rootSlot) one("classes.root", all(".probe-root-slot"), root);
  one("id", all('[id="probe-id"]'), control);
  one("aria-label", all('[aria-label="Probe name"]'), named);
  one("aria-labelledby", all("[aria-labelledby]").filter((e) => tokens(e, "aria-labelledby").includes("probe-labelledby")), named);
  one("aria-describedby", all("[aria-describedby]").filter((e) => tokens(e, "aria-describedby").includes("probe-describedby")), named);
  if (c.name) {
    const withName = all('[name="probe-name"]');
    if (!withName.length) out.push({ check: "name", text: "name rendered nowhere" });
    const stray = withName.filter((e) => !FIELD_TAGS.has(e.tagName) || !(root.contains(e) || e === root));
    if (stray.length) out.push({ check: "name", text: `name on [${stray.map(describeEl).join(", ")}], not a field inside the component` });
  }
  const ids = all("[id]").map((e) => e.id);
  const twice = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (twice.length) out.push({ check: "ids", text: `ids rendered twice: ${twice.join(", ")}` });
  return out;
}

describe("prop routing: root, control and ids", () => {
  it("every component export has a routing case", () => {
    const cased = new Set(CASES.map((c) => c.id));
    console.log(`ROUTING_POPULATION exports=${POPULATION.length} cases=${CASES.length}`);
    expect(POPULATION.filter((id) => !cased.has(id))).toEqual([]);
    expect(CASES.map((c) => c.id).filter((id) => !POPULATION.includes(id))).toEqual([]);
  });

  const results = new Map<string, Miss[]>();
  for (const c of CASES) {
    it(`${c.id}`, () => {
      const found = misses(c);
      results.set(c.id, found);
      const open = found.filter((m) => !EXCEPTIONS.some((e) => e.id === c.id && e.check === m.check));
      const stale = EXCEPTIONS.filter((e) => e.id === c.id && !found.some((m) => m.check === e.check));
      expect(open.map((m) => m.text), "routing misses outside a named exception").toEqual([]);
      expect(stale.map((e) => `${e.check}: ${e.reason}`), "an exception that excuses nothing").toEqual([]);
    });
  }

  it("every exception names a case", () => {
    expect(EXCEPTIONS.filter((e) => !CASES.some((c) => c.id === e.id)).map((e) => e.id)).toEqual([]);
  });

  it("summary", () => {
    const red = [...results].filter(([, m]) => m.length);
    const excused = (id: string, m: Miss) => EXCEPTIONS.some((e) => e.id === id && e.check === m.check);
    console.log(
      `ROUTING cases=${results.size} with-misses=${red.length} open=${red.filter(([id, m]) => m.some((x) => !excused(id, x))).length} exceptions=${EXCEPTIONS.length}`,
    );
    for (const [id, m] of red) console.log(`  ${id}\n    ${m.map((x) => `${excused(id, x) ? "excused " : "OPEN    "}${x.text}`).join("\n    ")}`);
  });
});
