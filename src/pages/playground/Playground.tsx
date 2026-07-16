import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../redux/hooks";
import { useGetMeQuery } from "../../redux/api/authApi";
import {
  playgroundApi,
  useGetChatMessagesQuery,
  useListMyChatsQuery,
} from "../../redux/api/playgroundApi";
import ChatPanel from "./components/ChatPanel";
import PreviewFrame from "./components/PreviewFrame";
import VerifyIndicator, {
  type RenderGateStatus,
  type VerifyUIState,
} from "./components/VerifyIndicator";
import { parseAssistantText } from "./components/assistantText";
import type { ChatDisplayMessage } from "./components/MessageList";
import { useGenerationStream } from "./hooks/useGenerationStream";
import type {
  GenerationEventPayload,
  PipelineEvent,
  PlaygroundGateInfo,
  VerifyError,
  VerifyEventPayload,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function GateNotice({ gate }: { gate: PlaygroundGateInfo }) {
  if (gate.code === "not_invited") {
    return (
      <div className="rule rounded-lg bg-bg-elevated p-6">
        <p className="eyebrow">Invite only</p>
        <h2 className="mt-2 text-xl font-medium">
          You&apos;re on the <span className="serif-accent">waitlist.</span>
        </h2>
        <p className="mt-3 text-sm text-fg-secondary">
          {gate.position != null
            ? `Position #${gate.position} · estimated wait ${gate.estimatedWait}. `
            : "Sign up from the homepage to join the waitlist. "}
          We invite in rolling batches and will email you.
        </p>
      </div>
    );
  }

  return (
    <div className="rule rounded-lg bg-bg-elevated p-6">
      <p className="eyebrow">Daily limit</p>
      <h2 className="mt-2 text-xl font-medium">
        You&apos;ve used today&apos;s <span className="serif-accent">generations.</span>
      </h2>
      <p className="mt-3 text-sm text-fg-secondary">
        {gate.limit != null && `All ${gate.limit} runs are spent. `}
        {gate.resetsAt && `Your quota resets at ${new Date(gate.resetsAt).toLocaleString()}.`}
      </p>
    </div>
  );
}

function SignInCard() {
  const signIn = () => {
    const fallbackUrl = `${window.location.origin}/oauth/google`;
    window.location.href = `${API_BASE_URL}/auth/google/login?fallbackUrl=${encodeURIComponent(
      fallbackUrl
    )}&flow=playground`;
  };

  return (
    <div className="rule mx-auto mt-24 max-w-md rounded-lg bg-bg-elevated p-8 text-center">
      <p className="eyebrow">AI Playground</p>
      <h2 className="mt-3 text-2xl font-medium">
        Sign in to <span className="serif-accent">build.</span>
      </h2>
      <p className="mt-3 text-sm text-fg-secondary">
        The playground needs your Chumlab account to save chats and generations.
      </p>
      <Button variant="primary" size="md" className="mt-6" onClick={signIn}>
        Continue with Google
      </Button>
    </div>
  );
}

const messageKey = (role: string, content: string) => `${role}\u0000${content}`;

export default function Playground() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { data: meData, isError: meError, isLoading: meLoading } = useGetMeQuery();
  const authedUser = meError ? undefined : meData?.user;

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  // Turns created locally since the last server snapshot; deduped against
  // the refetched messages during render so nothing double-shows.
  const [pending, setPending] = useState<ChatDisplayMessage[]>([]);
  const [streamText, setStreamText] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [verifyState, setVerifyState] = useState<VerifyUIState | null>(null);
  const [renderGate, setRenderGate] = useState<RenderGateStatus>("idle");
  const streamRef = useRef("");
  const runIdRef = useRef<string | null>(null);
  // The just-delivered code may trigger one client-initiated render fix;
  // the server's per-run round budget is the real bound.
  const fixableRef = useRef(false);
  const fixModeRef = useRef(false);

  const onEvent = useCallback((event: PipelineEvent) => {
    runIdRef.current = event.runId;

    if (event.stage === "develop") {
      const payload = (event.payload ?? {}) as GenerationEventPayload;
      if (event.status === "start") {
        // Each fix round streams a full replacement file.
        streamRef.current = "";
        setStreamText("");
        if (payload.chatId) {
          setActiveChatId((current) => current ?? payload.chatId ?? null);
        }
      }
      if (event.status === "delta" && payload.text) {
        streamRef.current += payload.text;
        setStreamText(streamRef.current);
      }
      if (event.status === "error") {
        setStreamError(payload.message || "Generation failed");
      }
      return;
    }

    if (event.stage === "verify") {
      const payload = (event.payload ?? {}) as VerifyEventPayload;
      if (event.status === "start") {
        setVerifyState({ phase: "checking", round: payload.round ?? 0 });
      }
      if (event.status === "error" && payload.fixing) {
        setVerifyState({
          phase: "fixing",
          round: payload.round ?? 1,
          errors: payload.errors ?? [],
        });
      }
      if (event.status === "done") {
        setVerifyState(
          payload.pass
            ? {
                phase: "passed",
                rounds: payload.round ?? 0,
                typecheckUnavailable: payload.typecheckUnavailable,
              }
            : { phase: "warnings", errors: payload.errors ?? [] }
        );
      }
    }
  }, []);

  const onDone = useCallback(() => {
    const text = streamRef.current;
    streamRef.current = "";
    setStreamText("");
    if (text) {
      if (fixModeRef.current) {
        // The fix replaces the failing assistant turn, mirroring the backend.
        setPending((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].role === "assistant") {
              next[i] = { id: `assistant-${Date.now()}`, role: "assistant", content: text };
              return next;
            }
          }
          return [...next, { id: `assistant-${Date.now()}`, role: "assistant", content: text }];
        });
      } else {
        setPending((prev) => [
          ...prev,
          { id: `assistant-${Date.now()}`, role: "assistant", content: text },
        ]);
      }
      setRenderError(null);
      fixableRef.current = true;
      setRenderGate(parseAssistantText(text).code ? "running" : "idle");
    }
    fixModeRef.current = false;
    dispatch(playgroundApi.util.invalidateTags(["Chat"]));
  }, [dispatch]);

  const { status, error, gate, connect, disconnect } = useGenerationStream({ onEvent, onDone });
  const streaming = status === "connecting" || status === "streaming";

  const { data: chatsData } = useListMyChatsQuery(undefined, { skip: !authedUser });
  const { data: chatMessagesData } = useGetChatMessagesQuery(activeChatId ?? "", {
    skip: !authedUser || !activeChatId,
  });

  const messages = useMemo<ChatDisplayMessage[]>(() => {
    const server: ChatDisplayMessage[] = (chatMessagesData?.messages ?? []).map((m) => ({
      id: m._id,
      role: m.role,
      content: m.content,
    }));
    const seen = new Set(server.map((m) => messageKey(m.role, m.content)));
    const extras = pending.filter((m) => !seen.has(messageKey(m.role, m.content)));
    const base = [...server, ...extras];
    if (streaming) {
      base.push({ id: "streaming", role: "assistant", content: streamText, streaming: true });
    }
    return base;
  }, [chatMessagesData, pending, streaming, streamText]);

  const previewCode = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role !== "assistant" || message.streaming) continue;
      const { code } = parseAssistantText(message.content);
      if (code) return code;
    }
    return null;
  }, [messages]);

  const handleSubmit = (prompt: string) => {
    setPending((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", content: prompt }]);
    streamRef.current = "";
    fixableRef.current = false;
    fixModeRef.current = false;
    setStreamText("");
    setStreamError(null);
    setVerifyState(null);
    setRenderGate("idle");
    void connect(`${API_BASE_URL}/playground/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, chatId: activeChatId ?? undefined }),
    });
  };

  const handleRenderError = (err: VerifyError) => {
    setRenderError(err.message);
    setRenderGate("failed");
    const runId = runIdRef.current;
    // Auto-fix only the run that just delivered, and never re-enter a run
    // the server already delivered with warnings.
    if (!fixableRef.current || !runId || streaming) return;
    if (verifyState?.phase === "warnings") return;
    fixableRef.current = false;
    fixModeRef.current = true;
    setVerifyState({ phase: "fixing", round: 0, errors: [err] });
    void connect(`${API_BASE_URL}/playground/generate/fix`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, error: err }),
    });
  };

  const startNewChat = () => {
    disconnect();
    streamRef.current = "";
    fixableRef.current = false;
    fixModeRef.current = false;
    setActiveChatId(null);
    setPending([]);
    setStreamText("");
    setStreamError(null);
    setRenderError(null);
    setVerifyState(null);
    setRenderGate("idle");
  };

  const selectChat = (chatId: string) => {
    if (chatId === activeChatId) return;
    disconnect();
    streamRef.current = "";
    fixableRef.current = false;
    fixModeRef.current = false;
    setActiveChatId(chatId);
    setPending([]);
    setStreamText("");
    setStreamError(null);
    setRenderError(null);
    setVerifyState(null);
    setRenderGate("idle");
  };

  if (!meLoading && !authedUser) {
    return (
      <main className="min-h-screen bg-bg-base px-6 text-fg">
        <SignInCard />
      </main>
    );
  }

  const errorText = streamError ?? (gate ? null : error);

  return (
    <main className="h-screen bg-bg-base text-fg">
      <div className="mx-auto flex h-full max-w-7xl flex-col px-6 py-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="eyebrow">AI Playground</p>
            <h1 className="mt-1 text-2xl font-medium">
              Build with <span className="serif-accent">Chumlab.</span>
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={startNewChat}>
            New chat
          </Button>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 gap-6 lg:grid-cols-[200px_minmax(360px,9fr)_minmax(360px,11fr)]">
          <aside className="rule-r hidden min-h-0 flex-col gap-1 overflow-y-auto pr-4 lg:flex">
            {(chatsData?.chats ?? []).map((chat) => (
              <button
                key={chat._id}
                type="button"
                onClick={() => selectChat(chat._id)}
                className={`truncate rounded px-2 py-1.5 text-left text-sm transition-colors hover:text-fg ${
                  chat._id === activeChatId ? "bg-bg-elevated text-fg" : "text-fg-tertiary"
                }`}
              >
                {chat.title || "Untitled"}
              </button>
            ))}
          </aside>

          <ChatPanel
            messages={messages}
            onSubmit={handleSubmit}
            disabled={streaming || !!gate}
            verifyIndicator={
              verifyState ? <VerifyIndicator state={verifyState} renderGate={renderGate} /> : null
            }
            notice={
              gate ? (
                <GateNotice gate={gate} />
              ) : errorText ? (
                <p className="text-sm text-fg-secondary">Generation failed · {errorText}</p>
              ) : null
            }
          />

          <div className="flex min-h-72 min-w-0 flex-col gap-2 lg:min-h-0">
            <PreviewFrame
              code={previewCode}
              theme={theme}
              onRendered={() => {
                setRenderError(null);
                setRenderGate((current) => (current === "idle" ? current : "passed"));
              }}
              onRenderError={handleRenderError}
              className="rule min-h-0 w-full flex-1 rounded-lg"
            />
            <p className="text-xs text-fg-tertiary">
              {renderError
                ? `render error · ${renderError}`
                : previewCode
                  ? "live preview"
                  : "the preview renders here"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
