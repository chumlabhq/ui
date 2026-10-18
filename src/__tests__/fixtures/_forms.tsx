import type { ReactNode } from "react";
import type { ActTools } from "./_act.js";
import { Dropdown } from "../../components/Dropdown/index.js";
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";
import { TimePicker } from "../../components/TimePicker/index.js";
import { Switch } from "../../components/Switch/index.js";
import { Slider } from "../../components/Slider/index.js";
import { OtpInput } from "../../components/OtpInput/index.js";
import { InternationalPhoneInput } from "../../components/InternationalPhoneInput/index.js";
import { RadioGroup, RadioButton } from "../../components/RadioButton/index.js";
import { Checkbox } from "../../components/Checkbox/index.js";
import { Input } from "../../components/Input/index.js";
import { TextArea } from "../../components/TextArea/index.js";

/**
 * One form field, as a native form sees it.
 *
 * L20 found every field that submits through a library-rendered input broken
 * in two ways a native control is not: a form reset left the changed value on
 * screen and in FormData, and `required` drew an asterisk without stopping the
 * submit. Natively-backed fields had their own versions — Input and TextArea
 * ignored reset, Checkbox and RadioGroup reset the DOM but not what they paint,
 * and RadioGroup never put `required` on its radios.
 *
 * Both tiers read this table: `form-participation.contract` in jsdom, and the
 * `/__fixtures/forms/:field` page that `forms.spec.ts` drives in three engines.
 * A field is held to the FormData its `.ai.md` documents, not to whatever it
 * happens to emit, so a format change has to be made in both places at once.
 */
export interface FormFixture {
  /** `Dir/Export`, the id `propsWalk` gives the component. */
  id: string;
  render: (props: Record<string, unknown>) => ReactNode;
  /** The prop pair the field is driven by: `value`/`defaultValue`, or `checked`/`defaultChecked`. */
  valueProp: "value" | "checked";
  /** The uncontrolled default, and the controlled value. */
  initial: unknown;
  /** FormData entries for `initial`, as `name=value`, with the field named `f`. */
  formData: string[];
  /** FormData entries with nothing set. */
  empty: string[];
  /**
   * Whether `required` with nothing set blocks the submit. Only false where
   * the field can never be empty, and then `empty` shows the value it holds.
   */
  blocks: boolean;
  /** Moves the uncontrolled value away from `initial`, the way a user would. */
  change: (container: HTMLElement, ui: ActTools) => Promise<void>;
}

const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];
const NESTED = [
  { value: "fruit", label: "Fruit", children: [{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }] },
  { value: "veg", label: "Veg", children: [{ value: "c", label: "Carrot" }] },
];

const doc = (container: HTMLElement) => container.ownerDocument;

const byText = (root: ParentNode, selector: string, text: string) =>
  [...root.querySelectorAll<HTMLElement>(selector)].find((el) => el.textContent?.trim() === text);

const pickOption = async (container: HTMLElement, ui: ActTools, label: string) => {
  ui.click(container.querySelector("[role='combobox']"));
  await ui.settle();
  ui.click(byText(doc(container), "[role='option']", label) ?? doc(container).querySelector(`[role='option'][aria-label='${label}']`));
  await ui.settle();
};

