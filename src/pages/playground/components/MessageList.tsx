import { useEffect, useRef, type ReactNode } from "react";
import CodeCard from "./CodeCard";
import TaskPlanCard from "./TaskPlanCard";
import { parseAssistantText } from "./assistantText";
import type { PipelineTier } from "../types";

export interface ChatDisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  // Routed plans render as a TaskPlanCard instead of a chat bubble.
  kind?: "plan";
  tier?: PipelineTier | null;
  // A local preview URL for a screenshot attached to a user turn.
  imageUrl?: string;
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
          <div key={message.id} className="flex flex-col items-end gap-1.5">
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Attached screenshot"
                className="rule max-h-48 max-w-[85%] rounded-lg object-contain"
              />
            )}
            {message.content && (
              <p className="rule max-w-[85%] rounded-[12px_12px_4px_12px] border-border-faint bg-bg-elevated px-4 py-2.5 text-sm text-fg">
                {message.content}
              </p>
            )}
          </div>
        ) : message.kind === "plan" ? (
          <TaskPlanCard
            key={message.id}
            plan={message.content}
            streaming={message.streaming}
            tier={message.tier}
          />
        ) : (
          <AssistantMessage key={message.id} message={message} />
        )
      )}
      {footer}
    </div>
  );
}
