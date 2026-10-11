/** @jsxImportSource react */
/**
 * A ref lands on the element a keyboard user operates.
 *
 * Ten components forwarded their ref to a wrapping `<div>` (RadioButton, to its
 * `<label>`): the five dropdowns, DatePicker, TimePicker, Slider and
 * ResizablePanel. `ref.current.focus()` on a div does nothing, so the one thing
 * a consumer most often holds a ref for — focusing the field — silently failed,
 * and a form library that focuses the first invalid field on submit
 * (react-hook-form's `field.ref`) left focus where it was. A2d moved each ref to
 * the control: the trigger of the dropdowns and pickers, Slider's thumb (the
 * first thumb of a range), ResizablePanel's separator, RadioButton's input.
 *
 * Three checks, each over all ten:
 *
 *   type     the ref's element type, read off each export by the compiler.
 *            Slider's thumb and ResizablePanel's separator are `<div>`s, like
 *            the roots they replaced, so for those two the type cannot tell the
 *            elements apart and the runtime checks carry the proof.
 *   focus    `ref.current.focus()` moves focus to `ref.current`, and Tab from
 *            the element before the component lands on that same element — the
 *            ref is the control the keyboard reaches first, not merely
 *            something focusable inside the component.
 *   form     a field registered the way react-hook-form's Controller registers
 *            `field.ref` (it keeps `{ focus: () => el.focus() }` and calls it on
 *            the first invalid field) receives focus on a failed submit. No
 *            form library is installed; the registration is reproduced.
 *
 * Left out: Accordion's imperative handle (`AccordionRef`), Tooltip's ref to its
 * trigger wrapper, and the label helpers and the toast provider, which take no ref.
 */
import { createRef, type ReactElement, type Ref } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ts from "typescript";
import { Dropdown } from "../../components/Dropdown/index.js";
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";
import { TimePicker } from "../../components/TimePicker/index.js";
import { Slider } from "../../components/Slider/index.js";
import { ResizablePanel } from "../../components/ResizablePanel/index.js";
import { RadioButton, RadioGroup } from "../../components/RadioButton/index.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

interface Case {
  name: string;
  dir: string;
  /** The ref's element type, as the checker prints it. */
  type: string;
  /** What the element is, for the failure message and the runtime check. */
  is: (el: Element) => boolean;
  render: (ref: Ref<HTMLElement>) => ReactElement;
}

const isTrigger = (el: Element) => el.tagName === "BUTTON" && el.getAttribute("role") === "combobox";

// Each case is handed a `Ref<HTMLElement>`, which is what a form library holds,
// and narrows it to the element type the component declares.
const CASES: Case[] = [
  { name: "Dropdown", dir: "Dropdown", type: "HTMLButtonElement", is: isTrigger, render: (ref) => <Dropdown ref={ref as Ref<HTMLButtonElement>} options={OPTIONS} aria-label="Fruit" /> },
  { name: "SearchableDropdown", dir: "SearchableDropdown", type: "HTMLButtonElement", is: isTrigger, render: (ref) => <SearchableDropdown ref={ref as Ref<HTMLButtonElement>} options={OPTIONS} aria-label="Fruit" /> },
  { name: "MultiSelectDropdown", dir: "MultiSelectDropdown", type: "HTMLButtonElement", is: isTrigger, render: (ref) => <MultiSelectDropdown ref={ref as Ref<HTMLButtonElement>} options={OPTIONS} aria-label="Fruit" /> },
  { name: "MultiSelectSearchableDropdown", dir: "MultiSelectSearchableDropdown", type: "HTMLButtonElement", is: isTrigger, render: (ref) => <MultiSelectSearchableDropdown ref={ref as Ref<HTMLButtonElement>} options={OPTIONS} aria-label="Fruit" /> },
  {
    name: "CascadingDropdown",
    dir: "CascadingDropdown",
    type: "HTMLButtonElement",
    // A menu button, not a combobox: it opens a menu of submenus.
    is: (el) => el.tagName === "BUTTON" && el.getAttribute("aria-haspopup") === "true",
    render: (ref) => <CascadingDropdown ref={ref as Ref<HTMLButtonElement>} options={OPTIONS} aria-label="Fruit" />,
  },
  { name: "DatePicker", dir: "DatePicker", type: "HTMLButtonElement", is: isTrigger, render: (ref) => <DatePicker ref={ref as Ref<HTMLButtonElement>} aria-label="Date" /> },
  {
    name: "TimePicker",
    dir: "TimePicker",
    // TimePicker's trigger is a typed text input, so the ref is that input.
    type: "HTMLInputElement",
    is: (el) => el.tagName === "INPUT" && el.getAttribute("role") === "combobox",
    render: (ref) => <TimePicker ref={ref as Ref<HTMLInputElement>} aria-label="Time" />,
  },
  {
    name: "Slider",
    dir: "Slider",
    type: "HTMLDivElement",
    is: (el) => el.getAttribute("role") === "slider" && el.getAttribute("data-index") === "0",
    render: (ref) => <Slider ref={ref as Ref<HTMLDivElement>} defaultValue={[20, 80]} aria-label="Range" />,
  },
  {
    name: "ResizablePanel",
    dir: "ResizablePanel",
    type: "HTMLDivElement",
    is: (el) => el.getAttribute("role") === "separator",
    render: (ref) => <ResizablePanel ref={ref as Ref<HTMLDivElement>} aria-label="Resize sidebar">Sidebar</ResizablePanel>,
  },
  {
    name: "RadioButton",
    dir: "RadioButton",
    type: "HTMLInputElement",
    is: (el) => el.tagName === "INPUT" && (el as HTMLInputElement).type === "radio",
    render: (ref) => (
      <RadioGroup aria-label="Fruit" defaultValue="a">
        <RadioButton ref={ref as Ref<HTMLInputElement>} value="a" label="Apple" />
      </RadioGroup>
    ),
  },
];

