/**
 * A clear empties the field it belongs to.
 *
 * A3 found Clear all reporting `[]` to `onValueChange` on an uncontrolled
 * MultiSelectDropdown and leaving every chip, and every submitted value, in
 * place; MultiSelectSearchableDropdown and CascadingDropdown did the same.
 * S4's step 0 found the same cause behind `onClear` on Input, TextArea and
 * InternationalPhoneInput: passing it replaced the clear, so the field kept its
 * value and `onValueChange` never fired — although every one of them documents
 * `onClear` as a notification. And Table's Clear search reported its empty
 * filter twice. Each clear reported, and nothing checked that it cleared.
 *
 * So every clear affordance — the clear buttons, a chip's remove, the
 * Delete/Backspace clear — is pressed on a field that holds a value, both
 * uncontrolled (`defaultValue`) and controlled (the value held by the parent
 * and fed back from `onValueChange`), and with `onClear` where the component
 * takes one. After it:
 *
 *   - the form submits exactly what the same field submits when it is empty
 *     (the form-participation contract's question, asked after a clear);
 *   - `onValueChange` was called once, with the documented empty value;
 *   - `onClear`, where passed, was called once.
 *
 * Form reset is the other way a field empties, and form-participation.contract
 * holds it over every field.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ReactElement, type ReactNode } from "react";
import { setReducedMotion } from "../../test/matchMedia.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
import { Input } from "../../components/Input/index.js";
import { InternationalPhoneInput } from "../../components/InternationalPhoneInput/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { SearchableDropdown } from "../../components/SearchableDropdown/index.js";
import { TextArea } from "../../components/TextArea/index.js";
import { TimePicker } from "../../components/TimePicker/index.js";
import { Table } from "../../components/Table/index.js";

beforeEach(() => setReducedMotion(false));

const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];
const NESTED = [{ value: "fruit", label: "Fruit", children: [{ value: "a", label: "Apple" }] }];

type Props = Record<string, unknown>;
type Gesture = "clear button" | "chip remove" | "Delete key";

interface Affordance {
  component: string;
  gesture: Gesture;
  /** A value the field holds before the clear. */
  value: unknown;
  /** What the field holds when empty, for the empty render; `undefined` is no value at all. */
  empty: unknown;
  /** The first argument `onValueChange` is documented to report on a clear. */
  emptyReport: (first: unknown) => boolean;
  /** Turns `onValueChange`'s arguments back into the `value` prop, for the controlled parent. */
  toValue: (...args: unknown[]) => unknown;
  takesOnClear?: boolean;
  render: (props: Props) => ReactElement;
}

const isNull = (v: unknown) => v === null;
const isEmptyArray = (v: unknown) => Array.isArray(v) && v.length === 0;
const same = (...a: unknown[]) => a[0];

