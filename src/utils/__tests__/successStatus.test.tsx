import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import type { ComponentType } from "react";
import { Checkbox } from "../../components/Checkbox/index.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
import { Input } from "../../components/Input/index.js";
import { InternationalPhoneInput } from "../../components/InternationalPhoneInput/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { OtpInput } from "../../components/OtpInput/index.js";
import { RadioButton, RadioGroup } from "../../components/RadioButton/index.js";
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { Slider } from "../../components/Slider/index.js";
import { Switch } from "../../components/Switch/index.js";
import { TextArea } from "../../components/TextArea/index.js";
import { TimePicker } from "../../components/TimePicker/index.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

const OPTIONS = [{ value: "a", label: "Apple" }];
const Group = (props: Record<string, unknown>) => (
  <RadioGroup name="r" {...props}>
    <RadioButton value="a" label="A" />
  </RadioGroup>
);

const FIELDS: [string, ComponentType<Record<string, unknown>>, Record<string, unknown>][] = [
  ["Input", Input as never, {}],
  ["TextArea", TextArea as never, {}],
  ["Checkbox", Checkbox as never, {}],
  ["Switch", Switch as never, {}],
  ["RadioGroup", Group, {}],
  ["Slider", Slider as never, {}],
  ["OtpInput", OtpInput as never, { length: 4 }],
  ["TimePicker", TimePicker as never, {}],
  ["DatePicker", DatePicker as never, {}],
  ["InternationalPhoneInput", InternationalPhoneInput as never, { defaultCountry: "IN" }],
  ["Dropdown", Dropdown as never, { options: OPTIONS }],
  ["SearchableDropdown", SearchableDropdown as never, { options: OPTIONS }],
  ["MultiSelectDropdown", MultiSelectDropdown as never, { options: OPTIONS }],
  ["MultiSelectSearchableDropdown", MultiSelectSearchableDropdown as never, { options: OPTIONS }],
  ["CascadingDropdown", CascadingDropdown as never, { options: OPTIONS }],
];

describe("a success message arrives in a status that was already there", () => {
  for (const [name, Field, props] of FIELDS) {
    it(`${name}: the same node holds it, and it is in the tree once`, () => {
      const { rerender } = render(<Field aria-label="F" {...props} />);
      const before = screen.getAllByRole("status");
      rerender(<Field aria-label="F" {...props} success successMessage="Saved" />);
      const messages = within(document.body).getAllByText("Saved");
      expect(messages).toHaveLength(1);
      expect(before).toContain(messages[0]);
      expect(messages[0]).toHaveAttribute("data-valid");
      rerender(<Field aria-label="F" {...props} />);
      expect(messages[0]).toBeEmptyDOMElement();
    });
  }
});
