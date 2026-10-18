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
import { afterEach, beforeEach, describe, expect, inject, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
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
  /**
   * What a screen reader reads on the focused control, for an export whose root
   * has no role: its naming attributes belong on the element the user focuses,
   * so the case focuses the control and asserts the computed accessible name
   * and description rather than where an attribute sits.
   */
  computed?: { role: string; name: string; description: string };
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
  {
    id: "Accordion/AccordionItem",
    container: true,
    render: (p, ref) => <Accordion selectionMode="single"><AccordionItem {...spread(p)} ref={r(ref)} value="i"><AccordionTrigger>T</AccordionTrigger></AccordionItem></Accordion>,
    control: (first) => first.querySelector("button"),
    computed: { role: "button", name: "Labelled", description: "Described" },
  },
  {
    id: "Accordion/AccordionTrigger",
    render: (p, ref) => inAccordion(<><AccordionTrigger {...spread(p)} ref={r(ref)}>Title</AccordionTrigger><AccordionContent>Body</AccordionContent></>),
    root: (c) => c,
  },
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
  { id: "Drawer/Drawer", rootSlot: true, render: (p, ref) => <Drawer {...spread(p)} ref={r(ref)} open>Body</Drawer>, root: (c) => c.parentElement },
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
  { id: "Modal/Modal", rootSlot: true, render: (p, ref) => <Modal {...spread(p)} ref={r(ref)} open>Body</Modal>, root: (c) => c.closest("[data-modal-root]") },
  { id: "Modal/ModalHeader", container: true, render: (p, ref) => inOpenModal(<ModalHeader {...spread(p)} ref={r(ref)}>Head</ModalHeader>) },
  { id: "Modal/ModalBody", container: true, render: (p, ref) => inOpenModal(<ModalBody {...spread(p)} ref={r(ref)}>Body</ModalBody>) },
  { id: "Modal/ModalFooter", container: true, render: (p, ref) => inOpenModal(<ModalFooter {...spread(p)} ref={r(ref)}>Foot</ModalFooter>) },
  // Selected, since the name lands on one hidden input per selected value (L23):
  // empty, a multi-select submits nothing, as a native <select multiple> does.
  { id: "MultiSelectDropdown/MultiSelectDropdown", name: true, rootSlot: true, render: (p, ref) => <MultiSelectDropdown {...spread(p)} ref={r(ref)} options={OPTIONS} defaultValue={[OPTIONS[0].value]} /> },
  { id: "MultiSelectSearchableDropdown/MultiSelectSearchableDropdown", name: true, rootSlot: true, render: (p, ref) => <MultiSelectSearchableDropdown {...spread(p)} ref={r(ref)} options={OPTIONS} defaultValue={[OPTIONS[0].value]} /> },
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
  { id: "Switch/Switch", name: true, rootSlot: true, render: (p, ref) => <Switch {...spread(p)} ref={r(ref)} label="Wifi" defaultChecked /> },
  { id: "TabPanel/TabPanel", container: true, rootSlot: true, render: (p, ref) => <TabPanel {...spread(p)} ref={r(ref)} tabs={[{ id: "a", label: "A" }]} /> },
  { id: "Table/Table", container: true, rootSlot: true, render: (p, ref) => <Table {...spread(p)} ref={r(ref)} data={[]} columns={[]} /> },
  { id: "TextArea/TextArea", name: true, rootSlot: true, render: (p, ref) => <TextArea {...spread(p)} ref={r(ref)} /> },
  { id: "TextArea/TextAreaLabel", control: (root) => root, render: (p) => <TextAreaLabel {...spread(p)} label="Notes" /> },
  { id: "TimePicker/TimePicker", name: true, rootSlot: true, render: (p, ref) => <TimePicker {...spread(p)} ref={r(ref)} /> },
  { id: "Toast/Toast", container: true, rootSlot: true, render: (p, ref) => <Toast {...spread(p)} ref={r(ref)} id="probe-id" message="Saved" onDismiss={() => {}} /> },
  {
    id: "Tooltip/Tooltip",
    render: (p, ref) => <Tooltip {...spread(p)} ref={r(ref)} content="tip" open><button type="button">trigger</button></Tooltip>,
    control: (first) => first.querySelector("button"),
    computed: { role: "button", name: "Labelled", description: "Described tip" },
  },
];