const AFFORDANCES: Affordance[] = [
  { component: "CascadingDropdown", gesture: "clear button", value: { fruit: "a" }, empty: undefined, emptyReport: (v) => JSON.stringify(v) === "{}", toValue: same, render: (p) => <CascadingDropdown options={NESTED} clearable {...p} /> },
  { component: "DatePicker", gesture: "clear button", value: new Date(2026, 0, 15), empty: undefined, emptyReport: isNull, toValue: same, takesOnClear: true, render: (p) => <DatePicker clearable aria-label="Date" {...p} /> },
  { component: "Dropdown", gesture: "clear button", value: "a", empty: undefined, emptyReport: isNull, toValue: same, render: (p) => <Dropdown options={OPTIONS} clearable {...p} /> },
  { component: "Dropdown", gesture: "Delete key", value: "a", empty: undefined, emptyReport: isNull, toValue: same, render: (p) => <Dropdown options={OPTIONS} clearable {...p} /> },
  { component: "Input", gesture: "clear button", value: "hello", empty: undefined, emptyReport: (v) => v === "", toValue: same, takesOnClear: true, render: (p) => <Input clearable aria-label="Text" {...p} /> },
  {
    component: "InternationalPhoneInput",
    gesture: "clear button",
    value: { countryCode: "GB", phoneNumber: "2071234567" },
    empty: { countryCode: "GB", phoneNumber: "" },
    emptyReport: (v) => (v as { phoneNumber?: string })?.phoneNumber === "",
    toValue: (d) => ({ countryCode: (d as { countryCode: string }).countryCode, phoneNumber: (d as { phoneNumber: string }).phoneNumber }),
    takesOnClear: true,
    render: (p) => <InternationalPhoneInput clearable {...p} />,
  },
  { component: "MultiSelectDropdown", gesture: "clear button", value: ["a", "b"], empty: undefined, emptyReport: isEmptyArray, toValue: same, render: (p) => <MultiSelectDropdown options={OPTIONS} clearable {...p} /> },
  { component: "MultiSelectDropdown", gesture: "chip remove", value: ["a"], empty: undefined, emptyReport: isEmptyArray, toValue: same, render: (p) => <MultiSelectDropdown options={OPTIONS} showSelectedChips {...p} /> },
  { component: "MultiSelectSearchableDropdown", gesture: "clear button", value: ["a", "b"], empty: undefined, emptyReport: isEmptyArray, toValue: same, render: (p) => <MultiSelectSearchableDropdown options={OPTIONS} clearable {...p} /> },
  { component: "MultiSelectSearchableDropdown", gesture: "chip remove", value: ["a"], empty: undefined, emptyReport: isEmptyArray, toValue: same, render: (p) => <MultiSelectSearchableDropdown options={OPTIONS} showSelectedChips {...p} /> },
  { component: "SearchableDropdown", gesture: "clear button", value: "a", empty: undefined, emptyReport: isNull, toValue: same, render: (p) => <SearchableDropdown options={OPTIONS} clearable {...p} /> },
  { component: "SearchableDropdown", gesture: "Delete key", value: "a", empty: undefined, emptyReport: isNull, toValue: same, render: (p) => <SearchableDropdown options={OPTIONS} clearable {...p} /> },
  { component: "TextArea", gesture: "clear button", value: "hello", empty: undefined, emptyReport: (v) => v === "", toValue: same, takesOnClear: true, render: (p) => <TextArea clearable aria-label="Notes" {...p} /> },
  { component: "TimePicker", gesture: "clear button", value: "09:30", empty: undefined, emptyReport: isNull, toValue: same, takesOnClear: true, render: (p) => <TimePicker clearable aria-label="Time" {...p} /> },
];

/** The affordances when step 0 counted them: 14 on form fields, and Table's Clear search. */
const FLOOR = 15;

const CLEAR_NAME = /^(Clear|Clear selection|Clear all selections|Clear time|Clear phone number|Clear input|Clear textarea|Clear search)$/;

function Controlled({ a, initial, extra }: { a: Affordance; initial: unknown; extra: Props }) {
  const [value, setValue] = useState<unknown>(initial);
  const own = extra.onValueChange as ((...args: unknown[]) => void) | undefined;
  return a.render({
    name: "field",
    value,
    ...(a.component === "Input" || a.component === "TextArea" ? { onChange: () => {} } : {}),
    ...extra,
    onValueChange: (...args: unknown[]) => {
      own?.(...args);
      setValue(a.toValue(...args));
    },
  });
}

const submitted = (form: HTMLFormElement) =>
  [...new FormData(form).entries()].map(([k, v]) => `${k}=${String(v)}`).sort().join("&");

const inForm = (node: ReactNode) => <form data-testid="form">{node}</form>;

async function press(gesture: Gesture) {
  const user = userEvent.setup();
  if (gesture === "clear button") await user.click(screen.getAllByRole("button", { name: CLEAR_NAME })[0]);
  else if (gesture === "chip remove") await user.click(screen.getAllByRole("button", { name: /^Remove / })[0]);
  else {
    screen.getAllByRole("combobox")[0].focus();
    await user.keyboard("{Delete}");
  }
}

/**
 * One case: the field with a value, the gesture, and the three answers. Shared
 * by every affordance and by the plant, so the self-check proves this reading.
 */
async function runCase(a: Affordance, mode: "uncontrolled" | "controlled", withOnClear: boolean) {
  const empty = render(inForm(a.render({ name: "field", ...(a.empty === undefined ? {} : { defaultValue: a.empty }) })));
  const emptySubmits = submitted(empty.getByTestId("form") as HTMLFormElement);
  cleanup();

  const onValueChange = vi.fn();
  const onClear = vi.fn();
  const extra: Props = { onValueChange, ...(withOnClear ? { onClear } : {}) };
  const view = render(
    inForm(
      mode === "controlled" ? (
        <Controlled a={a} initial={a.value} extra={extra} />
      ) : (
        a.render({ name: "field", defaultValue: a.value, ...extra })
      ),
    ),
  );
  const form = view.getByTestId("form") as HTMLFormElement;
  const before = submitted(form);
  await press(a.gesture);
  await act(async () => {});
  const after = submitted(form);
  cleanup();
  return {
    before,
    after,
    emptySubmits,
    reports: onValueChange.mock.calls.map((c) => c[0]),
    clears: onClear.mock.calls.length,
  };
}

