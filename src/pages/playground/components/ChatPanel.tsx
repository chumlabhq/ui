import type { ReactNode } from "react";
import MessageList, { type ChatDisplayMessage } from "./MessageList";
import PromptInput from "./PromptInput";
import type { AttachedImage } from "../types";

interface ChatPanelProps {
  messages: ChatDisplayMessage[];
  onSubmit: (prompt: string, image: AttachedImage | null) => void;
  disabled?: boolean;
  notice?: ReactNode;
  verifyIndicator?: ReactNode;
}

export default function ChatPanel({
  messages,
  onSubmit,
  disabled = false,
  notice,
  verifyIndicator,
}: ChatPanelProps) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col gap-4">
      {/* the conversation, its own surface */}
      <div className="rule flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border-border-soft bg-bg-elevated px-4 py-3">
        <MessageList messages={messages} footer={verifyIndicator} />
      </div>
      {notice}
      <PromptInput onSubmit={onSubmit} disabled={disabled} />
    </div>
  );
}