export const FORM_FIXTURES: FormFixture[] = [
  {
    id: "Dropdown/Dropdown",
    render: (p) => <Dropdown options={OPTIONS} label="Fruit" {...p} />,
    valueProp: "value",
    initial: "a",
    formData: ["f=a"],
    empty: ["f="],
    blocks: true,
    change: (c, ui) => pickOption(c, ui, "Banana"),
  },
  {
    id: "SearchableDropdown/SearchableDropdown",
    render: (p) => <SearchableDropdown options={OPTIONS} label="Fruit" {...p} />,
    valueProp: "value",
    initial: "a",
    formData: ["f=a"],
    empty: ["f="],
    blocks: true,
    change: (c, ui) => pickOption(c, ui, "Banana"),
  },
  {
    id: "MultiSelectDropdown/MultiSelectDropdown",
    render: (p) => <MultiSelectDropdown options={OPTIONS} label="Fruit" {...p} />,
    valueProp: "value",
    initial: ["a", "c"],
    // One entry per value, as a native <select multiple>; none when nothing is chosen.
    formData: ["f=a", "f=c"],
    empty: [],
    blocks: true,
    change: (c, ui) => pickOption(c, ui, "Banana"),
  },
  {
    id: "MultiSelectSearchableDropdown/MultiSelectSearchableDropdown",
    render: (p) => <MultiSelectSearchableDropdown options={OPTIONS} label="Fruit" {...p} />,
    valueProp: "value",
    initial: ["a", "c"],
    // One entry per value, as a native <select multiple>; none when nothing is chosen.
    formData: ["f=a", "f=c"],
    empty: [],
    blocks: true,
    change: (c, ui) => pickOption(c, ui, "Banana"),
  },
  {
    id: "CascadingDropdown/CascadingDropdown",
    render: (p) => <CascadingDropdown options={NESTED} label="Produce" {...p} />,
    valueProp: "value",
    initial: { fruit: "a" },
    formData: ['f={"fruit":"a"}'],
    empty: ["f={}"],
    blocks: true,
    change: async (c, ui) => {
      ui.click(c.querySelector("button[aria-haspopup]"));
      await ui.settle();
      ui.click(byText(doc(c), "[role='menuitem'], [role='menuitemradio'], [role='menuitemcheckbox']", "Veg"));
      await ui.settle();
      ui.click(byText(doc(c), "[role='menuitem'], [role='menuitemradio'], [role='menuitemcheckbox']", "Carrot"));
      await ui.settle();
    },
  },
  {
    id: "DatePicker/DatePicker",
    render: (p) => <DatePicker label="Day" {...p} />,
    valueProp: "value",
    initial: new Date(2026, 9, 7),
    formData: ["f=2026-10-07"],
    empty: ["f="],
    blocks: true,
    change: async (c, ui) => {
      ui.click(c.querySelector("[role='combobox']"));
      await ui.settle();
      ui.click(byText(doc(c), "[role='gridcell'] button, button[role='gridcell']", "15"));
      await ui.settle();
    },
  },
  {
    id: "TimePicker/TimePicker",
    render: (p) => <TimePicker label="Time" {...p} />,
    valueProp: "value",
    initial: "09:30",
    formData: ["f=09:30"],
    empty: ["f="],
    blocks: true,
    change: async (c, ui) => {
      const input = c.querySelector("input[role='combobox']");
      ui.focus(input);
      ui.change(input, "14:45");
      ui.keyDown(input, "Enter");
      await ui.settle();
    },
  },
  {
    id: "Switch/Switch",
    render: (p) => <Switch label="Alerts" {...p} />,
    valueProp: "checked",
    initial: true,
    formData: ["f=on"],
    empty: [],
    blocks: true,
    change: async (c, ui) => {
      ui.click(c.querySelector("[role='switch']"));
      await ui.settle();
    },
  },
  {
    id: "Slider/Slider",
    render: (p) => <Slider label="Volume" {...p} />,
    valueProp: "value",
    initial: 40,
    formData: ["f=40"],
    empty: ["f=0"],
    blocks: false,
    change: async (c, ui) => {
      const thumb = c.querySelector("[role='slider']");
      ui.focus(thumb);
      ui.keyDown(thumb, "ArrowRight");
      await ui.settle();
    },
  },
  {
    id: "OtpInput/OtpInput",
    render: (p) => <OtpInput label="Code" {...p} />,
    valueProp: "value",
    initial: "123456",
    formData: ["f=123456"],
    empty: ["f="],
    blocks: true,
    change: async (c, ui) => {
      const cell = c.querySelector("[role='group'] input");
      ui.focus(cell);
      ui.change(cell, "9");
      await ui.settle();
    },
  },
  {
    id: "InternationalPhoneInput/InternationalPhoneInput",
    render: (p) => <InternationalPhoneInput label="Phone" {...p} />,
    valueProp: "value",
    initial: { countryCode: "GB", phoneNumber: "2071234567" },
    formData: ["f_country=GB", "f=+442071234567"],
    empty: ["f_country=US", "f=+1"],
    blocks: true,
    change: async (c, ui) => {
      ui.change(c.querySelector("input[type='tel']"), "2079460000");
      await ui.settle();
    },
  },
  {
    id: "RadioButton/RadioGroup",
    render: (p) => (
      <RadioGroup label="Fruit" {...p}>
        {OPTIONS.map((o) => <RadioButton key={o.value} value={o.value} label={o.label} />)}
      </RadioGroup>
    ),
    valueProp: "value",
    initial: "a",
    formData: ["f=a"],
    empty: [],
    blocks: true,
    change: async (c, ui) => {
      ui.click(c.querySelector("input[type='radio'][value='b']"));
      await ui.settle();
    },
  },
  {
    id: "Checkbox/Checkbox",
    render: (p) => <Checkbox label="Agree" {...p} />,
    valueProp: "checked",
    initial: true,
    formData: ["f=on"],
    empty: [],
    blocks: true,
    change: async (c, ui) => {
      ui.click(c.querySelector("input[type='checkbox']"));
      await ui.settle();
    },
  },
  {
    id: "Input/Input",
    render: (p) => <Input label="Name" {...p} />,
    valueProp: "value",
    initial: "alpha",
    formData: ["f=alpha"],
    empty: ["f="],
    blocks: true,
    change: async (c, ui) => {
      ui.change(c.querySelector("input"), "beta");
      await ui.settle();
    },
  },
  {
    id: "TextArea/TextArea",
    render: (p) => <TextArea label="Notes" {...p} />,
    valueProp: "value",
    initial: "alpha",
    formData: ["f=alpha"],
    empty: ["f="],
    blocks: true,
    change: async (c, ui) => {
      ui.change(c.querySelector("textarea"), "beta");
      await ui.settle();
    },
  },
];

/** The default and change-callback props for a field's value pair. */
export const valueProps = (fixture: FormFixture) =>
  fixture.valueProp === "checked"
    ? { value: "checked", defaultValue: "defaultChecked", onChange: "onCheckedChange" }
    : { value: "value", defaultValue: "defaultValue", onChange: "onValueChange" };

/** FormData as `name=value` strings, in document order. */
export const formEntries = (form: HTMLFormElement) =>
  [...new FormData(form).entries()].map(([k, v]) => `${k}=${String(v)}`);
