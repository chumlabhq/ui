import {
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { ACCEPTED_IMAGE_TYPES, fileToAttachedImage } from "../lib/image";
import type { AttachedImage } from "../types";

interface PromptInputProps {
  onSubmit: (prompt: string, image: AttachedImage | null) => void;
  disabled?: boolean;
  // The agents are working — the send control becomes an AI-working indicator.
  busy?: boolean;
}

const PAPERCLIP = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z"
      clipRule="evenodd"
    />
  </svg>
);

const PAPER_PLANE = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const SPARKLES = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PromptInput({ onSubmit, disabled = false, busy = false }: PromptInputProps) {
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

  const canSend = (!!value.trim() || !!image) && !disabled;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      className="relative shrink-0 px-[18px] pb-[18px] pt-3"
    >
      {/* thread fades into the composer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[18px] -top-9 h-9 bg-gradient-to-t from-bg-base to-transparent"
      />

      {/* clean composer: page background, crisp border, quiet accent on focus */}
      <div className="pg-composer shadow-[0_10px_34px_-20px_rgba(0,0,0,0.85)]" data-drag={dragOver}>
        <div className="p-3">
          {image && (
            <div className="mb-2 flex items-center gap-2 px-1">
              <div className="relative">
                <img
                  src={image.previewUrl}
                  alt="Attached screenshot"
                  className="rule h-12 w-12 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  aria-label="Remove image"
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bg-overlay text-xs text-fg-tertiary hover:text-fg"
                >
                  ×
                </button>
              </div>
              <span className="text-xs text-fg-tertiary">Screenshot attached</span>
            </div>
          )}
          {imageError && <p className="mb-2 px-1 text-xs text-danger">{imageError}</p>}

          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            rows={2}
            placeholder={
              image
                ? "Describe changes, or just build to rebuild the screenshot…"
                : "Describe a component, or drop a screenshot…"
            }
            disabled={disabled}
            className="min-h-[3rem] w-full resize-none bg-transparent px-1 pb-2.5 pt-0.5 text-[13.5px] leading-relaxed text-fg outline-none placeholder:text-fg-tertiary disabled:opacity-60"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              aria-label="Attach screenshot"
              className="grid h-[30px] w-[30px] place-items-center rounded-lg border border-border-faint bg-fg/[0.06] text-fg-secondary transition-colors hover:bg-fg/[0.1] hover:text-fg disabled:opacity-50 [&_svg]:h-[16px] [&_svg]:w-[16px]"
            >
              {PAPERCLIP}
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
            <span className="flex-1" />

            {busy ? (
              // AI working: the sparkles themselves spin (the icon animates, not
              // a background).
              <span
                role="status"
                aria-label="Building"
                className="grid h-[32px] w-[32px] place-items-center rounded-lg bg-accent/15"
              >
                <span
                  className="h-[18px] w-[18px] animate-spin text-accent motion-reduce:animate-none"
                  style={{ animationDuration: "2.2s" }}
                >
                  {SPARKLES}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                aria-label="Send"
                className="grid h-[32px] w-[32px] place-items-center rounded-lg bg-accent text-white shadow-[0_4px_14px_-4px_var(--accent-glow)] transition hover:brightness-110 disabled:opacity-40 [&_svg]:h-[16px] [&_svg]:w-[16px]"
              >
                {PAPER_PLANE}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
