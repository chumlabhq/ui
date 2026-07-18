import type { ReactNode } from "react";
import MessageList, { type ChatDisplayMessage } from "./MessageList";
import PromptInput from "./PromptInput";
import type { AttachedImage } from "../types";

interface ChatPanelProps {
  messages: ChatDisplayMessage[];
  onSubmit: (prompt: string, image: AttachedImage | null) => void;
  disabled?: boolean;
  busy?: boolean;
  notice?: ReactNode;
  verifyIndicator?: ReactNode;
  emptyState?: ReactNode;
}

// A flat conversation column (v7): the thread scrolls, the composer sits at the
// bottom over a soft fade. No inner card — the shell provides the surface.
export default function ChatPanel({
  messages,
  onSubmit,
  disabled = false,
  busy = false,
  notice,
  verifyIndicator,
  emptyState,
}: ChatPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <MessageList messages={messages} footer={verifyIndicator} emptyState={emptyState} />
      {notice && <div className="px-[18px]">{notice}</div>}
      <PromptInput onSubmit={onSubmit} disabled={disabled} busy={busy} />
    </div>
  );
}
