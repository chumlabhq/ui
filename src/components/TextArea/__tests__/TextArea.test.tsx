import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextArea, TextAreaLabel } from "../index";

describe("TextArea", () => {
  describe("Rendering", () => {
    it("renders basic textarea with placeholder", () => {
      render(<TextArea aria-label="test" placeholder="Enter text" />);
      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(<TextArea label="Message" />);
      expect(screen.getByText("Message")).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<TextArea label="Message" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("associates label with textarea via htmlFor", () => {
      render(<TextArea label="Message" id="msg" />);
      expect(screen.getByText("Message")).toHaveAttribute("for", "msg");
    });

    it("generates id when not provided", () => {
      render(<TextArea label="Message" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("id");
      expect(textarea.id).toBeTruthy();
    });

    it("applies fullWidth class when fullWidth=true", () => {
      render(<TextArea aria-label="test" fullWidth className="test-container" />);
      expect(document.querySelector(".test-container")).toHaveClass("w-full");
    });

    it("renders with default 4 rows", () => {
      render(<TextArea aria-label="test" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "4");
    });

    it("renders with custom rows", () => {
      render(<TextArea aria-label="test" rows={8} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "8");
    });

    it("sets data-slot=textarea on the textarea element", () => {
      render(<TextArea label="Message" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "textarea");
    });
  });

  describe("Controlled TextArea", () => {
    it("accepts value prop", () => {
      render(<TextArea aria-label="test" value="test value" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("test value");
    });

    it("calls onChange when user types", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextArea aria-label="test" value="" onChange={onChange} />);
      await user.type(screen.getByRole("textbox"), "hello");
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Uncontrolled TextArea", () => {
    it("renders with defaultValue", () => {
      render(<TextArea aria-label="test" defaultValue="initial" />);
      expect(screen.getByRole("textbox")).toHaveValue("initial");
    });

    it("allows typing in uncontrolled mode", async () => {
      const user = userEvent.setup();
      render(<TextArea aria-label="test" />);
      await user.type(screen.getByRole("textbox"), "hello");
      expect(screen.getByRole("textbox")).toHaveValue("hello");
    });
  });

  describe("Disabled State", () => {
    it("disables textarea when disabled=true", () => {
      render(<TextArea aria-label="test" disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("disables textarea when loading=true", () => {
      render(<TextArea aria-label="test" loading />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("sets data-disabled attribute when disabled", () => {
      render(<TextArea aria-label="test" disabled className="test-container" />);
      expect(document.querySelector(".test-container")).toHaveAttribute("data-disabled", "true");
    });

    it("sets data-loading attribute when loading", () => {
      render(<TextArea aria-label="test" loading className="test-container" />);
      expect(document.querySelector(".test-container")).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Error State", () => {
    it("sets aria-invalid when error=true", () => {
      render(<TextArea aria-label="test" error />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("renders error message when error and errorMessage provided", () => {
      render(<TextArea aria-label="test" error errorMessage="Too short" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Too short");
    });

    it("does not render error message when error=false", () => {
      render(<TextArea aria-label="test" error={false} errorMessage="Too short" />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("sets aria-describedby to error element", () => {
      render(<TextArea id="test-ta" label="Message" error errorMessage="Required" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "test-ta-error");
    });

    it("includes error id in aria-describedby when error and errorMessage provided", () => {
      render(<TextArea id="test-ta" label="Message" error errorMessage="Required" />);
      expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toContain("test-ta-error");
    });

    it("sets data-error attribute when error=true", () => {
      render(<TextArea aria-label="test" error className="test-container" />);
      expect(document.querySelector(".test-container")).toHaveAttribute("data-error", "true");
    });
  });

  describe("Success State", () => {
    it("renders success message when success and successMessage provided", () => {
      render(<TextArea aria-label="test" success successMessage="Looks good!" />);
      expect(screen.getByRole("status")).toHaveTextContent("Looks good!");
    });

    it("does not render success message when success=false", () => {
      render(<TextArea aria-label="test" success={false} successMessage="Looks good!" />);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("error takes precedence over success", () => {
      render(<TextArea aria-label="test" error errorMessage="Error" success successMessage="Success" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Error");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("sets data-success on container only when no error", () => {
      render(<TextArea aria-label="test" success className="test-container" />);
      expect(document.querySelector(".test-container")).toHaveAttribute("data-success", "true");
    });

    it("does NOT set data-success when error is also true", () => {
      render(<TextArea aria-label="test" success error className="test-container" />);
      expect(document.querySelector(".test-container")).not.toHaveAttribute("data-success");
    });

    it("applies classes.success to success message", () => {
      render(<TextArea aria-label="test" success successMessage="Good" classes={{ success: "custom-success" }} />);
      expect(document.querySelector(".custom-success")).toBeInTheDocument();
    });
  });

  describe("Description / Helper Text", () => {
    it("renders description when provided", () => {
      render(<TextArea label="Bio" description="Tell us about yourself" />);
      expect(screen.getByText("Tell us about yourself")).toBeInTheDocument();
    });

    it("links description via aria-describedby", () => {
      render(<TextArea id="test-ta" label="Bio" description="Helper text" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "test-ta-description");
    });

    it("concatenates description and error into aria-describedby", () => {
      render(<TextArea id="test-ta" label="Bio" description="Helper" error errorMessage="Required" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "test-ta-description test-ta-error");
    });

    it("applies classes.description", () => {
      render(<TextArea label="Bio" description="Help" classes={{ description: "custom-desc" }} />);
      expect(document.querySelector(".custom-desc")).toBeInTheDocument();
    });
  });

  describe("Clearable", () => {
    it("shows clear button when clearable and has value", () => {
      render(<TextArea aria-label="test" clearable value="test" onChange={() => {}} />);
      expect(screen.getByRole("button", { name: "Clear textarea" })).toBeInTheDocument();
    });

    it("does not show clear button when value is empty", () => {
      render(<TextArea aria-label="test" clearable value="" onChange={() => {}} />);
      expect(screen.queryByRole("button", { name: "Clear textarea" })).not.toBeInTheDocument();
    });

    it("does not show clear button when disabled", () => {
      render(<TextArea aria-label="test" clearable value="test" disabled onChange={() => {}} />);
      expect(screen.queryByRole("button", { name: "Clear textarea" })).not.toBeInTheDocument();
    });

    it("does not show clear button when readOnly", () => {
      render(<TextArea aria-label="test" clearable value="test" readOnly onChange={() => {}} />);
      expect(screen.queryByRole("button", { name: "Clear textarea" })).not.toBeInTheDocument();
    });

    it("calls onClear when clear button clicked", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(<TextArea aria-label="test" clearable value="test" onChange={() => {}} onClear={onClear} />);
      await user.click(screen.getByRole("button", { name: "Clear textarea" }));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("fires onChange exactly once when clear clicked without onClear", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextArea aria-label="test" name="msg" clearable value="test" onChange={onChange} />);
      await user.click(screen.getByRole("button", { name: "Clear textarea" }));
      expect(onChange).toHaveBeenCalledTimes(1);
      const event = onChange.mock.calls[0][0];
      expect(event.target).toBeInstanceOf(HTMLTextAreaElement);
      expect(event.target.value).toBe("");
      expect(event.target.name).toBe("msg");
    });
  });

  describe("Character Count", () => {
    it("renders character count when showCount and maxLength set", () => {
      render(<TextArea aria-label="test" showCount maxLength={100} value="hello" onChange={() => {}} />);
      expect(screen.getByText("5/100")).toBeInTheDocument();
    });

    it("does not render count when showCount=false", () => {
      render(<TextArea aria-label="test" showCount={false} maxLength={100} value="hello" onChange={() => {}} />);
      expect(screen.queryByText("5/100")).not.toBeInTheDocument();
    });

    it("count has aria-live=polite", () => {
      render(<TextArea aria-label="test" showCount maxLength={50} value="hi" onChange={() => {}} />);
      expect(screen.getByText("2/50")).toHaveAttribute("aria-live", "polite");
    });

    it("links count to textarea via aria-describedby", () => {
      render(<TextArea id="test-ta" aria-label="test" showCount maxLength={100} value="hello" onChange={() => {}} />);
      expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toContain("test-ta-count");
    });

    it("applies classes.count", () => {
      render(<TextArea aria-label="test" showCount maxLength={10} value="" onChange={() => {}} classes={{ count: "custom-count" }} />);
      expect(document.querySelector(".custom-count")).toBeInTheDocument();
    });
  });

  describe("onValueChange", () => {
    it("calls onValueChange with string value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<TextArea label="Name" onValueChange={onValueChange} />);
      await user.type(screen.getByRole("textbox"), "hi");
      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange).toHaveBeenNthCalledWith(1, "h");
      expect(onValueChange).toHaveBeenNthCalledWith(2, "hi");
    });

    it("calls both onChange and onValueChange", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onValueChange = vi.fn();
      render(<TextArea label="Name" onChange={onChange} onValueChange={onValueChange} />);
      await user.type(screen.getByRole("textbox"), "a");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith("a");
    });
  });

  describe("Icons", () => {
    it("renders start icon", () => {
      render(<TextArea aria-label="test" startIcon={<span data-testid="start">S</span>} />);
      expect(screen.getByTestId("start")).toBeInTheDocument();
    });

    it("renders end icon", () => {
      render(<TextArea aria-label="test" endIcon={<span data-testid="end">E</span>} />);
      expect(screen.getByTestId("end")).toBeInTheDocument();
    });
  });

  describe("Clickable Icons", () => {
    it("calls onStartIconClick when start icon clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<TextArea aria-label="test" startIcon={<span>S</span>} onStartIconClick={onClick} startIconLabel="Format" />);
      await user.click(screen.getByRole("button", { name: "Format" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onEndIconClick when end icon clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<TextArea aria-label="test" endIcon={<span>E</span>} onEndIconClick={onClick} endIconLabel="Send" />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not render button role when no onClick handler", () => {
      render(<TextArea aria-label="test" startIcon={<span>S</span>} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("renders loader when loading=true", () => {
      render(<TextArea aria-label="test" loading />);
      expect(document.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it("renders custom loader when provided", () => {
      render(<TextArea aria-label="test" loading loader={<span data-testid="loader">Loading</span>} />);
      expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("sets aria-busy on wrapper when loading", () => {
      render(<TextArea aria-label="test" loading />);
      expect(document.querySelector('[data-slot="wrapper"]')).toHaveAttribute("aria-busy", "true");
    });

    it("does not set aria-busy when not loading", () => {
      render(<TextArea aria-label="test" />);
      expect(document.querySelector('[data-slot="wrapper"]')).not.toHaveAttribute("aria-busy");
    });
  });

  describe("Size and Data Attributes", () => {
    it("sets data-size on container when size provided", () => {
      render(<TextArea label="Name" size="lg" className="test-container" />);
      expect(document.querySelector(".test-container")).toHaveAttribute("data-size", "lg");
    });

    it("does not set data-size when size is not provided", () => {
      render(<TextArea label="Name" className="test-container" />);
      expect(document.querySelector(".test-container")).not.toHaveAttribute("data-size");
    });

    it("sets data-readonly on container and textarea when readOnly", () => {
      render(<TextArea label="Name" readOnly value="x" className="test-container" />);
      expect(document.querySelector(".test-container")).toHaveAttribute("data-readonly", "true");
      expect(screen.getByRole("textbox")).toHaveAttribute("data-readonly", "true");
    });
  });

  describe("Rest Spread Safety", () => {
    it("does not allow rest props to override aria-invalid", () => {
      render(<TextArea aria-label="test" error {...{ "aria-invalid": false } as Record<string, unknown>} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Accessibility", () => {
    it("sets aria-required when required", () => {
      render(<TextArea aria-label="test" required />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    it("hides required asterisk from screen readers", () => {
      render(<TextArea label="Message" required />);
      expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    });

    it("provides accessible name via label", () => {
      render(<TextArea label="Description" id="desc" />);
      expect(screen.getByRole("textbox")).toHaveAccessibleName("Description");
    });

    it("icon buttons have accessible labels", () => {
      render(
        <TextArea
          aria-label="test"
          startIcon={<span>S</span>}
          onStartIconClick={() => {}}
          startIconLabel="Format"
          endIcon={<span>E</span>}
          onEndIconClick={() => {}}
          endIconLabel="Send"
        />
      );
      expect(screen.getByRole("button", { name: "Format" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to textarea element", () => {
      const ref = vi.fn();
      render(<TextArea aria-label="test" ref={ref} />);
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("ref provides access to textarea methods", () => {
      let taRef: HTMLTextAreaElement | null = null;
      render(<TextArea aria-label="test" ref={(el) => { taRef = el; }} defaultValue="test" />);
      expect(taRef).not.toBeNull();
      expect(taRef!.value).toBe("test");
    });
  });

  describe("Custom Styling", () => {
    it("applies className to root container", () => {
      render(<TextArea aria-label="test" className="custom-container" />);
      expect(document.querySelector(".custom-container")).toBeInTheDocument();
    });

    it("applies classes.wrapper to wrapper", () => {
      render(<TextArea aria-label="test" classes={{ wrapper: "custom-wrapper" }} />);
      expect(document.querySelector(".custom-wrapper")).toBeInTheDocument();
    });

    it("applies classes.textarea to textarea element", () => {
      render(<TextArea aria-label="test" classes={{ textarea: "ta-style" }} />);
      expect(screen.getByRole("textbox")).toHaveClass("ta-style");
    });

    it("applies classes.label to label", () => {
      render(<TextArea label="Message" classes={{ label: "custom-label" }} />);
      expect(screen.getByText("Message")).toHaveClass("custom-label");
    });

    it("applies classes.error to error message", () => {
      render(<TextArea aria-label="test" error errorMessage="Error" classes={{ error: "custom-error" }} />);
      expect(screen.getByRole("alert")).toHaveClass("custom-error");
    });
  });

  describe("Disabled Icon Buttons", () => {
    it("disables icon button when textarea is disabled", () => {
      render(<TextArea label="Msg" disabled startIcon={<span>S</span>} onStartIconClick={() => {}} startIconLabel="Format" />);
      expect(screen.getByRole("button", { name: "Format" })).toBeDisabled();
    });

    it("disables icon button when textarea is loading", () => {
      render(<TextArea label="Msg" loading endIcon={<span>E</span>} onEndIconClick={() => {}} endIconLabel="Send" />);
      expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    });
  });
});

describe("TextAreaLabel", () => {
  it("renders label text", () => {
    render(<TextAreaLabel label="Message" htmlFor="msg" />);
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    render(<TextAreaLabel label="Message" htmlFor="msg" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("associates with textarea via htmlFor", () => {
    render(<TextAreaLabel label="Message" htmlFor="msg-input" />);
    expect(screen.getByText("Message")).toHaveAttribute("for", "msg-input");
  });

  it("applies className", () => {
    render(<TextAreaLabel label="Message" htmlFor="msg" className="custom-label" />);
    expect(screen.getByText("Message")).toHaveClass("custom-label");
  });
});
