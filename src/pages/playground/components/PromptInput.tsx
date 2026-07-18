import {
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import PgButton from "./PgButton";
import { ACCEPTED_IMAGE_TYPES, fileToAttachedImage } from "../lib/image";
import type { AttachedImage } from "../types";

interface PromptInputProps {
  onSubmit: (prompt: string, image: AttachedImage | null) => void;
  disabled?: boolean;
}

export default function PromptInput({ onSubmit, disabled = false }: PromptInputProps) {
  const [value, setValue] = useState("");
  const [image, setImage] = useState<AttachedImage | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const attach = async (file: File | undefined) => {
    if (!file || !ACCEPTED_IMAGE_TYPES.includes(file.type)) return;
    setImageError(null);
    try {
      setImage(await fileToAttachedImage(file));
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Could not attach image");
    }
  };

  const submit = () => {
    const prompt = value.trim();
    if ((!prompt && !image) || disabled) return;
    setValue("");
    setImage(null);
    onSubmit(prompt, image);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const file = Array.from(event.clipboardData.items)
      .find((item) => item.type.startsWith("image/"))
      ?.getAsFile();
    if (file) {
      event.preventDefault();
      void attach(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    void attach(event.dataTransfer.files[0]);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      className={`rule shrink-0 rounded-xl border-border-soft bg-bg-elevated p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-colors ${
        dragOver ? "border-accent" : ""
      }`}
    >
      {image && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative">
            <img
              src={image.previewUrl}
              alt="Attached screenshot"
              className="rule h-14 w-14 rounded object-cover"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              aria-label="Remove image"
              className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bg-overlay text-xs text-fg-secondary hover:text-fg"
            >
              ×
            </button>
          </div>
          <span className="text-xs text-fg-tertiary">Screenshot attached</span>
        </div>
      )}
      {imageError && <p className="mb-2 text-xs text-danger">{imageError}</p>}

      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="Attach screenshot"
          className="pb-1 text-fg-tertiary transition-colors hover:text-fg disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={(e) => {
            void attach(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          rows={3}
          placeholder={
            image
              ? "Describe changes, or just Generate to rebuild the screenshot…"
              : "Describe a component to build, or drop / paste a screenshot…"
          }
          disabled={disabled}
          className="min-h-[4.5rem] flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-fg outline-none placeholder:text-fg-muted disabled:opacity-50"
        />
        <PgButton
          variant="primary"
          size="sm"
          onClick={submit}
          disabled={disabled || (!value.trim() && !image)}
        >
          Generate
        </PgButton>
      </div>
    </div>
  );
}