const verdict = (a: Affordance, r: Awaited<ReturnType<typeof runCase>>, withOnClear: boolean) => {
  const wrong: string[] = [];
  if (r.before === r.emptySubmits) wrong.push(`the field submitted its empty value before the clear (${r.before})`);
  if (r.after !== r.emptySubmits) wrong.push(`submits "${r.after}" after the clear, and "${r.emptySubmits}" when empty`);
  if (r.reports.length !== 1) wrong.push(`onValueChange called ${r.reports.length} times`);
  else if (!a.emptyReport(r.reports[0])) wrong.push(`onValueChange reported ${JSON.stringify(r.reports[0])}`);
  if (withOnClear && r.clears !== 1) wrong.push(`onClear called ${r.clears} times`);
  return wrong;
};

const population = AFFORDANCES.length + 1;

describe("clear: every clear affordance empties its field", () => {
  it(`reads every clear affordance, at least the ${FLOOR} step 0 counted`, () => {
    const modes = AFFORDANCES.reduce((n, a) => n + (a.takesOnClear ? 4 : 2), 2);
    console.log(`CLEAR affordances ${population} (floor ${FLOOR}), cases ${modes}`);
    expect(population).toBeGreaterThanOrEqual(FLOOR);
  });

  for (const a of AFFORDANCES) {
    for (const mode of ["uncontrolled", "controlled"] as const) {
      for (const withOnClear of a.takesOnClear ? [false, true] : [false]) {
        it(`${a.component} ${a.gesture}, ${mode}${withOnClear ? ", with onClear" : ""}`, async () => {
          const r = await runCase(a, mode, withOnClear);
          expect(verdict(a, r, withOnClear)).toEqual([]);
        });
      }
    }
  }

  for (const mode of ["uncontrolled", "controlled"] as const) {
    it(`Table Clear search, ${mode}: empties the search and reports "" once`, async () => {
      const onGlobalFilterChange = vi.fn();
      const onSearchClear = vi.fn();
      function Search() {
        const [filter, setFilter] = useState("ap");
        return mode === "controlled" ? (
          <Table
            data={[{ id: 1, name: "Apple" }]}
            columns={[{ id: "name", accessorKey: "name", header: "Name" }] as never}
            showSearch
            globalFilter={filter}
            onGlobalFilterChange={(v: string) => {
              onGlobalFilterChange(v);
              setFilter(v);
            }}
            onSearchClear={onSearchClear}
            aria-label="t"
          />
        ) : (
          <Table data={[{ id: 1, name: "Apple" }]} columns={[{ id: "name", accessorKey: "name", header: "Name" }] as never} showSearch onGlobalFilterChange={onGlobalFilterChange} onSearchClear={onSearchClear} aria-label="t" />
        );
      }
      render(<Search />);
      const user = userEvent.setup();
      const search = screen.getByRole("textbox", { name: "Search table" }) as HTMLInputElement;
      if (mode === "uncontrolled") await user.type(search, "ap");
      onGlobalFilterChange.mockClear();
      await user.click(screen.getByRole("button", { name: "Clear search" }));
      expect(search.value).toBe("");
      expect(onGlobalFilterChange.mock.calls).toEqual([[""]]);
      expect(onSearchClear).toHaveBeenCalledTimes(1);
    });
  }

  it("self-check: a clear planted to report without emptying its own state is caught", async () => {
    function PlantedMultiSelect(props: Props) {
      const [value] = useState<string[]>((props.value ?? props.defaultValue ?? []) as string[]);
      const shown = (props.value as string[] | undefined) ?? value;
      return (
        <>
          {shown.map((v) => (
            <input key={v} type="hidden" name={props.name as string} value={v} />
          ))}
          <button type="button" aria-label="Clear all selections" onClick={() => (props.onValueChange as (v: string[]) => void)?.([])}>
            x
          </button>
        </>
      );
    }
    const planted: Affordance = { component: "Planted", gesture: "clear button", value: ["a"], empty: undefined, emptyReport: isEmptyArray, toValue: same, render: (p) => <PlantedMultiSelect {...p} /> };
    const r = await runCase(planted, "uncontrolled", false);
    expect(verdict(planted, r, false)).toEqual([`submits "field=a" after the clear, and "" when empty`]);
  });
});
