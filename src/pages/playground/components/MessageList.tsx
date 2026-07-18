import { useEffect, useRef, type ReactNode } from "react";
import { parseAssistantText } from "./assistantText";
import Markdown from "./Markdown";
import type { PipelineTier } from "../types";

export interface ChatDisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  // Plan turns are represented by the Router agent in the breakdown, not a
  // thread bubble — kept on the type so the stream reducer can still tag them.
  kind?: "plan";
  tier?: PipelineTier | null;
  imageUrl?: string;
  createdAt?: string;
}

// Today → time only (20:36); any earlier day → "19 Jul, 20:36".
function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) return time;
  const date = d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
  return `${date}, ${time}`;
}

function Stamp({ iso, align }: { iso?: string; align: "left" | "right" }) {
  if (!iso) return null;
  return (
    <span
      className={`px-1 font-mono text-[10px] text-fg-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${
        align === "right" ? "self-end" : "self-start"
      }`}
    >
      {formatTimestamp(iso)}
    </span>
  );
}

// User bubble — an extremely subtle flat accent tint with a clear accent-tinted
// border for demarcation (no gradient). Token-based so it tracks the theme.
const USER_BUBBLE_STYLE = {
  background: "color-mix(in srgb, var(--accent) 10%, var(--bg-elevated))",
  borderColor: "color-mix(in srgb, var(--accent) 34%, transparent)",
} as const;

function AssistantMessage({ message }: { message: ChatDisplayMessage }) {
  // No loose status text in the thread: streaming and build turns are carried by
  // the build card. Only a real prose answer (no code) becomes a bubble.
  if (message.streaming) return null;
  const { plan, code } = parseAssistantText(message.content);
  if (code) return null;
  const prose = plan.trim();
  if (!prose) return null;
  return (
    <div className="group flex flex-col items-start gap-1">
      <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-border-soft bg-bg-elevated px-4 py-2.5 shadow-[0_4px_18px_-12px_rgba(0,0,0,0.6)]">
        <Markdown>{prose}</Markdown>
      </div>
      <Stamp iso={message.createdAt} align="left" />
    </div>
  );
}

interface MessageListProps {
  messages: ChatDisplayMessage[];
  footer?: ReactNode;
  emptyState?: ReactNode;
  // A re-opened chat is being fetched — show skeletons, not the empty hero.
  loading?: boolean;
}

// Placeholder bubbles shown while a re-opened chat's history loads.
function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <div className="flex justify-end">
        <div className="pg-skeleton h-[52px] w-[62%] rounded-2xl rounded-br-md" />
      </div>
      <div className="pg-skeleton h-[168px] w-full rounded-2xl rounded-tl-md" />
      <div className="flex justify-end">
        <div className="pg-skeleton h-9 w-[38%] rounded-2xl rounded-br-md" />
      </div>
    </div>
  );
}

export default function MessageList({ messages, footer, emptyState, loading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Jump to the newest turn only when a message is actually added (or on first
  // mount) — deliberately NOT keyed on `footer`. `footer` (the live agent/verify
  // card) is a fresh element on every render, so auto-scrolling on it re-snapped
  // the thread to the bottom on every unrelated re-render and made it impossible
  // to scroll while a build was on screen. The card streams inside the thread;
  // it does not need to drag the scroll position with it.
  const prevCountRef = useRef(-1);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && messages.length !== prevCountRef.current) {
      prevCountRef.current = messages.length;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="pg-no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-[18px] pb-2 pt-5"
    >
      {loading && <ChatSkeleton />}
      {!loading && messages.length === 0 &&
        (emptyState ? (
          <div className="m-auto w-full">{emptyState}</div>
        ) : (
          <p className="m-auto max-w-xs text-center text-[13.5px] leading-relaxed text-fg-secondary">
            Describe a component to build it with Chumlab primitives.
          </p>
        ))}
      {messages.map((message) =>
        message.kind === "plan" ? null : message.role === "user" ? (
          <div key={message.id} className="group flex flex-col items-end gap-1">
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Attached screenshot"
                className="rule max-h-48 max-w-[85%] rounded-xl object-contain"
              />
            )}
            {message.content && (
              <div
                className="max-w-[85%] rounded-2xl rounded-br-md border px-4 py-2.5 text-[13.5px] leading-relaxed text-fg shadow-[0_4px_18px_-12px_rgba(0,0,0,0.6)]"
                style={USER_BUBBLE_STYLE}
              >
                {message.content}
              </div>
            )}
            <Stamp iso={message.createdAt} align="right" />
          </div>
        ) : (
          <AssistantMessage key={message.id} message={message} />
        )
      )}
      {footer}
    </div>
  );
}