// ── The ref's type, by the compiler ────────────────────────────────────────

const program = ts.createProgram(
  [...new Set(CASES.map((c) => `src/components/${c.dir}/index.ts`))],
  {
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
  },
);
const checker = program.getTypeChecker();

/** The element type an export's `ref` prop holds: `T` out of `Ref<T>`. */
function refTargetOf(dir: string, exportName: string): string {
  const sf = program.getSourceFile(`src/components/${dir}/index.ts`)!;
  const exp = checker.getExportsOfModule(checker.getSymbolAtLocation(sf)!).find((s) => s.name === exportName);
  if (!exp) return "(not exported)";
  const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
  const at = (sym.valueDeclaration ?? sym.declarations![0])!;
  const sig = checker.getTypeOfSymbolAtLocation(sym, at).getCallSignatures()[0];
  const props = checker.getTypeOfSymbolAtLocation(sig.getParameters()[0], at);
  const ref = props.getProperty("ref");
  if (!ref) return "(no ref)";
  const refType = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(ref, at));
  for (const member of refType.isUnion() ? refType.types : [refType]) {
    const current = member.getProperty("current");
    if (current) return checker.typeToString(checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(current, at)));
  }
  return checker.typeToString(refType);
}

/**
 * What react-hook-form's Controller keeps for a field: its `field.ref` callback
 * stores an object whose `focus` calls the element's, and a failed submit calls
 * `focus` on the first field with an error.
 */
function createForm() {
  const fields = new Map<string, { focus: () => void }>();
  return {
    fieldRef: (name: string) => (el: HTMLElement | null) => {
      if (el) fields.set(name, { focus: () => el.focus && el.focus() });
    },
    submitWithErrorOn: (name: string) => fields.get(name)?.focus(),
  };
}

const describeEl = (el: Element | null) =>
  el ? `<${el.tagName.toLowerCase()}${el.getAttribute("role") ? ` role=${el.getAttribute("role")}` : ""}>` : "null";

describe("refs land on the element a keyboard user operates", () => {
  it("each ref's type is the control's element type", () => {
    const rows = CASES.map((c) => ({ name: c.name, got: refTargetOf(c.dir, c.name), want: c.type }));
    const wrong = rows.filter((r) => r.got !== r.want);
    console.log(`REF_TYPES checked=${rows.length} wrong=${wrong.length}`);
    for (const r of rows) console.log(`  ${r.got === r.want ? "ok   " : "WRONG"} ${r.name.padEnd(32)} ${r.got}`);
    expect(wrong.map((r) => `${r.name}: ${r.got}, want ${r.want}`)).toEqual([]);
  });

  for (const c of CASES) {
    it(`${c.name}: ref.current.focus() focuses the control, and Tab reaches that same element first`, async () => {
      const ref = createRef<HTMLElement>();
      const { getByText } = render(
        <>
          <button type="button">before</button>
          {c.render(ref)}
        </>,
      );
      const el = ref.current;
      act(() => el?.focus());
      expect(document.activeElement, `focus() on ${describeEl(el)} left focus on ${describeEl(document.activeElement)}`).toBe(el);
      expect(el && c.is(el), `ref.current is ${describeEl(el)}`).toBe(true);

      act(() => (getByText("before") as HTMLButtonElement).focus());
      await userEvent.tab();
      expect(document.activeElement, `Tab reached ${describeEl(document.activeElement)}`).toBe(el);
    });
  }

  it("a form library's field.ref focuses the control on a failed submit", () => {
    const missed: string[] = [];
    for (const c of CASES) {
      const form = createForm();
      render(c.render(form.fieldRef(c.name)));
      act(() => form.submitWithErrorOn(c.name));
      const active = document.activeElement;
      if (!active || !c.is(active)) missed.push(`${c.name}: focus on ${describeEl(active)}`);
      cleanup();
    }
    console.log(`REF_FORM fields=${CASES.length} missed=${missed.length}`);
    expect(missed).toEqual([]);
  });
});