// ── Named exceptions ───────────────────────────────────────────────────────

/**
 * A routing miss known and named, by case and check. One that excuses nothing
 * fails its case, so each falls out the moment it is fixed. A2e fixed the
 * control routing (the A2d ref targets, RadioButton, OtpInput's group and the
 * fields' aria-describedby); A2f fixed root routing on seven components and
 * the attributes seventeen exports dropped or rendered twice. L12 retired the
 * last: DatePicker's `name` submits its value through a hidden input.
 */
const EXCEPTIONS: { id: string; check: Check; reason: string }[] = [];

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

type Check = "root" | "className" | "style" | "classes.root" | "control" | "id" | "aria-label" | "aria-labelledby" | "aria-describedby" | "computed" | "name" | "ids";
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
  if (c.computed) {
    act(() => (control as HTMLElement).focus());
    const focused = document.activeElement;
    // Read through Testing Library's role query, which computes the accessible
    // name and description the way the accname spec does and hands both to
    // these matchers.
    let got = null as { name: string; description: string } | null;
    screen.queryAllByRole(c.computed.role, {
      name: (name, el) => {
        if (el === focused) got = { name, description: got?.description ?? "" };
        return true;
      },
      description: (description, el) => {
        if (el === focused) got = { name: got?.name ?? "", description };
        return true;
      },
    });
    if (focused !== control || !got || got.name !== c.computed.name || got.description !== c.computed.description) {
      out.push({
        check: "computed",
        text: `focused ${describeEl(focused)} reads name "${got?.name}" and description "${got?.description}", want "${c.computed.name}" and "${c.computed.description}"`,
      });
    }
  }
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

// ── Consumer naming wins ───────────────────────────────────────────────────

/**
 * A consumer's `aria-labelledby` wins over the component's own label or title,
 * and a consumer's `aria-describedby` joins the component's own description and
 * error ids instead of replacing them, as on a native control. Read from the
 * computed name and description of the element ADR 008 names, not from where an
 * attribute sits: Modal put the consumer's id in the markup and still read its
 * own title, because its title id won the same attribute.
 *
 * Each case renders twice. Without the consumer's props it records which of its
 * own texts the component describes the element with; with them, every one of
 * those must still be there, after the consumer's.
 */
const OWN = { label: "Own label", description: "Own description", error: true, errorMessage: "Own error" };
const OWN_TEXT = /Own (label|title|description|error|caption|message)/g;
const CONSUMER = { "aria-labelledby": "consumer-name", "aria-describedby": "consumer-desc" };
const ROLES = ["checkbox", "switch", "textbox", "group", "slider", "radiogroup", "combobox", "button", "dialog", "status", "region"];
const one_ = [{ value: "a", label: "Apple" }];

interface Naming {
  id: string;
  render: (consumer: object) => ReactElement;
  /** The element ADR 008 names: the control, or the group or dialog. */
  target: (root: Element) => Element | null;
}
const control = (sel: string) => (root: Element) => root.querySelector(sel);
const NAMING: Naming[] = [
  { id: "Checkbox", render: (x) => <Checkbox {...OWN} {...x} />, target: control("input") },
  { id: "Switch", render: (x) => <Switch {...OWN} {...x} />, target: control('[role="switch"]') },
  { id: "Input", render: (x) => <Input {...OWN} {...x} />, target: control("input") },
  { id: "TextArea", render: (x) => <TextArea {...OWN} {...x} />, target: control("textarea") },
  { id: "InternationalPhoneInput", render: (x) => <InternationalPhoneInput {...OWN} {...x} />, target: control('[role="group"]') },
  { id: "OtpInput", render: (x) => <OtpInput {...OWN} {...x} />, target: control('[role="group"]') },
  { id: "Slider", render: (x) => <Slider defaultValue={40} {...OWN} {...x} />, target: control('[role="slider"]') },
  { id: "RadioGroup", render: (x) => <RadioGroup {...OWN} {...x}><RadioButton value="a" label="A" /></RadioGroup>, target: control('[role="radiogroup"]') },
  { id: "Dropdown", render: (x) => <Dropdown options={one_} {...OWN} {...x} />, target: control("button") },
  { id: "SearchableDropdown", render: (x) => <SearchableDropdown options={one_} {...OWN} {...x} />, target: control('[role="combobox"]') },
  { id: "MultiSelectDropdown", render: (x) => <MultiSelectDropdown options={one_} {...OWN} {...x} />, target: control('[role="combobox"]') },
  { id: "MultiSelectSearchableDropdown", render: (x) => <MultiSelectSearchableDropdown options={one_} {...OWN} {...x} />, target: control('[role="combobox"]') },
  { id: "CascadingDropdown", render: (x) => <CascadingDropdown options={one_} {...OWN} {...x} />, target: control("button[aria-haspopup]") },
  { id: "DatePicker", render: (x) => <DatePicker {...OWN} {...x} />, target: control("button") },
  { id: "TimePicker", render: (x) => <TimePicker {...OWN} {...x} />, target: control("input") },
  { id: "Toast", render: (x) => <Toast id="t" message="Own message" description="Own description" onDismiss={() => {}} {...x} />, target: control('[role="status"], [role="alert"]') },
  { id: "Table", render: (x) => <Table data={[]} columns={[]} caption="Own caption" {...x} />, target: control('[role="region"]') },
  { id: "Modal", render: (x) => <Modal open title="Own title" description="Own description" {...x}>Body</Modal>, target: () => document.querySelector('[role="dialog"]') },
  { id: "Drawer", render: (x) => <Drawer open {...x}><DrawerHeader>Own title</DrawerHeader>Body</Drawer>, target: () => document.querySelector('[role="dialog"]') },
];

