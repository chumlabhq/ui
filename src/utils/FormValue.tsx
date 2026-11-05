import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { SR_ONLY_STYLE } from "./srOnlyStyle.js";

// eslint-disable-next-line react-refresh/only-export-components -- shipped as one chunk with FormValue: its own module grows the library 0.06 KB and a file for a dev-only refresh of a hook no demo page edits
export function useFormReset(
  ref: RefObject<HTMLElement | null>,
  onReset: (() => unknown) | undefined,
  form?: string,
) {
  useEffect(() => {
    const node = ref.current as HTMLInputElement | null;
    const owner = node?.form ?? node?.closest("form");
    if (!owner || !onReset) return;
    const handleReset = (event: Event) => {
      setTimeout(() => {
        if (!event.defaultPrevented) onReset();
      });
    };
    owner.addEventListener("reset", handleReset);
    return () => owner.removeEventListener("reset", handleReset);
  }, [ref, form, onReset]);
}

export interface FormValueProps {
  entries: ReadonlyArray<readonly [name: string, value: string]>;
  required?: boolean;
  disabled?: boolean;
  form?: string;
  missing?: boolean;
  onReset?: () => unknown;
  focusTarget?: RefObject<HTMLElement | null> | HTMLElement | null;
}

const noop = () => {};

export function FormValue({ entries, required, disabled, form, missing, onReset, focusTarget }: FormValueProps) {
  const ref = useRef<HTMLInputElement>(null);
  useFormReset(ref, onReset, form);

  const blocks = required && !disabled;
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let message = "";
    if (blocks && missing && node.value) {
      const probe = document.createElement("input");
      probe.required = true;
      message = probe.validationMessage;
    }
    node.setCustomValidity(message);
  });

  const inputs: ReadonlyArray<readonly [name: string | undefined, value: string]> = entries.length ? entries : [[undefined, ""]];

  return (
    <>
      {inputs.map(([name, value], index) => (
        <input
          key={index}
          ref={index ? undefined : ref}
          name={name}
          value={value}
          onChange={noop}
          onFocus={(event) => {
            const input = event.currentTarget;
            setTimeout(() => {
              const target = focusTarget && "current" in focusTarget ? focusTarget.current : focusTarget;
              if (target && target !== input && document.activeElement === input) target.focus();
            });
          }}
          required={!index && blocks ? true : undefined}
          disabled={disabled || undefined}
          form={form}
          tabIndex={-1}
          aria-hidden="true"
          style={SR_ONLY_STYLE}
        />
      ))}
    </>
  );
}

const EMPTY_STATUS_STYLE: CSSProperties = { position: "absolute", width: 0, height: 0 };

export function SuccessStatus({
  id,
  className,
  message,
  ...rest
}: {
  id?: string;
  className?: string;
  message: ReactNode;
  "data-slot"?: string;
}) {
  return (
    <div
      id={id}
      role="status"
      data-valid={message ? true : undefined}
      className={message ? className : undefined}
      style={message ? undefined : EMPTY_STATUS_STYLE}
      {...rest}
    >
      {message || null}
    </div>
  );
}
