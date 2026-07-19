import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResizablePanel } from "../../components/ResizablePanel";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../redux/hooks";
import { useGetMeQuery } from "../../redux/api/authApi";
import {
  playgroundApi,
  useGetChatMessagesQuery,
  useGetMyPlaygroundOnboardingQuery,
  useGetPlaygroundSettingsQuery,
  useListChatRunsQuery,
  useListMyChatsQuery,
  useUpdatePlaygroundSettingsMutation,
} from "../../redux/api/playgroundApi";
import AppShell from "./components/shell/AppShell";
import Sidebar, { type PlaygroundView } from "./components/shell/Sidebar";
import ChatPanel from "./components/ChatPanel";
import ClarifyPicker from "./components/ClarifyPicker";
import ResponsiveProbe from "./components/ResponsiveProbe";
import AgentBreakdown from "./components/AgentBreakdown";
import EmptyState from "./components/EmptyState";
import StagePanel from "./components/StagePanel";
import SettingsView from "./views/SettingsView";
import type { RenderGateStatus, VerifyUIState } from "./components/VerifyIndicator";
import type { QaUIState } from "./components/QaIndicator";
import { parseAssistantText } from "./components/assistantText";
import type { ChatDisplayMessage } from "./components/MessageList";
import { useGenerationStream } from "./hooks/useGenerationStream";
import {
  agentRunFromEvents,
  agentRunFromTimeline,
  initialAgentRun,
} from "./lib/agents";
import { resolveGateLamps } from "./lib/gates";
import { friendlyError } from "./lib/friendlyError";
import { startAuth } from "./lib/enterPlayground";
import type { PreviewTheme } from "../../lib/preview/runtime";
import type {
  AttachedImage,
  ClarifyEventPayload,
  ClarifyQuestion,
  DeliverEventPayload,
  DeliverGates,
  GenerationEventPayload,
  PipelineEvent,
  PipelineTier,
  PlaygroundSettings,
  PreviewDevice,
  QaEventPayload,
  RouterEventPayload,
  VerifyError,
  VerifyEventPayload,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SCREENSHOT_ONLY_PROMPT = "Rebuild the attached screenshot as Chumlab components.";
const SPLIT_KEY = "pg_split";

function AuthSplash({ message }: { message: string }) {
  return (
    <main className="pg-surface grid min-h-screen place-items-center bg-bg-base px-6 text-fg">
      <div className="text-center">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        <p className="text-sm text-fg-tertiary">{message}</p>
      </div>
    </main>
  );
}

function RequestAccessCard() {
  return (
    <main className="pg-surface grid min-h-screen place-items-center bg-bg-base px-6 text-fg">
      <div className="rule max-w-md rounded-2xl border-border-soft bg-bg-elevated p-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-fg-tertiary">Invite only</p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">The playground is in private beta</h2>
        <p className="mt-3 text-sm text-fg-secondary">
          Your account isn&apos;t on the access list yet. We invite in rolling batches — you&apos;ll get an email
          the moment your seat opens up.
        </p>
      </div>
    </main>
  );
}

const messageKey = (role: string, content: string) => `${role} ${content}`;

export default function Playground() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { data: meData, isError: meError, isLoading: meLoading } = useGetMeQuery();
  const authedUser = meError ? undefined : meData?.user;

  const [view, setView] = useState<PlaygroundView>("build");
  // The open chat is route-based (/playground/:chatId) so a refresh restores it.
  // `activeChatId` stays the working source of truth; the two effects below keep
  // it and the URL in sync (guarded by equality, so no ping-pong).
  const navigate = useNavigate();
  const { chatId: routeChatId } = useParams<{ chatId?: string }>();
  const [activeChatId, setActiveChatId] = useState<string | null>(() => routeChatId ?? null);
  // URL → state, adjusted during render (React's alternative to a sync effect):
  // a direct visit / back-forward to a chat URL selects that chat.
  const [prevRouteChatId, setPrevRouteChatId] = useState(routeChatId);
  if (routeChatId !== prevRouteChatId) {
    setPrevRouteChatId(routeChatId);
    setActiveChatId(routeChatId ?? null);
  }
  const [pending, setPending] = useState<ChatDisplayMessage[]>([]);
  const [streamText, setStreamText] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [verifyState, setVerifyState] = useState<VerifyUIState | null>(null);
  // Render-gate status drives the auto-fix flow; the value itself is no longer
  // displayed (the stage cluster was removed), so only the setter is kept.
  const [renderGate, setRenderGate] = useState<RenderGateStatus>("idle");
  const [tier, setTier] = useState<PipelineTier | null>(null);
  const [planText, setPlanText] = useState("");
  const [planStreaming, setPlanStreaming] = useState(false);
  const [clarifyQuestions, setClarifyQuestions] = useState<ClarifyQuestion[] | null>(null);
  const [clarifyReason, setClarifyReason] = useState<string | null>(null);
  const [, setQaState] = useState<QaUIState | null>(null);
  // The stage's device + theme derive from saved settings, with a transient
  // override the toolbar sets for the current session (device is a view control,
  // not a persisted default). Deriving avoids seeding state from an effect.
  const [themeOverride, setThemeOverride] = useState<PreviewTheme | null>(null);
  const [deviceOverride, setDeviceOverride] = useState<PreviewDevice | null>(null);
  const [liveActive, setLiveActive] = useState(false);
  const [deliverMeta, setDeliverMeta] = useState<{
    sizeKb: number | null;
    a11y: string | null;
    gates: DeliverGates | null;
  }>({ sizeKb: null, a11y: null, gates: null });
  const [elapsedLabel, setElapsedLabel] = useState<string | null>(null);
  // Fixed 50/50 chat|preview split — the divider persists across reloads. The
  // preview panel is always present; it goes idle → building → result in place.
  const [splitWidth, setSplitWidth] = useState(() => Number(localStorage.getItem(SPLIT_KEY)) || 620);

  const streamRef = useRef("");
  const planRef = useRef("");
  const runIdRef = useRef<string | null>(null);
  const fixableRef = useRef(false);
  const fixModeRef = useRef(false);
  const failedRef = useRef(false);
  const runStartRef = useRef<number | null>(null);

  // State → URL: reflect the open chat in the address bar (replace, so switching
  // chats doesn't pile up history). Runs only when they diverge.
  useEffect(() => {
    if ((routeChatId ?? null) === activeChatId) return;
    navigate(activeChatId ? `/playground/${activeChatId}` : "/playground", { replace: true });
  }, [activeChatId, routeChatId, navigate]);

  const onEvent = useCallback((event: PipelineEvent) => {
    runIdRef.current = event.runId;

    if (event.stage === "router") {
      const payload = (event.payload ?? {}) as RouterEventPayload;
      if (event.status === "done") {
        setTier(payload.tier ?? null);
        // Decline (Phase 12): the Router refused. Show the refusal as an
        // assistant turn and stop — no build, no breakdown.
        if (payload.outcome === "decline" && payload.message) {
          setPending((prev) => [
            ...prev,
            {
              id: `decline-${Date.now()}`,
              role: "assistant",
              content: payload.message ?? "",
              createdAt: new Date().toISOString(),
            },
          ]);
          setLiveActive(false);
        }
        // Refine no-op / question (feature/refine-intent): the follow-up needed
        // no rebuild — the intent guard answered in-chat. Same terminal
        // assistant turn as decline, no build, no breakdown.
        if (payload.outcome === "answer" && payload.message) {
          setPending((prev) => [
            ...prev,
            {
              id: `answer-${Date.now()}`,
              role: "assistant",
              content: payload.message ?? "",
              createdAt: new Date().toISOString(),
            },
          ]);
          setLiveActive(false);
        }
      }
      return;
    }

    if (event.stage === "clarify") {
      const payload = (event.payload ?? {}) as ClarifyEventPayload;
      if (event.status === "needs_input") {
        setClarifyQuestions(payload.questions ?? []);
        setClarifyReason(payload.reason ?? null);
      }
      return;
    }

    if (event.stage === "deliver") {
      if (event.status === "done") {
        const payload = (event.payload ?? {}) as DeliverEventPayload;
        setDeliverMeta({
          sizeKb: payload.sizeKb ?? null,
          a11y: payload.a11y ?? null,
          gates: payload.gates ?? null,
        });
      }
      return;
    }

    if (event.stage === "qa") {
      const payload = (event.payload ?? {}) as QaEventPayload;
      if (event.status === "start") setQaState({ phase: "reviewing" });
      if (event.status === "error" && payload.fixing) {
        setQaState({ phase: "fixing", findings: payload.findings ?? [] });
      }
      if (event.status === "done") {
        setQaState(
          payload.pass
            ? { phase: "passed", fixed: payload.fixed ?? false }
            : { phase: "warnings", findings: payload.findings ?? [] }
        );
      }
      return;
    }

    if (event.stage === "plan") {
      const payload = (event.payload ?? {}) as GenerationEventPayload;
      if (event.status === "start") {
        planRef.current = "";
        setPlanText("");
        setPlanStreaming(true);
      }
      if (event.status === "delta" && payload.text) {
        planRef.current += payload.text;
        setPlanText(planRef.current);
      }
      if (event.status === "done") setPlanStreaming(false);
      return;
    }

    if (event.stage === "develop") {
      const payload = (event.payload ?? {}) as GenerationEventPayload;
      if (event.status === "start") {
        streamRef.current = "";
        setStreamText("");
        if (payload.chatId) setActiveChatId((current) => current ?? payload.chatId ?? null);
      }
      if (event.status === "delta" && payload.text) {
        streamRef.current += payload.text;
        setStreamText(streamRef.current);
      }
      if (event.status === "error") {
        failedRef.current = true;
        setStreamError(payload.message || "Generation failed");
      }
      return;
    }

    if (event.stage === "verify") {
      const payload = (event.payload ?? {}) as VerifyEventPayload;
      if (event.status === "start") setVerifyState({ phase: "checking", round: payload.round ?? 0 });
      if (event.status === "error" && payload.fixing) {
        setVerifyState({ phase: "fixing", round: payload.round ?? 1, errors: payload.errors ?? [] });
      }
      if (event.status === "done") {
        setVerifyState(
          payload.pass
            ? { phase: "passed", rounds: payload.round ?? 0, typecheckUnavailable: payload.typecheckUnavailable }
            : { phase: "warnings", errors: payload.errors ?? [] }
        );
      }
    }
  }, []);

  const onDone = useCallback(() => {
    const text = streamRef.current;
    streamRef.current = "";
    setStreamText("");
    if (runStartRef.current) {
      setElapsedLabel(`${((Date.now() - runStartRef.current) / 1000).toFixed(1)}s`);
    }
    if (failedRef.current) {
      fixModeRef.current = false;
      dispatch(playgroundApi.util.invalidateTags(["Chat"]));
      return;
    }
    if (text) {
      if (fixModeRef.current) {
        setPending((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].role === "assistant") {
              next[i] = { id: `assistant-${Date.now()}`, role: "assistant", content: text, createdAt: new Date().toISOString() };
              return next;
            }
          }
          return [...next, { id: `assistant-${Date.now()}`, role: "assistant", content: text, createdAt: new Date().toISOString() }];
        });
      } else {
        setPending((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", content: text, createdAt: new Date().toISOString() }]);
      }
      setRenderError(null);
      fixableRef.current = true;
      setRenderGate(parseAssistantText(text).code ? "running" : "idle");
    }
    fixModeRef.current = false;
    dispatch(playgroundApi.util.invalidateTags(["Chat"]));
  }, [dispatch]);

  const { status, events, error, gate, connect, disconnect } = useGenerationStream({ onEvent, onDone });
  const streaming = status === "connecting" || status === "streaming";

  const { data: chatsData } = useListMyChatsQuery({ limit: 30 }, { skip: !authedUser });
  // currentData (not data): data for the CURRENT chatId only, so switching to a
  // new/empty chat doesn't briefly keep the previous chat's messages/run.
  const { currentData: chatMessagesData, isFetching: messagesFetching } = useGetChatMessagesQuery(
    activeChatId ?? "",
    { skip: !authedUser || !activeChatId }
  );
  const { currentData: runsData } = useListChatRunsQuery(activeChatId ?? "", {
    skip: !authedUser || !activeChatId,
  });
  const { data: settingsData } = useGetPlaygroundSettingsQuery(undefined, { skip: !authedUser });
  const [patchSettings, { isLoading: savingSettings }] = useUpdatePlaygroundSettingsMutation();
  const { data: onboardingData, isLoading: onbLoading } = useGetMyPlaygroundOnboardingQuery(undefined, {
    skip: !authedUser,
  });

  const settings: PlaygroundSettings = settingsData?.settings ?? { previewTheme: "light", previewDevice: "fill" };
  // The server owns the gate (open by default; invite-only via env). Fall back to
  // the onboarding status only for an older server that doesn't send `access`.
  const allowed =
    onboardingData?.access ??
    (!!onboardingData?.onboarding &&
      ["invited", "onboarded"].includes(onboardingData.onboarding.status ?? ""));

  const settingsTheme: PreviewTheme = settings.previewTheme === "system" ? theme : settings.previewTheme;
  const previewTheme = themeOverride ?? settingsTheme;
  const device = deviceOverride ?? settings.previewDevice;

  // Auth guard: a direct, never-authenticated visit kicks off sign-in and comes
  // back here; but logging out while on the playground (was authed, now isn't)
  // sends the user home rather than straight back into the sign-in flow.
  const wasAuthedRef = useRef(false);
  useEffect(() => {
    if (authedUser) {
      wasAuthedRef.current = true;
      return;
    }
    if (meLoading) return;
    if (wasAuthedRef.current) navigate("/");
    else startAuth("/playground");
  }, [meLoading, authedUser, navigate]);

  const messages = useMemo<ChatDisplayMessage[]>(() => {
    const server: ChatDisplayMessage[] = (chatMessagesData?.messages ?? []).map((m) => ({
      id: m._id,
      role: m.role,
      content: m.content,
      imageUrl: m.image ? `data:${m.image.mediaType};base64,${m.image.data}` : undefined,
      createdAt: m.createdAt,
    }));
    const seen = new Set(server.map((m) => messageKey(m.role, m.content)));
    const extras = pending.filter((m) => !seen.has(messageKey(m.role, m.content)));
    const base = [...server, ...extras];
    if (planText) {
      base.push({ id: "plan", role: "assistant", kind: "plan", content: planText, streaming: planStreaming, tier });
    }
    if (streaming && (streamText || !planStreaming)) {
      base.push({ id: "streaming", role: "assistant", content: streamText, streaming: true });
    }
    return base;
  }, [chatMessagesData, pending, streaming, streamText, planText, planStreaming, tier]);

  const previewCode = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role !== "assistant" || message.streaming) continue;
      const { code } = parseAssistantText(message.content);
      if (code) return code;
    }
    return null;
  }, [messages]);

  const latestRun = runsData?.runs?.[0];

  // Live breakdown from the stream; a re-opened chat rehydrates from its saved
  // timeline (no re-run). Falls back to the resting 4-agent panel.
  const liveAgentRun = useMemo(() => agentRunFromEvents(events), [events]);
  const rehydratedAgentRun = useMemo(
    () =>
      latestRun?.timeline
        ? agentRunFromTimeline(
            latestRun.timeline,
            latestRun.deliver?.gates ?? null,
            latestRun.sizeKb ?? null,
            latestRun.a11y ?? null
          )
        : null,
    [latestRun]
  );
  const agentRun = liveActive ? liveAgentRun : rehydratedAgentRun ?? initialAgentRun();
  const showBreakdown = liveActive || !!rehydratedAgentRun;

  // Six-lamp gate state for the preview strip. The live SSE stream + client
  // renderGate drive it during a build; on a re-opened/completed run the stored
  // deliver.gates backfills the lamps so they show final states, not pending.
  const gateLamps = useMemo(() => {
    const deliverGates = liveActive ? deliverMeta.gates : latestRun?.deliver?.gates ?? null;
    if (!liveActive && !previewCode && !deliverGates) return null;
    return resolveGateLamps(events, renderGate, deliverGates);
  }, [liveActive, deliverMeta.gates, latestRun, previewCode, events, renderGate]);

  const rehydratedElapsed = useMemo(() => {
    if (liveActive || !latestRun?.timeline) return null;
    const total = latestRun.timeline.reduce((sum, t) => sum + (t.durationMs || 0), 0);
    return total ? `${(total / 1000).toFixed(1)}s` : null;
  }, [liveActive, latestRun]);

  const resetRun = () => {
    streamRef.current = "";
    planRef.current = "";
    fixableRef.current = false;
    fixModeRef.current = false;
    failedRef.current = false;
    setStreamText("");
    setStreamError(null);
    setRenderError(null);
    setVerifyState(null);
    setRenderGate("idle");
    setTier(null);
    setPlanText("");
    setPlanStreaming(false);
    setClarifyQuestions(null);
    setClarifyReason(null);
    setQaState(null);
    setElapsedLabel(null);
    setDeliverMeta({ sizeKb: null, a11y: null, gates: null });
  };

  const handleSubmit = (prompt: string, image: AttachedImage | null) => {
    const displayContent = prompt || (image ? SCREENSHOT_ONLY_PROMPT : "");
    setPending((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: displayContent,
        imageUrl: image?.previewUrl,
        createdAt: new Date().toISOString(),
      },
    ]);
    resetRun();
    setLiveActive(true);
    runStartRef.current = Date.now();
    void connect(`${API_BASE_URL}/playground/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        chatId: activeChatId ?? undefined,
        image: image ? { mediaType: image.mediaType, data: image.data } : undefined,
      }),
    });
  };

  const handleClarifyResume = (answers: (string | undefined)[]) => {
    const runId = runIdRef.current;
    if (!runId) return;
    // Page-scope pick: the chosen component IS the request, echoed as-is. An
    // ordinary clarify echoes the answered questions.
    const answered = clarifyQuestions?.map((q, i) => `${q.question} ${answers[i]}`).filter((_, i) => answers[i]);
    const content = clarifyReason
      ? // Router-driven pick: echo the chosen option (or the "build anyway" escape).
        (answers.find((a) => a) ?? "Build your best guess anyway")
      : answered?.length
        ? `Clarifications — ${answered.join(" · ")}`
        : "Skipped clarifications — building with sensible defaults.";
    setPending((prev) => [
      ...prev,
      {
        id: `clarify-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    setClarifyQuestions(null);
    setClarifyReason(null);
    setQaState(null);
    streamRef.current = "";
    failedRef.current = false;
    setStreamText("");
    // The resume IS the live build — keep the agent breakdown showing.
    setLiveActive(true);
    runStartRef.current = Date.now();
    void connect(`${API_BASE_URL}/playground/generate/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, answers: answers.map((a) => a ?? null) }),
    });
  };

  const handleRenderError = (err: VerifyError) => {
    setRenderError(err.message);
    setRenderGate("failed");
    const runId = runIdRef.current;
    if (!fixableRef.current || !runId || streaming) return;
    if (verifyState?.phase === "warnings") return;
    fixableRef.current = false;
    fixModeRef.current = true;
    failedRef.current = false;
    setVerifyState({ phase: "fixing", round: 0, errors: [err] });
    void connect(`${API_BASE_URL}/playground/generate/fix`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, error: err }),
    });
  };

  const handleRendered = () => {
    setRenderError(null);
    setRenderGate((current) => (current === "idle" ? current : "passed"));
  };

  const startNewChat = () => {
    disconnect();
    setActiveChatId(null);
    setPending([]);
    setLiveActive(false);
    resetRun();
    setView("build");
  };

  const selectChat = (chatId: string) => {
    disconnect();
    setActiveChatId(chatId);
    setPending([]);
    setLiveActive(false);
    resetRun();
    setView("build");
  };

  const changeSettings = (patch: Partial<PlaygroundSettings>) => {
    if (patch.previewDevice) setDeviceOverride(patch.previewDevice);
    if (patch.previewTheme) setThemeOverride(patch.previewTheme === "system" ? theme : patch.previewTheme);
    void patchSettings(patch);
  };

  // ---- Track C guard ----
  if (meLoading) return <AuthSplash message="Loading the playground…" />;
  if (!authedUser) return <AuthSplash message="Taking you to sign-in…" />;
  if (onbLoading) return <AuthSplash message="Loading the playground…" />;
  if (!allowed) return <RequestAccessCard />;

  const chats = chatsData?.chats ?? [];
  const activeTitle =
    chats.find((c) => c._id === activeChatId)?.title ||
    (messages.find((m) => m.role === "user")?.content ?? "New build");
  const lastUserPrompt = [...messages].reverse().find((m) => m.role === "user")?.content ?? null;

  const friendly =
    gate?.code === "over_quota"
      ? gate.scope === "global"
        ? "The playground is at capacity for today. It resets at midnight UTC."
        : gate.scope === "burst"
          ? "You're sending builds too fast. Wait a moment and try again."
          : "You've reached today's generation limit. It resets at midnight UTC."
      : friendlyError(streamError ?? error);

  const clarifyNotice = clarifyQuestions ? (
    <ClarifyPicker
      questions={clarifyQuestions}
      reason={clarifyReason ?? undefined}
      onSubmit={handleClarifyResume}
      onSkip={() => handleClarifyResume(clarifyQuestions.map(() => undefined))}
    />
  ) : null;

  const threadFooter = (
    <>
      {clarifyNotice}
      {showBreakdown && <AgentBreakdown state={agentRun} elapsedLabel={elapsedLabel ?? rehydratedElapsed} />}
      {friendly && (
        <p className="rule mt-3 rounded-lg border-danger/30 bg-danger-bg px-4 py-3 text-sm text-fg-secondary">
          {friendly}
        </p>
      )}
    </>
  );

  // Re-opening a recent chat: its history/run are being fetched (currentData is
  // still empty for this id). Show skeletons instead of the empty-state hero.
  const chatLoading = !!activeChatId && !liveActive && messagesFetching && !chatMessagesData;

  const chatColumn = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="rule-b flex h-12 shrink-0 items-center gap-2.5 border-border-faint bg-bg-base px-[18px]">
        <span className="truncate font-display text-sm font-semibold tracking-tight">{activeTitle}</span>
        {lastUserPrompt && (
          <button
            type="button"
            onClick={() => handleSubmit(lastUserPrompt, null)}
            disabled={streaming}
            className="ml-auto flex items-center gap-1.5 rounded-[7px] border-[0.5px] border-border-faint px-2.5 py-1.5 text-[11.5px] text-fg-tertiary transition-colors hover:bg-fg/[0.045] hover:text-fg disabled:opacity-40 [&_svg]:h-[13px] [&_svg]:w-[13px]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Regenerate
          </button>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          <ChatPanel
            messages={messages}
            onSubmit={handleSubmit}
            disabled={streaming || !!gate || !!clarifyQuestions}
            busy={streaming}
            loading={chatLoading}
            verifyIndicator={threadFooter}
            emptyState={
              <EmptyState
                onExample={(prompt) => handleSubmit(prompt, null)}
                disabled={streaming || !!gate}
              />
            }
          />
        </div>
      </div>
    </div>
  );

  // The preview panel is always present and moves through idle → building →
  // result IN PLACE — the same framed surface, never blank, never a hero.
  const stagePane = (
    <StagePanel
      code={previewCode}
      previewTheme={previewTheme}
      onPreviewThemeChange={setThemeOverride}
      device={device}
      onDeviceChange={setDeviceOverride}
      onRendered={handleRendered}
      onRenderError={handleRenderError}
      gates={gateLamps}
      loading={chatLoading}
      statusText={
        renderError
          ? `Render error — ${renderError}`
          : streaming
            ? "Building your component…"
            : "Your component will appear here"
      }
    />
  );

  // Fixed 50/50 chat | preview: never reflows across idle/building/result. The
  // divider (desktop) is the resizable one; mobile stacks the two panels.
  const buildView = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="hidden min-h-0 flex-1 lg:flex">
        <ResizablePanel
          value={splitWidth}
          onValueChange={(v) => {
            setSplitWidth(v);
            localStorage.setItem(SPLIT_KEY, String(v));
          }}
          minValue={420}
          maxValue={980}
          resizeDirection="right"
          className="flex h-full min-h-0 flex-col"
          classes={{
            handle:
              "bg-transparent before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border-faint before:transition-colors hover:before:bg-accent/60",
          }}
        >
          {chatColumn}
        </ResizablePanel>
        <div className="min-h-0 min-w-0 flex-1">{stagePane}</div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        <div className="h-[42%] min-h-0 shrink-0">{stagePane}</div>
        <div className="rule-t flex min-h-0 flex-1 flex-col border-border-faint">{chatColumn}</div>
      </div>
    </div>
  );

  return (
    <AppShell
      sidebar={
        <Sidebar
          view={view}
          onSelectView={setView}
          onNew={startNewChat}
          activeChatId={activeChatId}
          onSelectChat={selectChat}
        />
      }
    >
      {view === "build" && buildView}
      {/* Render layer of the responsive gate — measures a fresh build offscreen
          at 360/1024 and routes overflow through the render-fix loop. */}
      {view === "build" && !streaming && previewCode && (
        <ResponsiveProbe code={previewCode} onFail={handleRenderError} />
      )}
      {view === "settings" && (
        <SettingsView settings={settings} onChange={changeSettings} saving={savingSettings} />
      )}
    </AppShell>
  );
}