/** The computed name and description of one element, through the role query. */
function computed(el: Element) {
  let got = { name: "", description: "", found: false };
  for (const role of ROLES) {
    screen.queryAllByRole(role, {
      hidden: true,
      name: (name, e) => {
        if (e === el) got = { ...got, name, found: true };
        return true;
      },
      description: (description, e) => {
        if (e === el) got = { ...got, description, found: true };
        return true;
      },
    });
  }
  return got;
}

function read(n: Naming, consumer: object) {
  const { container } = render(
    <>
      <span id="consumer-name">Consumer name</span>
      <span id="consumer-desc">Consumer description</span>
      <div>{n.render(consumer)}</div>
    </>,
  );
  const el = n.target(container.lastElementChild!);
  const got = el ? computed(el) : null;
  cleanup();
  return got;
}

describe("prop routing: a consumer's naming wins over the component's own", () => {
  for (const n of NAMING) {
    it(n.id, () => {
      const alone = read(n, {});
      const joined = read(n, CONSUMER);
      expect(alone?.found && joined?.found, `${n.id}: the named element was not found or has no role this reads`).toBe(true);
      const own = [...new Set(alone!.description.match(OWN_TEXT) ?? [])];
      expect(joined!.name, `${n.id}: a consumer's aria-labelledby lost to the component's own name`).toBe("Consumer name");
      expect(
        { startsWithConsumer: joined!.description.startsWith("Consumer description"), lost: own.filter((t) => !joined!.description.includes(t)) },
        `${n.id}: description "${joined!.description}" alone "${alone!.description}"; a consumer's aria-describedby must come first and join the component's own, not replace it`,
      ).toEqual({ startsWithConsumer: true, lost: [] });
    });
  }
});

// ── A combobox trigger carries its own name and description ────────────────

/**
 * The precedence block above checks that a component keeps the texts it already
 * describes the element with. It cannot see a text the component never wired:
 * the five dropdowns and DatePicker rendered their `description` and left it out
 * of the trigger's `aria-describedby`, so it was on screen and never announced.
 * Here the expected description is spelled out, in ADR 008's order: the
 * consumer's, then the component's description, then its error message.
 */
const DESCRIBED: Naming[] = NAMING.filter((n) =>
  ["Dropdown", "SearchableDropdown", "MultiSelectDropdown", "MultiSelectSearchableDropdown", "CascadingDropdown", "DatePicker"].includes(n.id),
);

describe("prop routing: a combobox trigger is described by its own description", () => {
  for (const n of DESCRIBED) {
    it(n.id, () => {
      const described = [false, true].map((error) => {
        const got = read({ ...n, render: (x) => n.render({ error, ...x }) }, CONSUMER);
        return got?.description;
      });
      expect(described, `${n.id}: description with error off, then on`).toEqual([
        "Consumer description Own description",
        "Consumer description Own description Own error",
      ]);
    });
  }
});

