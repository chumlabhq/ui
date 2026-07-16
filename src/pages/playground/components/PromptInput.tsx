import { useState, type KeyboardEvent } from "react";
import { Button } from "../../../components/ui";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}

export default function PromptInput({ onSubmit, disabled = false }: PromptInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const prompt = value.trim();
    if (!prompt || disabled) return;
    setValue("");
    onSubmit(prompt);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="rule flex items-end gap-3 rounded-lg bg-bg-elevated p-3">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        placeholder="A 6-digit OTP input with a Verify button..."
        disabled={disabled}
        className="min-h-[3rem] flex-1 resize-none bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted disabled:opacity-50"
      />
      <Button variant="primary" size="sm" onClick={submit} disabled={disabled || !value.trim()}>
        Generate
      </Button>
    </div>
  );
}
