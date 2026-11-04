/** @jsxImportSource react */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { setReducedMotion } from "../../../test/matchMedia.js";
import { Avatar } from "../../../components/Avatar/index.js";
import { Breadcrumb } from "../../../components/Breadcrumb/index.js";
import { CascadingDropdown } from "../../../components/CascadingDropdown/index.js";
import { Checkbox } from "../../../components/Checkbox/index.js";
import { DatePicker } from "../../../components/DatePicker/index.js";
import { Input } from "../../../components/Input/index.js";
import { InternationalPhoneInput } from "../../../components/InternationalPhoneInput/index.js";
import { CircularLoader } from "../../../components/Loader/index.js";
import { Modal } from "../../../components/Modal/index.js";
import { OtpInput } from "../../../components/OtpInput/index.js";
import { RadioGroup, RadioButton } from "../../../components/RadioButton/index.js";
import { Slider } from "../../../components/Slider/index.js";
import { Stepper } from "../../../components/Stepper/index.js";
import { TabPanel } from "../../../components/TabPanel/index.js";
import { Table } from "../../../components/Table/index.js";
import { TextArea } from "../../../components/TextArea/index.js";
import { TimePicker } from "../../../components/TimePicker/index.js";
import { ToastProvider } from "../../../components/Toast/index.js";

beforeEach(() => setReducedMotion(true));
afterEach(cleanup);

const ROWS = [{ id: "1", name: "Ada" }];
const COLUMNS = [{ id: "name", accessorKey: "name", header: "Name" }];
const STEPS = [
  { id: "one", label: "Details" },
  { id: "two", label: "Payment" },
];

describe("a loading state is announced", () => {
  const ANNOUNCED: Array<[string, () => React.ReactNode]> = [
    ["Input", () => <Input aria-label="x" loading />],
    ["TextArea", () => <TextArea aria-label="x" loading />],
    ["RadioGroup", () => <RadioGroup aria-label="x" loading><RadioButton value="a" label="A" /></RadioGroup>],
    ["DatePicker", () => <DatePicker aria-label="x" loading />],
    ["InternationalPhoneInput", () => <InternationalPhoneInput aria-label="x" loading />],
    ["Checkbox", () => <Checkbox aria-label="x" loading />],
    ["OtpInput", () => <OtpInput loading />],
    ["Slider", () => <Slider aria-label="x" loading />],
    ["TimePicker", () => <TimePicker aria-label="x" loading />],
  ];
  for (const [name, ui] of ANNOUNCED) {
    it(name, () => {
      render(<>{ui()}</>);
      const status = screen.getAllByRole("status");
      expect(status.filter((el) => /Loading/.test(el.getAttribute("aria-label") ?? el.textContent ?? ""))).toHaveLength(1);
    });
  }

  for (const [name, ui] of ANNOUNCED.slice(5)) {
    it(`${name} marks itself busy`, () => {
      const { container } = render(<>{ui()}</>);
      expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    });
  }
});

describe("Slider's names", () => {
  it("a labelled range tells its thumbs apart", () => {
    render(<Slider label="Volume" defaultValue={[10, 20]} />);
    expect(screen.getByRole("slider", { name: "Volume Minimum" })).not.toBeNull();
    expect(screen.getByRole("slider", { name: "Volume Maximum" })).not.toBeNull();
  });

  it("a single thumb invents no name", () => {
    render(<Slider />);
    expect(screen.queryByRole("slider", { name: "Minimum" })).toBeNull();
  });
});

describe("names that ARIA prohibits on a role-less element", () => {
  it("TabPanel's count is an image with its name", () => {
    render(<TabPanel tabs={[{ id: "one", label: "First", count: 3 }]} />);
    expect(screen.getByLabelText("3 items").getAttribute("role")).toBe("img");
  });

  it("Avatar's root carries no aria-label beside its image", () => {
    const { container } = render(<Avatar src="https://example.test/a.png" name="Ada" />);
    act(() => {
      fireEvent.load(container.querySelector("img")!);
    });
    expect(container.querySelector("[data-has-image]")?.hasAttribute("aria-label")).toBe(false);
  });
});

describe("Table", () => {
  it("a row claims no selection state when the table has no selection", () => {
    render(<Table data={ROWS} columns={COLUMNS} />);
    const row = screen.getAllByRole("row")[1];
    expect(row.hasAttribute("aria-selected")).toBe(false);
  });

  it("the expand toggle reports aria-expanded", () => {
    render(<Table data={ROWS} columns={COLUMNS} expandable getRowId={(r) => r.id} renderExpandedRow={() => <p>More</p>} />);
    expect(screen.getByRole("button", { name: "Expand row" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("the expand and drag columns' headers have names", () => {
    render(<Table data={ROWS} columns={COLUMNS} expandable renderExpandedRow={() => <p>More</p>} reorderable getRowId={(r) => r.id} />);
    expect(screen.getByRole("columnheader", { name: "Row details" })).not.toBeNull();
    expect(screen.getByRole("columnheader", { name: "Reorder" })).not.toBeNull();
  });
});

describe("Stepper's step status reaches the name", () => {
  it("error", () => {
    const { container } = render(<Stepper steps={STEPS} value="one" getStepStatus={(_id, i) => (i === 1 ? "error" : "active")} />);
    expect(container.querySelector('[role="group"]')?.textContent).toMatch(/Payment.*error/);
  });

  it("completed", () => {
    render(<Stepper steps={STEPS} value="two" isStepClickable={() => true} />);
    expect(screen.getByRole("button", { name: /Details.*completed/ })).not.toBeNull();
  });
});

describe("a decorative svg is hidden from the tree", () => {
  const CASES: Array<[string, () => React.ReactNode]> = [
    ["Breadcrumb's ellipsis", () => <Breadcrumb items={[{ id: "a", label: "A", href: "#a" }, { id: "b", label: "B", href: "#b" }, { id: "c", label: "C", href: "#c" }, { id: "d", label: "D" }]} maxVisible={2} />],
    ["CascadingDropdown's chevron", () => <CascadingDropdown options={[{ value: "a", label: "A" }]} aria-label="x" />],
    ["Modal's close glyph", () => <Modal open title="T" onOpenChange={() => {}} reduceMotion><p>Body</p></Modal>],
    ["Loader's spinner", () => <CircularLoader />],
  ];
  for (const [name, ui] of CASES) {
    it(name, () => {
      render(<>{ui()}</>);
      expect([...document.querySelectorAll("svg")].filter((svg) => !svg.closest('[aria-hidden="true"]')).map((svg) => svg.outerHTML.slice(0, 60))).toEqual([]);
    });
  }
});

describe("DatePicker announces the month it moved to", () => {
  it("a status holds the visible month, and follows the arrows", async () => {
    render(<DatePicker aria-label="x" defaultValue={new Date(2026, 0, 15)} defaultOpen />);
    const months = () => screen.getAllByRole("status").map((el) => el.textContent);
    expect(months()).toContain("January 2026");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    });
    expect(months()).toContain("February 2026");
  });
});

describe("ToastProvider", () => {
  it("holds a live region before the first toast", () => {
    render(<ToastProvider><p>App</p></ToastProvider>);
    const region = within(document.body).getByRole("region", { name: "Notifications" });
    expect(region.getAttribute("aria-live")).toBe("polite");
  });
});