describe("prop routing: the rows-per-page select is named by its visible text", () => {
  it("Pagination", () => {
    const named = (props: object) => {
      render(<Pagination totalPages={10} showRowsPerPage rowsPerPage={10} {...props} />);
      const el = document.querySelector('[aria-haspopup="listbox"]');
      const got = el ? { role: el.getAttribute("role"), name: computed(el).name } : null;
      cleanup();
      return got;
    };
    expect([
      named({}),
      named({ rowsPerPagePrefix: "", rowsPerPageSuffix: "per page" }),
      named({ rowsPerPagePrefix: "", rowsPerPageSuffix: "" }),
    ]).toEqual([
      { role: "combobox", name: "Show rows" },
      { role: "combobox", name: "per page" },
      { role: "combobox", name: "Rows per page" },
    ]);
  });
});

// ── Every id reference resolves ────────────────────────────────────────────

/**
 * An IDREF that names an element nobody rendered is announced as nothing at
 * best and breaks the relationship it claims at worst: four dropdowns pointed
 * `aria-controls` at a listbox that exists only while open. Every routing case
 * is rendered closed, and the ones whose props type declares `open` again
 * open, and every id-reference attribute in the document must resolve.
 *
 * The floor is the count measured when this landed (L14), so a change that
 * quietly stops rendering the references cannot pass by checking fewer.
 */
const IDREF_ATTRS = ["aria-controls", "aria-labelledby", "aria-describedby", "aria-activedescendant", "for"];
const IDREFS_FLOOR = 153;
const declaredOpen = inject("declaredCapabilities");

/**
 * A dangling reference known and named, by case, state and attribute. One that
 * excuses nothing fails, so it falls out the moment it is fixed.
 */
const IDREF_EXCEPTIONS: { id: string; state: string; attr: string; reason: string }[] = [];
const idrefExcused = new Set<string>();
const idrefs = { checked: 0, dangling: [] as string[] };

function checkIdrefs(id: string, state: string, node: ReactElement) {
  render(
    <>
      {node}
      <span id="probe-labelledby">Labelled</span>
      <span id="probe-describedby">Described</span>
    </>,
  );
  const found: string[] = [];
  for (const attr of IDREF_ATTRS) {
    for (const el of document.querySelectorAll(`[${attr}]`)) {
      for (const ref of (el.getAttribute(attr) ?? "").split(/\s+/).filter(Boolean)) {
        idrefs.checked += 1;
        if (document.getElementById(ref)) continue;
        const excuse = IDREF_EXCEPTIONS.find((e) => e.id === id && e.state === state && e.attr === attr);
        if (excuse) idrefExcused.add(`${id}:${state}:${attr}`);
        else found.push(`${id} ${state}: ${attr}="${ref}" on ${describeEl(el)}`);
      }
    }
  }
  cleanup();
  return found;
}

describe("prop routing: every id reference resolves", () => {
  for (const c of CASES) {
    it(c.id, () => {
      const p = { ...PROBE, ...(c.name ? { name: "probe-name" } : {}) } as Probe;
      const ref = createRef<unknown>();
      const found = checkIdrefs(c.id, "closed", c.render(p, ref));
      if (declaredOpen[c.id]?.includes("open")) {
        found.push(...checkIdrefs(c.id, "open", c.render({ ...p, open: true, onOpenChange: () => {} } as Probe, createRef())));
      }
      idrefs.dangling.push(...found);
      expect(found, `${c.id}: id references that name no element in the document`).toEqual([]);
    });
  }

  it("checked a real number of references", () => {
    console.log(
      `IDREFS checked ${idrefs.checked} (floor ${IDREFS_FLOOR}), dangling ${idrefs.dangling.length}, excused ${idrefExcused.size}`,
    );
    for (const d of idrefs.dangling) console.log(`  ${d}`);
    expect(idrefs.checked).toBeGreaterThanOrEqual(IDREFS_FLOOR);
    expect(
      IDREF_EXCEPTIONS.map((e) => `${e.id}:${e.state}:${e.attr}`).filter((k) => !idrefExcused.has(k)),
      "IDREF_EXCEPTIONS entries that excused nothing — remove them",
    ).toEqual([]);
  });
});
