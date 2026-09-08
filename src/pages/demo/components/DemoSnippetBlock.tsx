import { useState, type FC } from "react";
import { DEMO_SNIPPETS } from "../generated/demoSnippets.js";
import { preClass, scrollableCode } from "./codeBlock.js";
import { NextIcon, ReactIcon } from "./Icons.js";

/**
 * The copy-paste block for one rendered demo, keyed by the section's own title.
 *
 * Every example on the page gets one, not just Basic Usage. A copy button on
 * the first demo and none on the other nine reads as "the rest are not
 * available", which was never true — they were simply never extracted.
 *
 * Renders nothing when the section has no snippet. That is deliberate and it is
 * the honest outcome for a demo driven by page-level state or a handler defined
 * outside it: no button beats a snippet that will not run when pasted.
 */
export const DemoSnippetBlock: FC<{ component: string; title: string }> = ({ component, title }) => {
  const snippet = DEMO_SNIPPETS[component]?.[title];
  const [variant, setVariant] = useState<"react" | "next">("react");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  if (!snippet) return null;

  const code = snippet[variant];
  const copy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  const tab = (key: "react" | "next", label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setVariant(key)}
      aria-pressed={variant === key}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] transition-colors cursor-pointer ${
        variant === key
          ? "bg-bg-elevated text-fg border border-border-soft"
          : "text-fg-tertiary border border-transparent hover:text-fg-secondary"
      }`}
    >
      {key === "react" ? <ReactIcon /> : <NextIcon />}
      {label}
    </button>
  );

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="px-2.5 py-1 rounded-md border border-border-soft text-[12px] text-fg-secondary hover:border-border-active transition-colors cursor-pointer"
        >
          {open ? "Hide code" : "Show code"}
        </button>
        {open && (
          <>
            {tab("react", "React")}
            {tab("next", "Next.js")}
            <button
              type="button"
              onClick={copy}
              className="px-2.5 py-1 rounded-md border border-border-soft text-[12px] text-fg-secondary hover:border-border-active transition-colors cursor-pointer ml-auto"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </>
        )}
      </div>

      {open && (
        <pre className={`${preClass} mt-2`} {...scrollableCode}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
};
