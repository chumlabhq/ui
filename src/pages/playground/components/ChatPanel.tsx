import type { ReactNode } from "react";
import MessageList, { type ChatDisplayMessage } from "./MessageList";
import PromptInput from "./PromptInput";

interface ChatPanelProps {
  messages: ChatDisplayMessage[];
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
  notice?: ReactNode;
}

export default function ChatPanel({
  messages,
  onSubmit,
  disabled = false,
  notice,
}: ChatPanelProps) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col gap-4">
      <MessageList messages={messages} />
      {notice}
      <PromptInput onSubmit={onSubmit} disabled={disabled} />
    </div>
  );
}
