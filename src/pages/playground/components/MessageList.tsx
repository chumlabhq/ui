import { useEffect, useRef, type ReactNode } from "react";
import CodeCard from "./CodeCard";
import { parseAssistantText } from "./assistantText";

export interface ChatDisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

function AssistantMessage({ message }: { message: ChatDisplayMessage }) {
  const { plan, code, phase } = parseAssistantText(message.content);
  return (
    <div className="space-y-3">
      {plan && <p className="whitespace-pre-wrap text-sm text-fg-secondary">{plan}</p>}
      {message.streaming && phase === "planning" && !plan && (
        <p className="text-sm text-fg-tertiary">Planning...</p>
      )}
      {code && <CodeCard code={code} streaming={message.streaming && phase === "coding"} />}
    </div>
  );
}

interface MessageListProps {
  messages: ChatDisplayMessage[];
  footer?: ReactNode;
}

export default function MessageList({ messages, footer }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Direct scrollTop instead of scrollTo({behavior:"smooth"}) - the smooth
  // variant leaks scrolling to the page (same fix as AIPlaygroundSection).
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, footer]);

  return (
    <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto pr-1">
      {messages.length === 0 && (
        <p className="pt-10 text-center text-sm text-fg-tertiary">
          Describe a component to generate it with Chumlab primitives.
        </p>
      )}
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="flex justify-end">
            <p className="max-w-[85%] rounded-lg bg-bg-elevated px-4 py-2.5 text-sm text-fg">
              {message.content}
            </p>
          </div>
        ) : (
          <AssistantMessage key={message.id} message={message} />
        )
      )}
      {footer}
    </div>
  );
}
