/** @jsxImportSource react */
/**
 * Every form field takes part in its form the way a native control does.
 *
 * L20 measured the opposite on all eleven fields that submit through an input
 * the library renders: a form reset left the changed value on screen and in
 * FormData, and `required` with nothing chosen let the submit through. The
 * hidden input carried the value and nothing else — `type="hidden"` is barred
 * from constraint validation, and React keeps its value attribute in step with
 * the current value, so the browser's reset had nothing to go back to.
 *
 * The population is every exported component with a `name` prop of its own,
 * read by the compiler, plus the three natively-backed fields whose `name` is
 * inherited from the DOM. A component with a `name` that is not a form field
 * is listed with the reason, and the reason is re-proved: it must render no
 * form control at all. A new field with `name` and no fixture fails here.
 *
 * L21 adds the disabled row: a disabled native control is left out of
 * FormData, and eight of these fields submitted their value anyway.
 *
 * Focus is not asserted in jsdom, which moves none on an invalid submit;
 * `forms.spec.ts` asserts where it lands in three engines.
 */
import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { componentViews } from "../../test/propsWalk.js";
import { FORM_FIXTURES, formEntries, valueProps, type FormFixture } from "../fixtures/_forms.js";
import { contractActTools as ui } from "../fixtures/_act.contract.js";
import { setReducedMotion } from "../../test/matchMedia.js";
import { Avatar } from "../../components/Avatar/index.js";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown/index.js";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

/** Step 0's AST count of fields that submitted through `type="hidden"`. */
const FLOOR = 11;

/** Components whose `name` is not a form field, and why. */
const NOT_FIELDS: Record<string, { reason: string; render: () => ReactElement }> = {
  "Avatar/Avatar": {
    reason: "`name` is the person's display name, used for initials and the alt text",
    render: () => <Avatar name="probe" />,
  },
};

const counts = { checked: 0, reset: 0, required: 0, disabled: 0 };

const mount = (fixture: FormFixture, props: Record<string, unknown>) => {
  let submits = 0;
  const view = render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submits += 1;
      }}
    >
      {fixture.render({ name: "f", ...props })}
    </form>,
  );
  const form = view.container.querySelector("form")!;
  return { form, container: view.container, submits: () => submits };
};

describe("form participation", () => {
  it("every component with a name prop of its own has a form fixture or a reason", () => {
    const named = componentViews()
      .filter((view) => view.props.some((prop) => prop.name === "name"))
      .map((view) => view.id);
    const covered = new Set([...FORM_FIXTURES.map((f) => f.id), ...Object.keys(NOT_FIELDS)]);
    expect(named.filter((id) => !covered.has(id)), "named components with neither a form fixture nor a reason").toEqual([]);
    expect(Object.keys(NOT_FIELDS).filter((id) => !named.includes(id)), "reasons for components that no longer take `name`").toEqual([]);
    expect(FORM_FIXTURES.length).toBeGreaterThanOrEqual(FLOOR);
  });

  for (const [id, entry] of Object.entries(NOT_FIELDS)) {
    it(`${id} renders no form control (${entry.reason})`, () => {
      const view = render(<form>{entry.render()}</form>);
      expect(view.container.querySelector("form")!.elements.length).toBe(0);
    });
  }

  for (const fixture of FORM_FIXTURES) {
    const keys = valueProps(fixture);

    describe(fixture.id, () => {
      it("submits the documented FormData", async () => {
        counts.checked += 1;
        const filled = mount(fixture, { [keys.defaultValue]: fixture.initial });
        await ui.settle();
        expect(formEntries(filled.form)).toEqual(fixture.formData);
        cleanup();
        const empty = mount(fixture, {});
        await ui.settle();
        expect(formEntries(empty.form)).toEqual(fixture.empty);
      });

      it("reset restores the uncontrolled default", async () => {
        const { form, container } = mount(fixture, { [keys.defaultValue]: fixture.initial });
        await ui.settle();
        await fixture.change(container, ui);
        expect(formEntries(form), "the change act moved nothing").not.toEqual(fixture.formData);
        act(() => form.reset());
        await ui.settle();
        expect(formEntries(form)).toEqual(fixture.formData);
        counts.reset += 1;
      });

      it("reset leaves a controlled field alone and calls nothing", async () => {
        const calls: unknown[] = [];
        const { form } = mount(fixture, {
          [keys.value]: fixture.initial,
          [keys.onChange]: (value: unknown) => calls.push(value),
        });
        await ui.settle();
        act(() => form.reset());
        await ui.settle();
        expect(calls).toEqual([]);
        expect(formEntries(form)).toEqual(fixture.formData);
      });

      it("disabled, so not in FormData", async () => {
        const { form } = mount(fixture, { [keys.defaultValue]: fixture.initial, disabled: true });
        await ui.settle();
        expect(formEntries(form)).toEqual([]);
        counts.disabled += 1;
      });

      it(fixture.blocks ? "required and empty blocks the submit" : "is never empty, so required never blocks", async () => {
        const { form, submits } = mount(fixture, { required: true });
        await ui.settle();
        act(() => form.requestSubmit());
        await ui.settle();
        if (fixture.blocks) {
          expect(form.checkValidity()).toBe(false);
          expect(submits()).toBe(0);
        } else {
          expect(formEntries(form)).toEqual(fixture.empty);
          expect(submits()).toBe(1);
        }
        counts.required += 1;
      });
    });
  }
});

