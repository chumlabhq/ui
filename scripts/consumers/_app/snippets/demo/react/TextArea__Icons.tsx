import { useState } from "react";
import { TextArea } from "@chumlab/ui/textarea";

const FileIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

const SendIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const MessageIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function TextAreaExample() {
  const [lastAction, setLastAction] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                  <div className="space-y-1.5">
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>Start icon</span>
                    <TextArea
                      aria-label="With start icon"
                      placeholder="Write a message..."
                      startIcon={<MessageIcon className={"text-cl-text-tertiary"} />}
                      classes={({
        control: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
        input: `w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-disabled`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        message: "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>Clickable end icon</span>
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"} data-demo-action>
                      {lastAction}
                    </span>
                    <TextArea
                      aria-label="With send button"
                      placeholder="Type and send..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      endIcon={<SendIcon className={"text-cl-text-tertiary hover:text-cl-text-secondary"} />}
                      onEndIconClick={() => {
                        setLastAction(`Sent: ${message}`);
                        setMessage("");
                      }}
                      endIconLabel="Send message"
                      classes={({
        control: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
        input: `w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-disabled`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        message: "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>Clickable start icon</span>
                    <TextArea
                      aria-label="With attach button"
                      placeholder="Click the icon to attach..."
                      startIcon={<FileIcon className={"text-cl-text-tertiary hover:text-cl-text-secondary"} />}
                      onStartIconClick={() => setLastAction("Attach file clicked")}
                      startIconLabel="Attach file"
                      classes={({
        control: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
        input: `w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-disabled`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        message: "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                    />
                  </div>
                </div>
  );
}
