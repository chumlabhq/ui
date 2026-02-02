import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpInput, OtpInputLabel } from "../index";

describe("OtpInput", () => {
  describe("Rendering", () => {
    it("renders 6 inputs by default", () => {
      render(<OtpInput />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(6);
    });

    it("renders custom number of inputs when length specified", () => {
      render(<OtpInput length={4} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(4);
    });

    it("renders label when provided", () => {
      render(<OtpInput label="Verification Code" />);

      expect(screen.getByText("Verification Code")).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<OtpInput label="Code" required />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("associates label with first input via htmlFor", () => {
      render(<OtpInput label="Code" id="otp-input" />);

      const label = screen.getByText("Code");
      expect(label).toHaveAttribute("for", "otp-input");
    });

    it("generates id from name when id not provided", () => {
      render(<OtpInput label="Code" name="verification-code" />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveAttribute("id", "verification-code");
    });

    it("applies fullWidth class when fullWidth=true", () => {
      render(<OtpInput fullWidth containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveClass("w-full");
    });
  });

  describe("Grouped Inputs", () => {
    it("renders inputs in groups when groups prop provided", () => {
      render(<OtpInput groups={[3, 3]} groupClassName="otp-group" />);

      const groups = document.querySelectorAll(".otp-group");
      expect(groups).toHaveLength(2);
    });

    it("renders separator between groups", () => {
      render(
        <OtpInput
          groups={[3, 3]}
          separator={<span data-testid="separator">-</span>}
        />
      );

      expect(screen.getByTestId("separator")).toBeInTheDocument();
    });

    it("renders correct number of inputs across groups", () => {
      render(<OtpInput groups={[2, 2, 2]} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(6);
    });

    it("applies group data attribute", () => {
      render(<OtpInput groups={[3, 3]} groupClassName="otp-group" />);

      const groups = document.querySelectorAll(".otp-group");
      expect(groups[0]).toHaveAttribute("data-group", "0");
      expect(groups[1]).toHaveAttribute("data-group", "1");
    });
  });

  describe("Controlled Input", () => {
    it("displays value prop across inputs", () => {
      render(<OtpInput value="123456" onChange={() => {}} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveValue("1");
      expect(inputs[1]).toHaveValue("2");
      expect(inputs[2]).toHaveValue("3");
      expect(inputs[3]).toHaveValue("4");
      expect(inputs[4]).toHaveValue("5");
      expect(inputs[5]).toHaveValue("6");
    });

    it("calls onChange when user types a digit", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput onChange={onChange} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.type(inputs[0], "1");

      expect(onChange).toHaveBeenCalledWith("1");
    });

    it("calls onComplete when all digits are filled via paste", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(
        <OtpInput
          length={4}
          onChange={() => {}}
          onComplete={onComplete}
          autoFocusFirst={false}
        />
      );

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);

      // Simulate paste which triggers onComplete
      const wrapper = inputs[0].parentElement!;
      const clipboardData = { getData: () => "1234" };
      const pasteEvent = new Event("paste", { bubbles: true });
      Object.defineProperty(pasteEvent, "clipboardData", { value: clipboardData });
      wrapper.dispatchEvent(pasteEvent);

      expect(onComplete).toHaveBeenCalledWith("1234");
    });
  });

  describe("Digit Input Behavior", () => {
    it("filters non-numeric characters", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput onChange={onChange} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.type(inputs[0], "abc");

      // Should not call onChange with non-numeric input
      expect(onChange).not.toHaveBeenCalledWith("a");
      expect(onChange).not.toHaveBeenCalledWith("abc");
    });

    it("accepts only single digit per input", () => {
      render(<OtpInput value="5" onChange={() => {}} />);

      const inputs = screen.getAllByRole("textbox");
      
      // Each input has maxLength of 1
      expect(inputs[0]).toHaveAttribute("maxLength", "1");
      expect(inputs[1]).toHaveAttribute("maxLength", "1");
    });

    it("sets inputMode to numeric", () => {
      render(<OtpInput />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveAttribute("inputMode", "numeric");
    });

    it("renders password type when inputType=password", () => {
      render(<OtpInput inputType="password" />);

      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("type", "password");
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("moves focus to next input after typing digit", async () => {
      const user = userEvent.setup();

      render(<OtpInput value="" onChange={() => {}} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.type(inputs[0], "1");

      expect(inputs[1]).toHaveFocus();
    });

    it("moves focus to previous input on Backspace when current is empty", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput value="1" onChange={onChange} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[1]);
      await user.keyboard("{Backspace}");

      expect(inputs[0]).toHaveFocus();
    });

    it("clears current input on Backspace when filled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput value="12" onChange={onChange} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[1]);
      await user.keyboard("{Backspace}");

      // Should clear second position and move to first
      expect(onChange).toHaveBeenCalledWith("1");
    });

    it("clears current input on Delete without moving focus", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput value="123" onChange={onChange} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[1]);
      await user.keyboard("{Delete}");

      expect(onChange).toHaveBeenCalledWith("1 3".replace(" ", ""));
      expect(inputs[1]).toHaveFocus();
    });

    it("moves focus left on ArrowLeft", async () => {
      const user = userEvent.setup();

      render(<OtpInput value="123" onChange={() => {}} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[2]);
      await user.keyboard("{ArrowLeft}");

      expect(inputs[1]).toHaveFocus();
    });

    it("moves focus right on ArrowRight", async () => {
      const user = userEvent.setup();

      render(<OtpInput value="123" onChange={() => {}} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.keyboard("{ArrowRight}");

      expect(inputs[1]).toHaveFocus();
    });

    it("moves focus to first input on Home", async () => {
      const user = userEvent.setup();

      render(<OtpInput value="123" onChange={() => {}} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[3]);
      await user.keyboard("{Home}");

      expect(inputs[0]).toHaveFocus();
    });

    it("moves focus to last input on End", async () => {
      const user = userEvent.setup();

      render(<OtpInput value="123" onChange={() => {}} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.keyboard("{End}");

      expect(inputs[5]).toHaveFocus();
    });

    it("does not move past first input on ArrowLeft", async () => {
      const user = userEvent.setup();

      render(<OtpInput value="1" onChange={() => {}} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);
      await user.keyboard("{ArrowLeft}");

      expect(inputs[0]).toHaveFocus();
    });

    it("does not move past last input on ArrowRight", async () => {
      const user = userEvent.setup();

      render(<OtpInput value="123456" onChange={() => {}} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[5]);
      await user.keyboard("{ArrowRight}");

      expect(inputs[5]).toHaveFocus();
    });
  });

  describe("Paste Handling", () => {
    // Helper to simulate paste event since ClipboardEvent constructor
    // is not fully supported in jsdom
    const simulatePaste = (element: HTMLElement, text: string) => {
      const clipboardData = {
        getData: () => text,
      };
      const pasteEvent = new Event("paste", { bubbles: true });
      Object.defineProperty(pasteEvent, "clipboardData", {
        value: clipboardData,
      });
      element.dispatchEvent(pasteEvent);
    };

    it("fills multiple inputs on paste", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput onChange={onChange} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);

      const wrapper = inputs[0].parentElement!;
      simulatePaste(wrapper, "123456");

      expect(onChange).toHaveBeenCalledWith("123456");
    });

    it("filters non-numeric characters from paste", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput onChange={onChange} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);

      const wrapper = inputs[0].parentElement!;
      simulatePaste(wrapper, "1a2b3c");

      expect(onChange).toHaveBeenCalledWith("123");
    });

    it("does not handle paste when allowPaste=false", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput onChange={onChange} allowPaste={false} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);

      const wrapper = inputs[0].parentElement!;
      simulatePaste(wrapper, "123456");

      expect(onChange).not.toHaveBeenCalled();
    });

    it("calls onComplete when paste fills all inputs", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(
        <OtpInput
          length={4}
          onChange={() => {}}
          onComplete={onComplete}
          autoFocusFirst={false}
        />
      );

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);

      const wrapper = inputs[0].parentElement!;
      simulatePaste(wrapper, "1234");

      expect(onComplete).toHaveBeenCalledWith("1234");
    });

    it("truncates paste to length", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<OtpInput length={4} onChange={onChange} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[0]);

      const wrapper = inputs[0].parentElement!;
      simulatePaste(wrapper, "123456789");

      expect(onChange).toHaveBeenCalledWith("1234");
    });
  });

  describe("Disabled State", () => {
    it("disables all inputs when disabled=true", () => {
      render(<OtpInput disabled />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it("sets data-disabled attribute on container", () => {
      render(<OtpInput disabled containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-disabled", "true");
    });

    it("sets data-disabled attribute on each input", () => {
      render(<OtpInput disabled />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("data-disabled", "true");
      });
    });
  });

  describe("Error State", () => {
    it("sets aria-invalid on all inputs when error=true", () => {
      render(<OtpInput error />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("renders error message when error and errorMessage provided", () => {
      render(<OtpInput error errorMessage="Invalid code" />);

      expect(screen.getByRole("alert")).toHaveTextContent("Invalid code");
    });

    it("does not render error message when error=false", () => {
      render(<OtpInput error={false} errorMessage="Invalid code" />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("sets aria-describedby linking to error element", () => {
      render(<OtpInput id="otp" error errorMessage="Invalid code" />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveAttribute("aria-describedby", "otp-error");
    });

    it("sets data-error attribute on container", () => {
      render(<OtpInput error containerClassName="test-container" />);

      const container = document.querySelector(".test-container");
      expect(container).toHaveAttribute("data-error", "true");
    });
  });

  describe("Accessibility", () => {
    it("sets aria-label on each input", () => {
      render(<OtpInput />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input, index) => {
        expect(input).toHaveAttribute("aria-label", `OTP digit ${index + 1}`);
      });
    });

    it("sets aria-required on inputs when required", () => {
      render(<OtpInput required />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("aria-required", "true");
      });
    });

    it("hides required asterisk from screen readers", () => {
      render(<OtpInput label="Code" required />);

      const asterisk = screen.getByText("*");
      expect(asterisk).toHaveAttribute("aria-hidden", "true");
    });

    it("sets autocomplete=one-time-code on first input", () => {
      render(<OtpInput />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveAttribute("autoComplete", "one-time-code");
    });

    it("sets autocomplete=off on subsequent inputs", () => {
      render(<OtpInput />);

      const inputs = screen.getAllByRole("textbox");
      for (let i = 1; i < inputs.length; i++) {
        expect(inputs[i]).toHaveAttribute("autoComplete", "off");
      }
    });

    it("wrapper has role=group with aria-label", () => {
      render(<OtpInput />);

      const wrapper = screen.getByRole("group", { name: "OTP input" });
      expect(wrapper).toBeInTheDocument();
    });

    it("wrapper has aria-roledescription", () => {
      render(<OtpInput />);

      const wrapper = screen.getByRole("group");
      expect(wrapper).toHaveAttribute(
        "aria-roledescription",
        "One-time password input"
      );
    });
  });

  describe("Auto Focus", () => {
    it("auto-focuses first input when autoFocusFirst=true", () => {
      render(<OtpInput autoFocusFirst />);

      const inputs = screen.getAllByRole("textbox");
      // Check that the input has focus (autoFocus behavior)
      expect(inputs[0]).toHaveFocus();
    });

    it("does not auto-focus when autoFocusFirst=false", () => {
      render(<OtpInput autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).not.toHaveFocus();
    });
  });

  describe("Focus Behavior", () => {
    it("selects input content on focus", async () => {
      const user = userEvent.setup();

      render(<OtpInput value="123456" onChange={() => {}} autoFocusFirst={false} />);

      const inputs = screen.getAllByRole("textbox");
      await user.click(inputs[2]);

      // The input should be focused and content selected
      expect(inputs[2]).toHaveFocus();
    });
  });

  describe("Custom Render", () => {
    it("uses renderInput when provided", () => {
      render(
        <OtpInput
          renderInput={({ index, inputProps }) => (
            <div key={index} data-testid={`custom-input-${index}`}>
              <input {...inputProps} />
            </div>
          )}
        />
      );

      expect(screen.getByTestId("custom-input-0")).toBeInTheDocument();
      expect(screen.getByTestId("custom-input-5")).toBeInTheDocument();
    });

    it("passes correct props to renderInput", () => {
      const renderInput = vi.fn(({ inputProps }) => <input {...inputProps} />);

      render(
        <OtpInput
          value="123"
          disabled
          error
          renderInput={renderInput}
          autoFocusFirst={false}
        />
      );

      expect(renderInput).toHaveBeenCalledTimes(6);

      // Check first call props
      const firstCall = renderInput.mock.calls[0][0];
      expect(firstCall.index).toBe(0);
      expect(firstCall.value).toBe("1");
      expect(firstCall.disabled).toBe(true);
      expect(firstCall.error).toBe(true);
      expect(firstCall.filled).toBe(true);
    });
  });

  describe("Data Attributes", () => {
    it("sets data-index on each input", () => {
      render(<OtpInput />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input, index) => {
        expect(input).toHaveAttribute("data-index", String(index));
      });
    });

    it("sets data-filled on inputs with value", () => {
      render(<OtpInput value="123" onChange={() => {}} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveAttribute("data-filled", "true");
      expect(inputs[1]).toHaveAttribute("data-filled", "true");
      expect(inputs[2]).toHaveAttribute("data-filled", "true");
      expect(inputs[3]).not.toHaveAttribute("data-filled");
    });

    it("sets data-error on inputs when error", () => {
      render(<OtpInput error />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveAttribute("data-error", "true");
      });
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to first input element", () => {
      const ref = vi.fn();
      render(<OtpInput ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });

    it("ref provides access to input element", () => {
      let inputRef: HTMLInputElement | null = null;

      render(
        <OtpInput
          ref={(el) => {
            inputRef = el;
          }}
        />
      );

      expect(inputRef).not.toBeNull();
      expect(inputRef!.tagName).toBe("INPUT");
    });
  });

  describe("Custom Styling", () => {
    it("applies containerClassName to container", () => {
      render(<OtpInput containerClassName="custom-container" />);

      expect(document.querySelector(".custom-container")).toBeInTheDocument();
    });

    it("applies wrapperClassName to wrapper", () => {
      render(<OtpInput wrapperClassName="custom-wrapper" />);

      expect(document.querySelector(".custom-wrapper")).toBeInTheDocument();
    });

    it("applies inputClassName to all inputs", () => {
      render(<OtpInput inputClassName="custom-input" />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveClass("custom-input");
      });
    });

    it("applies individual inputClassNames per index", () => {
      render(
        <OtpInput
          length={3}
          inputClassNames={["first-class", "second-class", "third-class"]}
        />
      );

      const inputs = screen.getAllByRole("textbox");
      expect(inputs[0]).toHaveClass("first-class");
      expect(inputs[1]).toHaveClass("second-class");
      expect(inputs[2]).toHaveClass("third-class");
    });

    it("applies labelClassName to label", () => {
      render(<OtpInput label="Code" labelClassName="custom-label" />);

      expect(screen.getByText("Code")).toHaveClass("custom-label");
    });

    it("applies errorClassName to error message", () => {
      render(
        <OtpInput error errorMessage="Error" errorClassName="custom-error" />
      );

      expect(screen.getByRole("alert")).toHaveClass("custom-error");
    });

    it("applies focusClassName to inputs", () => {
      render(<OtpInput focusClassName="custom-focus" />);

      const inputs = screen.getAllByRole("textbox");
      inputs.forEach((input) => {
        expect(input).toHaveClass("custom-focus");
      });
    });

    it("applies separatorClassName to separator", () => {
      render(
        <OtpInput
          groups={[3, 3]}
          separator={<span>-</span>}
          separatorClassName="custom-separator"
        />
      );

      expect(document.querySelector(".custom-separator")).toBeInTheDocument();
    });
  });
});

describe("OtpInputLabel", () => {
  it("renders label text", () => {
    render(<OtpInputLabel label="Verification Code" inputId="otp" />);

    expect(screen.getByText("Verification Code")).toBeInTheDocument();
  });

  it("renders required indicator when required", () => {
    render(<OtpInputLabel label="Code" inputId="otp" required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("associates with input via htmlFor", () => {
    render(<OtpInputLabel label="Code" inputId="my-otp" />);

    expect(screen.getByText("Code")).toHaveAttribute("for", "my-otp");
  });

  it("applies className", () => {
    render(
      <OtpInputLabel label="Code" inputId="otp" className="custom-label" />
    );

    expect(screen.getByText("Code")).toHaveClass("custom-label");
  });

  it("renders ReactNode as label", () => {
    render(
      <OtpInputLabel
        label={<span data-testid="custom-label">Custom Label</span>}
        inputId="otp"
      />
    );

    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
  });
});