/**
 * A value containing a comma comes back whole.
 *
 * L23 measured both multi-selects submitting one entry with the values joined
 * by commas: `["Smith, J", "Doe"]` reached the server as `Smith, J,Doe`, and
 * `getAll` returned one string that any split read as three values. A native
 * <select multiple> submits one entry per value, so a value is never parsed.
 */
describe("multi-value fields submit one entry per value", () => {
  const PEOPLE = [
    { value: "Smith, J", label: "Smith, J" },
    { value: "Doe", label: "Doe" },
    { value: "Roe", label: "Roe" },
  ];
  for (const [id, Field] of [
    ["MultiSelectDropdown", MultiSelectDropdown],
    ["MultiSelectSearchableDropdown", MultiSelectSearchableDropdown],
  ] as const) {
    it(`${id}: a value containing a comma round-trips intact, in option order`, async () => {
      const view = render(
        <form>
          <Field name="f" label="People" options={PEOPLE} defaultValue={["Doe", "Smith, J"]} />
        </form>,
      );
      await ui.settle();
      expect(new FormData(view.container.querySelector("form")!).getAll("f")).toEqual(["Smith, J", "Doe"]);
    });
  }
});

/**
 * An empty multi-value field submits no entry.
 *
 * A native <select multiple> with nothing selected leaves its name out of
 * FormData, and the two multi-selects have done the same since L23. DatePicker
 * in multiple mode submitted `f=`, one empty string, which a server reads as a
 * date it cannot parse. L25 routes it through FormValue's empty-entries path.
 */
describe("an empty multi-value field submits no entry", () => {
  const OPTS = [{ value: "a", label: "A" }];
  const empty = async (field: ReactElement) => {
    const view = render(<form>{field}</form>);
    await ui.settle();
    return [...new FormData(view.container.querySelector("form")!).keys()];
  };
  it("a native <select multiple> with nothing selected submits nothing", async () => {
    expect(await empty(<select multiple name="f"><option value="a">A</option></select>)).toEqual([]);
  });
  for (const [id, field] of [
    ["DatePicker selectionMode=multiple", <DatePicker key="d" name="f" label="Days" selectionMode="multiple" />],
    ["MultiSelectDropdown", <MultiSelectDropdown key="m" name="f" label="M" options={OPTS} />],
    ["MultiSelectSearchableDropdown", <MultiSelectSearchableDropdown key="s" name="f" label="M" options={OPTS} />],
  ] as const) {
    it(`${id}, empty, submits no entry`, async () => {
      expect(await empty(field)).toEqual([]);
    });
  }
  it("DatePicker selectionMode=multiple, empty and required, still blocks the submit", async () => {
    const view = render(
      <form>
        <DatePicker name="f" label="Days" selectionMode="multiple" required />
      </form>,
    );
    await ui.settle();
    expect(view.container.querySelector("form")!.checkValidity()).toBe(false);
  });
});

afterAll(() => {
  console.log(
    `form fields checked ${counts.checked} (floor ${FLOOR}), reset ok ${counts.reset}, required ok ${counts.required}, disabled ok ${counts.disabled}`,
  );
});
