import { useEffect, useRef, useState } from "react";
import logoSmall from "../../assets/images/logo-small.png";

// ─── Token model for syntax-highlighted code streaming ─────────────────────

type TokenKind =
  | "kw"
  | "fn"
  | "str"
  | "tag"
  | "attr"
  | "plain"
  | "num"
  | "comment";
type Token = { k: TokenKind; t: string };

const K = (t: string): Token => ({ k: "kw", t });
const F = (t: string): Token => ({ k: "fn", t });
const S = (t: string): Token => ({ k: "str", t });
const T = (t: string): Token => ({ k: "tag", t });
const A = (t: string): Token => ({ k: "attr", t });
const P = (t: string): Token => ({ k: "plain", t });
const N = (t: string): Token => ({ k: "num", t });
const C = (t: string): Token => ({ k: "comment", t });

function tokenClass(k: TokenKind) {
  switch (k) {
    case "kw":
      return "text-pink-300";
    case "fn":
      return "text-blue-300";
    case "str":
      return "text-emerald-300";
    case "tag":
      return "text-white/45";
    case "attr":
      return "text-sky-300";
    case "num":
      return "text-amber-300";
    case "comment":
      return "text-white/25 italic";
    case "plain":
      return "text-white/80";
  }
}

function totalChars(tokens: Token[]) {
  let n = 0;
  for (const tok of tokens) n += tok.t.length;
  return n;
}

function renderTokens(tokens: Token[], upTo: number) {
  const els: React.ReactNode[] = [];
  let remaining = upTo;
  for (let i = 0; i < tokens.length; i++) {
    if (remaining <= 0) break;
    const tok = tokens[i];
    const take = Math.min(remaining, tok.t.length);
    els.push(
      <span key={i} className={tokenClass(tok.k)}>
        {tok.t.slice(0, take)}
      </span>,
    );
    remaining -= take;
  }
  return els;
}

// ─── Scene + plan definitions ──────────────────────────────────────────────

type PlanItem = { title: string; detail?: string };

type Scene = {
  id: string;
  prompt: string;
  attachment?: React.ReactNode;
  plan: PlanItem[];
  filename: string;
  code: Token[];
  preview: React.ReactNode;
};

const SCENES: Scene[] = [
  {
    id: "signin",
    prompt:
      "Build a sign-in form with email, password, remember-me, and social login.",
    plan: [
      { title: "Parse requirements from prompt", detail: "form · auth" },
      { title: "Import Input, Checkbox, Button", detail: "@chumlab/ui" },
      { title: "Compose email + password fields", detail: "Input ×2" },
      { title: "Add remember-me + forgot password row", detail: "Checkbox" },
      { title: "Wire Google + GitHub buttons", detail: "Button ×2" },
    ],
    filename: "SignInForm.tsx",
    code: [
      K("import"),
      P(" { "),
      F("Input"),
      P(", "),
      F("Checkbox"),
      P(", "),
      F("Button"),
      P(" } "),
      K("from"),
      P(" "),
      S('"@chumlab/ui"'),
      P(";\n\n"),
      K("export function"),
      P(" "),
      F("SignInForm"),
      P("() {\n  "),
      K("return"),
      P(" (\n    "),
      T("<form "),
      A("className"),
      P("="),
      S('"space-y-3"'),
      T(">"),
      P("\n      "),
      T("<Input "),
      A("label"),
      P("="),
      S('"Email"'),
      P(" "),
      A("type"),
      P("="),
      S('"email"'),
      T(" />"),
      P("\n      "),
      T("<Input "),
      A("label"),
      P("="),
      S('"Password"'),
      P(" "),
      A("type"),
      P("="),
      S('"password"'),
      T(" />"),
      P("\n      "),
      T("<Checkbox "),
      A("label"),
      P("="),
      S('"Remember me"'),
      T(" />"),
      P("\n      "),
      T("<Button "),
      A("type"),
      P("="),
      S('"submit"'),
      P(" "),
      A("className"),
      P("="),
      S('"w-full"'),
      T(">"),
      P("Sign in"),
      T("</Button>"),
      P("\n      "),
      T("<div "),
      A("className"),
      P("="),
      S('"grid grid-cols-2 gap-2"'),
      T(">"),
      P("\n        "),
      T("<Button "),
      A("variant"),
      P("="),
      S('"ghost"'),
      T(">"),
      P("Google"),
      T("</Button>"),
      P("\n        "),
      T("<Button "),
      A("variant"),
      P("="),
      S('"ghost"'),
      T(">"),
      P("GitHub"),
      T("</Button>"),
      P("\n      "),
      T("</div>"),
      P("\n    "),
      T("</form>"),
      P("\n  );\n}"),
    ],
    preview: <SignInPreview />,
  },
  {
    id: "schedule",
    prompt: "Recreate this meeting scheduler form from the screenshot.",
    attachment: <ScreenshotAttachment kind="schedule" />,
    plan: [
      { title: "Analyze uploaded screenshot", detail: "vision" },
      { title: "Detect form field regions + grid", detail: "6 regions" },
      { title: "Extract labels, hints, placeholder text", detail: "OCR" },
      {
        title: "Map fields to Chumlab primitives",
        detail: "DatePicker, TimePicker",
      },
      { title: "Generate production-ready markup", detail: "JSX" },
    ],
    filename: "ScheduleMeeting.tsx",
    code: [
      K("import"),
      P(" {\n  "),
      F("Input"),
      P(",\n  "),
      F("DatePicker"),
      P(",\n  "),
      F("TimePicker"),
      P(",\n  "),
      F("Dropdown"),
      P(",\n  "),
      F("TextArea"),
      P(",\n  "),
      F("Button"),
      P(",\n} "),
      K("from"),
      P(" "),
      S('"@chumlab/ui"'),
      P(";\n\n"),
      C("// Matched from schedule-meeting.png"),
      P("\n"),
      K("const"),
      P(" "),
      F("DURATIONS"),
      P(" = ["),
      S('"30 min"'),
      P(", "),
      S('"1 hour"'),
      P(", "),
      S('"2 hours"'),
      P("];\n\n"),
      K("export function"),
      P(" "),
      F("ScheduleMeeting"),
      P("() {\n  "),
      K("return"),
      P(" (\n    "),
      T("<form "),
      A("className"),
      P("="),
      S('"space-y-3"'),
      T(">"),
      P("\n      "),
      T("<Input "),
      A("label"),
      P("="),
      S('"Title"'),
      P(" "),
      A("placeholder"),
      P("="),
      S('"Product sync"'),
      T(" />"),
      P("\n      "),
      T("<div "),
      A("className"),
      P("="),
      S('"grid grid-cols-2 gap-2"'),
      T(">"),
      P("\n        "),
      T("<DatePicker "),
      A("label"),
      P("="),
      S('"Date"'),
      T(" />"),
      P("\n        "),
      T("<TimePicker "),
      A("label"),
      P("="),
      S('"Time"'),
      T(" />"),
      P("\n      "),
      T("</div>"),
      P("\n      "),
      T("<Dropdown "),
      A("label"),
      P("="),
      S('"Duration"'),
      P(" "),
      A("options"),
      P("="),
      P("{"),
      F("DURATIONS"),
      P("}"),
      T(" />"),
      P("\n      "),
      T("<TextArea "),
      A("label"),
      P("="),
      S('"Notes"'),
      P(" "),
      A("rows"),
      P("="),
      P("{"),
      N("3"),
      P("}"),
      T(" />"),
      P("\n      "),
      T("<Button "),
      A("type"),
      P("="),
      S('"submit"'),
      P(" "),
      A("className"),
      P("="),
      S('"w-full"'),
      T(">"),
      P("Schedule meeting"),
      T("</Button>"),
      P("\n    "),
      T("</form>"),
      P("\n  );\n}"),
    ],
    preview: <SchedulePreview />,
  },
  {
    id: "phone-otp",
    prompt:
      "Create a phone verification screen with country code input and 6-digit OTP.",
    plan: [
      { title: "Parse requirements from prompt", detail: "auth · otp" },
      {
        title: "Import InternationalPhoneInput + OTPInput",
        detail: "@chumlab/ui",
      },
      { title: "Compose phone-number field with country flag", detail: "flag" },
      { title: "Add 6-digit OTP with autofocus + paste", detail: "OTP ×6" },
      { title: "Wire verify button + resend link", detail: "Button" },
    ],
    filename: "VerifyPhone.tsx",
    code: [
      K("import"),
      P(" {\n  "),
      F("InternationalPhoneInput"),
      P(",\n  "),
      F("OTPInput"),
      P(",\n  "),
      F("Button"),
      P(",\n} "),
      K("from"),
      P(" "),
      S('"@chumlab/ui"'),
      P(";\n\n"),
      K("export function"),
      P(" "),
      F("VerifyPhone"),
      P("() {\n  "),
      K("return"),
      P(" (\n    "),
      T("<div "),
      A("className"),
      P("="),
      S('"space-y-4"'),
      T(">"),
      P("\n      "),
      T("<InternationalPhoneInput"),
      P("\n        "),
      A("label"),
      P("="),
      S('"Phone number"'),
      P("\n        "),
      A("defaultCountry"),
      P("="),
      S('"US"'),
      P("\n      "),
      T("/>"),
      P("\n      "),
      T("<OTPInput "),
      A("label"),
      P("="),
      S('"Verification code"'),
      P(" "),
      A("length"),
      P("="),
      P("{"),
      N("6"),
      P("}"),
      T(" />"),
      P("\n      "),
      T("<Button "),
      A("type"),
      P("="),
      S('"submit"'),
      P(" "),
      A("className"),
      P("="),
      S('"w-full"'),
      T(">"),
      P("Verify number"),
      T("</Button>"),
      P("\n    "),
      T("</div>"),
      P("\n  );\n}"),
    ],
    preview: <PhoneOtpPreview />,
  },
];

// ─── Phase state machine ───────────────────────────────────────────────────

type Phase =
  | "prompt-typing"
  | "prompt-sent"
  | "plan-executing"
  | "code-streaming"
  | "preview-building"
  | "preview-shown";

const PLAN_STEP_MS = 700;

export default function ConversationDemo() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const scene = SCENES[sceneIdx];

  const [phase, setPhase] = useState<Phase>("prompt-typing");
  const [promptChars, setPromptChars] = useState(0);
  const [planStep, setPlanStep] = useState(0);
  const [codeChars, setCodeChars] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const codeTotal = totalChars(scene.code);

  useEffect(() => {
    if (phase === "prompt-typing") {
      if (promptChars >= scene.prompt.length) {
        const t = setTimeout(() => setPhase("prompt-sent"), 500);
        return () => clearTimeout(t);
      }
      const tick = setTimeout(
        () => setPromptChars((n) => n + 1),
        24 + Math.random() * 28,
      );
      return () => clearTimeout(tick);
    }

    if (phase === "prompt-sent") {
      const t = setTimeout(() => setPhase("plan-executing"), 450);
      return () => clearTimeout(t);
    }

    if (phase === "plan-executing") {
      if (planStep >= scene.plan.length) {
        const t = setTimeout(() => setPhase("code-streaming"), 520);
        return () => clearTimeout(t);
      }
      const tick = setTimeout(() => setPlanStep((n) => n + 1), PLAN_STEP_MS);
      return () => clearTimeout(tick);
    }

    if (phase === "code-streaming") {
      if (codeChars >= codeTotal) {
        const t = setTimeout(() => setPhase("preview-building"), 450);
        return () => clearTimeout(t);
      }
      const chunk = 2 + Math.floor(Math.random() * 3);
      const tick = setTimeout(
        () => setCodeChars((n) => Math.min(codeTotal, n + chunk)),
        15,
      );
      return () => clearTimeout(tick);
    }

    if (phase === "preview-building") {
      const t = setTimeout(() => setPhase("preview-shown"), 900);
      return () => clearTimeout(t);
    }

    if (phase === "preview-shown") {
      const t = setTimeout(() => {
        setPromptChars(0);
        setPlanStep(0);
        setCodeChars(0);
        setPhase("prompt-typing");
        setSceneIdx((n) => (n + 1) % SCENES.length);
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [
    phase,
    promptChars,
    planStep,
    codeChars,
    scene.prompt.length,
    scene.plan.length,
    codeTotal,
  ]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [phase, planStep, codeChars]);

  const showUserBubble = phase !== "prompt-typing";
  const showPlan =
    phase === "plan-executing" ||
    phase === "code-streaming" ||
    phase === "preview-building" ||
    phase === "preview-shown";
  const showCode =
    phase === "code-streaming" ||
    phase === "preview-building" ||
    phase === "preview-shown";
  const showPreview =
    phase === "preview-building" || phase === "preview-shown";

  const statusLabel =
    phase === "prompt-typing"
      ? "Listening"
      : phase === "prompt-sent"
        ? "Got it"
        : phase === "plan-executing"
          ? "Planning"
          : phase === "code-streaming"
            ? "Coding"
            : phase === "preview-building"
              ? "Rendering"
              : "Ready";

  return (
    <div className="relative">
      <style>{`
        @keyframes cd-bubble-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes cd-slide-in {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cd-step-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cd-caret { 0%,49%{opacity:1}50%,100%{opacity:0} }
        @keyframes cd-shimmer-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(120%); }
        }
        @keyframes cd-pulse-ring {
          0%   { transform: scale(0.7); opacity: 0.9; }
          100% { transform: scale(2.0); opacity: 0; }
        }
        @keyframes cd-dot-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes cd-bar-progress {
          0%   { transform: translateX(-60%); }
          100% { transform: translateX(60%); }
        }
        @keyframes cd-preview-pop {
          0%   { opacity: 0; transform: translateY(10px) scale(0.96); filter: blur(4px); }
          60%  { opacity: 1; transform: translateY(0)    scale(1.015); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0)    scale(1);     filter: blur(0); }
        }
        @keyframes cd-scanline {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50%      { transform: translateY(100%);  opacity: 1; }
        }
        @keyframes cd-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        /* Sparkle icon rotates continuously while the AI is "generating" —
           replaces the previous pause/stop square so the send button keeps
           reading as an AI action even mid-work. */
        @keyframes cd-sparkle-spin {
          0%   { transform: rotate(0deg)   scale(1); }
          50%  { transform: rotate(180deg) scale(1.08); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .cd-bubble-in  { animation: cd-bubble-in 0.4s cubic-bezier(0.2,0.9,0.3,1) both; }
        .cd-slide-in   { animation: cd-slide-in 0.35s ease-out both; }
        .cd-step-in    { animation: cd-step-in 0.3s ease-out both; }
        .cd-caret      { animation: cd-caret 1s step-end infinite; }
        .cd-shimmer    { position: relative; overflow: hidden; }
        .cd-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent);
          animation: cd-shimmer-sweep 1.6s linear infinite;
        }
        .cd-bar-track { position: relative; overflow: hidden; }
        .cd-bar-track::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 45%;
          background: linear-gradient(90deg, transparent, rgba(129,140,248,0.75), transparent);
          animation: cd-bar-progress 1.3s ease-in-out infinite;
        }
        .cd-pulse-ring { animation: cd-pulse-ring 1.8s ease-out infinite; }
        .cd-dot-pulse  { animation: cd-dot-pulse 1.4s ease-in-out infinite; }
        .cd-preview-pop{ animation: cd-preview-pop 0.7s cubic-bezier(0.2,0.9,0.3,1) both; }
        .cd-scanline   { animation: cd-scanline 2.4s ease-in-out infinite; }
        .cd-blink      { animation: cd-blink 1s ease-in-out infinite; }
        .cd-sparkle-spin { animation: cd-sparkle-spin 1.6s linear infinite; transform-origin: 50% 50%; }
        .cd-traffic-icon { opacity: 0; transition: opacity 0.18s ease; }
        .cd-traffic:hover .cd-traffic-icon { opacity: 0.9; }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br from-blue-500/10 via-indigo-500/8 to-violet-500/10 blur-2xl"
      />

      <div className="relative flex flex-col h-[580px] rounded-2xl overflow-hidden border border-white/[0.07] bg-[#07070e] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <ChatHeader status={statusLabel} />

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3.5 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}
        >
          {/* Persistent greeting — lives outside the scene-keyed wrapper so
              it stays put as scenes rotate and the initial empty-chat state
              never feels blank. */}
          <AssistantBubble>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
              <p className="text-[13px] text-white/80 leading-relaxed">
                Hey, I’m{" "}
                <span className="font-semibold bg-gradient-to-r from-blue-200 via-indigo-100 to-violet-200 bg-clip-text text-transparent">
                  Chumlab AI
                </span>
                . Describe a screen or drop a screenshot, and I’ll ship
                production-ready React + Tailwind components built on Chumlab
                primitives.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-white/55">
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  Try: “Build a sign-in form”
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  Upload a screenshot
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  “Phone OTP verification”
                </span>
              </div>
            </div>
          </AssistantBubble>

          <div key={scene.id} className="space-y-3.5">
            {showUserBubble && (
              <UserBubble text={scene.prompt} attachment={scene.attachment} />
            )}

            {showPlan && (
              <AssistantBubble>
                <PlanCard
                  items={scene.plan}
                  currentStep={planStep}
                  done={phase !== "plan-executing"}
                />
              </AssistantBubble>
            )}

            {showCode && (
              <AssistantBubble>
                <CodeCard
                  filename={scene.filename}
                  tokens={scene.code}
                  upTo={codeChars}
                  streaming={phase === "code-streaming"}
                />
              </AssistantBubble>
            )}

            {showPreview && (
              <AssistantBubble>
                <PreviewCard
                  building={phase === "preview-building"}
                  idKey={scene.id}
                  filename={scene.filename}
                >
                  {scene.preview}
                </PreviewCard>
              </AssistantBubble>
            )}
          </div>
        </div>

        <Dock
          phase={phase}
          typed={scene.prompt.slice(0, promptChars)}
          sceneIdx={sceneIdx}
          total={SCENES.length}
        />
      </div>
    </div>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────

function ChatHeader({ status }: { status: string }) {
  return (
    <div className="relative flex items-center justify-between h-[52px] px-4 sm:px-5 border-b border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
      <div className="cd-traffic flex items-center gap-[7px]">
        <TrafficDot tone="close" />
        <TrafficDot tone="minimize" />
        <TrafficDot tone="maximize" />
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
        <div className="relative shrink-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/25 via-indigo-500/20 to-violet-500/25 border border-white/10 overflow-hidden p-[3px] flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.35)]">
            <img
              src={logoSmall}
              alt=""
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#07070e]" />
        </div>
        <span className="text-[12.5px] font-semibold text-white/90 tracking-tight">
          Chumlab AI
        </span>
        <span className="text-white/20 text-[11px]">·</span>
        <span className="inline-block min-w-[72px] text-left text-[11px] text-white/55 tabular-nums">
          {status}
        </span>
      </div>

      <div aria-hidden className="w-[34px] h-2" />
    </div>
  );
}

// ─── Bubbles ───────────────────────────────────────────────────────────────

function UserBubble({
  text,
  attachment,
}: {
  text: string;
  attachment?: React.ReactNode;
}) {
  return (
    <div className="cd-slide-in flex items-start gap-2 justify-end">
      <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-600/90 via-indigo-500/90 to-violet-600/90 shadow-[0_8px_24px_-10px_rgba(99,102,241,0.7)] border border-white/10 overflow-hidden">
        {attachment && (
          <div className="p-1.5 bg-black/10 border-b border-white/10">
            {attachment}
          </div>
        )}
        <div className="px-3.5 py-2.5 text-[13px] text-white leading-relaxed">
          {text}
        </div>
      </div>
      <UserAvatar />
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      aria-hidden
      className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-white/[0.1] to-white/[0.04] border border-white/[0.12] flex items-center justify-center mt-[2px]"
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white/65"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}

function AssistantBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="cd-bubble-in flex items-start gap-2">
      <div
        aria-hidden
        className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/25 via-indigo-500/20 to-violet-500/25 border border-white/10 overflow-hidden p-[3px] shadow-[0_0_12px_rgba(99,102,241,0.35)] mt-[2px]"
      >
        <img
          src={logoSmall}
          alt=""
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

// Solid-filled "image" icon — used for the dock attach affordance and the
// filename chip in the screenshot attachment. Filled variant reads as an
// action button rather than a line-drawing.
function ImageUploadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5ZM2.5 13.56V14.75c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-1.85l-1.94-1.94a1.25 1.25 0 0 0-1.77 0l-.29.29 1.09 1.09a.75.75 0 1 1-1.06 1.06l-3.86-3.86a1.25 1.25 0 0 0-1.76 0L2.5 13.56ZM7.5 8a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      />
    </svg>
  );
}

// macOS-style traffic-light window controls. Colored dots always visible,
// close/minimize/zoom icons fade in on hover of the dot cluster.
function TrafficDot({ tone }: { tone: "close" | "minimize" | "maximize" }) {
  const bg =
    tone === "close"
      ? "#ff5f57"
      : tone === "minimize"
        ? "#febc2e"
        : "#28c840";
  const iconColor =
    tone === "close"
      ? "#4d0000"
      : tone === "minimize"
        ? "#5e3800"
        : "#003800";
  return (
    <span
      aria-hidden
      className="relative w-3 h-3 rounded-full flex items-center justify-center border border-black/15"
      style={{ backgroundColor: bg }}
    >
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        className="cd-traffic-icon"
      >
        {tone === "close" && (
          <g
            stroke={iconColor}
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M1.7 1.7 L4.3 4.3" />
            <path d="M4.3 1.7 L1.7 4.3" />
          </g>
        )}
        {tone === "minimize" && (
          <path
            d="M1.4 3 L4.6 3"
            stroke={iconColor}
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {tone === "maximize" && (
          <g fill={iconColor}>
            <path d="M1.1 1.1 L3 1.1 L1.1 3 Z" />
            <path d="M4.9 4.9 L3 4.9 L4.9 3 Z" />
          </g>
        )}
      </svg>
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Screenshot attachment (user-uploaded reference) ───────────────────────

function ScreenshotAttachment({ kind }: { kind: "schedule" }) {
  const filename =
    kind === "schedule" ? "schedule-meeting.png" : "component.png";
  const size = kind === "schedule" ? "186 KB" : "128 KB";
  return (
    <div className="relative rounded-lg overflow-hidden border border-white/15 bg-[#0a0a13]">
      <div className="relative p-2.5 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1),transparent_70%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-indigo-300/20 to-transparent cd-scanline"
        />
        {kind === "schedule" ? <ScheduleThumbnail /> : null}
        <div className="absolute top-1.5 right-1.5 text-[8.5px] font-mono font-semibold bg-black/70 text-white/80 px-1.5 py-0.5 rounded border border-white/10">
          PNG
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-t border-white/10 bg-black/30 text-[10.5px] font-mono text-white/70">
        <span className="text-white/55 shrink-0">
          <ImageUploadIcon size={11} />
        </span>
        <span className="truncate flex-1 min-w-0 text-white/80">
          {filename}
        </span>
        <span className="text-white/40 shrink-0">{size}</span>
      </div>
    </div>
  );
}

// ─── Plan (Cursor-style todo list) ─────────────────────────────────────────

function PlanCard({
  items,
  currentStep,
  done,
}: {
  items: PlanItem[];
  currentStep: number;
  done: boolean;
}) {
  const completed = done ? items.length : Math.min(currentStep, items.length);
  const progress = (completed / items.length) * 100;

  return (
    <div className="rounded-xl rounded-tl-md border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.05]">
        <div className="inline-flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-4 h-4 rounded bg-indigo-500/15 border border-indigo-400/25">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-indigo-300"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 5.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1Zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1Zm-5 6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1Zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1Zm-5 6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1Zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1Z"
              />
            </svg>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
            Task Plan
          </span>
        </div>
        <div className="text-[10.5px] font-mono text-white/40 tabular-nums">
          {completed} / {items.length}
        </div>
      </div>

      <div className="relative h-0.5 bg-white/[0.03] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="px-3.5 py-2.5 space-y-1.5">
        {items.map((item, i) => {
          const isDone = done || i < currentStep;
          const isActive = !done && i === currentStep;
          return (
            <li
              key={i}
              className="cd-step-in"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="flex items-center gap-2.5">
                <PlanStateIcon done={isDone} active={isActive} />
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <span
                    className={`text-[12.5px] leading-snug ${
                      isDone
                        ? "text-white/55 line-through decoration-white/20"
                        : isActive
                          ? "text-white/90"
                          : "text-white/40"
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.detail && (
                    <span
                      className={`shrink-0 text-[10px] font-mono px-1.5 py-[1px] rounded border ${
                        isDone
                          ? "text-white/35 border-white/[0.05] bg-white/[0.02]"
                          : isActive
                            ? "text-indigo-200 border-indigo-400/25 bg-indigo-500/10"
                            : "text-white/30 border-white/[0.05] bg-white/[0.015]"
                      }`}
                    >
                      {item.detail}
                    </span>
                  )}
                </div>
              </div>
              {isActive && (
                <div className="mt-1.5 ml-[26px] h-[3px] rounded-full bg-white/[0.04] cd-bar-track" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PlanStateIcon({ done, active }: { done: boolean; active: boolean }) {
  if (done) {
    return (
      <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
        <svg
          width="9"
          height="9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-300"
          aria-hidden
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
    );
  }
  if (active) {
    return (
      <span className="relative shrink-0 w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-400/40 flex items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-indigo-400/60 cd-pulse-ring"
        />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 cd-dot-pulse" />
      </span>
    );
  }
  return (
    <span className="shrink-0 w-4 h-4 rounded-full border border-white/15 bg-white/[0.02]" />
  );
}

// ─── Code panel ────────────────────────────────────────────────────────────

function CodeCard({
  filename,
  tokens,
  upTo,
  streaming,
}: {
  filename: string;
  tokens: Token[];
  upTo: number;
  streaming: boolean;
}) {
  return (
    <div className="rounded-xl rounded-tl-md border border-white/[0.07] bg-[#0a0a13] overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.05]">
        <div className="inline-flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-4 h-4 rounded bg-blue-500/15 border border-blue-400/25">
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-300"
              aria-hidden
            >
              <path d="m8 6-6 6 6 6" />
              <path d="m16 6 6 6-6 6" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
            {streaming ? "Streaming" : "Generated"}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-white/40">
          <FileIcon />
          {filename}
        </div>
      </div>

      <pre className="px-3.5 py-3 text-[11.5px] font-mono leading-[1.75] overflow-x-auto whitespace-pre [&::-webkit-scrollbar]:h-0">
        <code>
          {renderTokens(tokens, upTo)}
          {streaming && (
            <span className="cd-caret inline-block w-[6px] h-[0.95em] bg-indigo-300 align-middle translate-y-[1px] rounded-[1px]" />
          )}
        </code>
      </pre>
    </div>
  );
}

function FileIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/35"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

// ─── Preview panel (shimmer skeleton → rendered component) ─────────────────

function PreviewCard({
  building,
  idKey,
  filename,
  children,
}: {
  building: boolean;
  idKey: string;
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-xl rounded-tl-md border border-white/[0.07] bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.07),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.05),transparent_60%),#0a0a13] overflow-hidden">
      <div className="flex items-center px-3 py-1.5 border-b border-white/[0.05] bg-white/[0.015]">
        <span className="text-[10.5px] font-mono text-white/55">
          {filename}
        </span>
      </div>
      <div className="relative p-3 min-h-[140px]">
        {building ? (
          <BuildingSkeleton />
        ) : (
          <div key={idKey} className="cd-preview-pop">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function BuildingSkeleton() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <ShimmerBar className="h-5 w-5 rounded-md" />
        <ShimmerBar className="h-3 w-28" />
      </div>
      <ShimmerBar className="h-2.5 w-[92%]" />
      <ShimmerBar className="h-2.5 w-[76%]" />
      <ShimmerBar className="h-2.5 w-[84%]" />
      <div className="flex items-center gap-2 pt-2">
        <ShimmerBar className="h-8 flex-1" />
        <ShimmerBar className="h-8 w-12" />
      </div>
    </div>
  );
}

function ShimmerBar({ className }: { className?: string }) {
  return (
    <div
      className={`cd-shimmer rounded-md bg-white/[0.04] ${className ?? ""}`}
      aria-hidden
    />
  );
}

// ─── Dock (input bar) ──────────────────────────────────────────────────────

function Dock({
  phase,
  typed,
  sceneIdx,
  total,
}: {
  phase: Phase;
  typed: string;
  sceneIdx: number;
  total: number;
}) {
  const isTyping = phase === "prompt-typing";
  const isWorking =
    phase === "plan-executing" ||
    phase === "code-streaming" ||
    phase === "preview-building";

  return (
    <div className="relative border-t border-white/[0.06] bg-[#06060c] px-3.5 py-3">
      <div
        className={`relative flex items-end gap-2 rounded-xl border px-3 py-2 transition-colors duration-300 ${
          isTyping
            ? "border-indigo-400/30 bg-white/[0.03] shadow-[0_0_24px_-10px_rgba(99,102,241,0.5)]"
            : "border-white/[0.07] bg-white/[0.02]"
        }`}
      >
        <div className="flex-1 min-w-0 text-[12.5px] text-white/80 leading-snug break-words whitespace-pre-wrap self-center">
          {isTyping ? (
            <>
              {typed}
              <span className="cd-caret inline-block w-[2px] h-[0.9em] bg-indigo-300 align-middle ml-[1px] translate-y-[1px]" />
            </>
          ) : (
            <span className="text-white/30">Ask Chumlab AI anything...</span>
          )}
        </div>

        <span
          aria-hidden
          className="shrink-0 w-7 h-7 flex items-center justify-center text-white/40"
          title="Attach screenshot"
        >
          <ImageUploadIcon size={15} />
        </span>

        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          className={`relative shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg overflow-hidden transition-all duration-300 ${
            isTyping || isWorking
              ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 shadow-[0_0_14px_rgba(99,102,241,0.55)]"
              : "bg-white/[0.05] border border-white/[0.07]"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${
              isTyping || isWorking ? "text-white" : "text-white/55"
            } ${isWorking ? "cd-sparkle-spin" : ""}`}
            aria-hidden
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576L1.044 12.72a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 006.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.194.777.802 1.384 1.578 1.579l1.036.258a.75.75 0 010 1.456l-1.036.258c-.777.195-1.384.802-1.579 1.578l-.258 1.036a.75.75 0 01-1.455 0l-.26-1.036a2.25 2.25 0 00-1.577-1.578l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.25 2.25 0 001.577-1.579l.26-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395a1.5 1.5 0 00-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395a1.5 1.5 0 00.948-.948l.395-1.183A.75.75 0 0116.5 15z"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-center mt-2.5">
        <div className="inline-flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === sceneIdx
                  ? "w-5 bg-gradient-to-r from-blue-400 to-violet-400"
                  : "w-1 bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scene 1 preview · Sign-in form ────────────────────────────────────────

function SignInPreview() {
  return (
    <div className="mx-auto max-w-[320px] rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500/25 via-indigo-500/20 to-violet-500/25 border border-white/10 p-[3px] flex items-center justify-center">
          <img
            src={logoSmall}
            alt=""
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
        <div>
          <div className="text-[12px] font-semibold text-white leading-none">
            Welcome back
          </div>
          <div className="text-[10px] text-white/45 mt-0.5">
            Sign in to continue to Chumlab
          </div>
        </div>
      </div>

      <FormField label="Email">
        <div className="flex items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.03] px-2 py-1">
          <MailIcon />
          <span className="flex-1 text-[11.5px] text-white/85 font-mono">
            alex@chumlab.com
          </span>
        </div>
      </FormField>

      <FormField label="Password" trailing="Forgot?">
        <div className="flex items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.03] px-2 py-1">
          <LockIcon />
          <span className="flex-1 text-[11.5px] text-white/85 font-mono tracking-[0.15em]">
            ••••••••••
          </span>
        </div>
      </FormField>

      <div className="flex items-center gap-2 pt-0.5">
        <CheckboxVisual checked />
        <span className="text-[11px] text-white/70">Remember me</span>
      </div>

      <button
        tabIndex={-1}
        aria-hidden
        className="relative w-full rounded-md py-1.5 text-[11.5px] font-semibold text-white overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 shadow-[0_8px_22px_-10px_rgba(99,102,241,0.65)]"
      >
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        Sign in
      </button>

      <div className="flex items-center gap-2">
        <span className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[9px] uppercase tracking-[0.14em] text-white/30 font-medium">
          or
        </span>
        <span className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SocialButton label="Google">
          <GoogleIcon />
        </SocialButton>
        <SocialButton label="GitHub">
          <GitHubIcon />
        </SocialButton>
      </div>
    </div>
  );
}

// ─── Scene 2 preview · Schedule meeting ────────────────────────────────────

// Form body is rendered both in the final preview (at natural size) AND in the
// screenshot attachment thumbnail (scaled down), so the two must be visually
// identical — AI rebuilding the reference pixel-for-pixel.
function ScheduleForm() {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-2">
      <div>
        <div className="text-[12px] font-semibold text-white leading-none">
          Schedule meeting
        </div>
        <div className="text-[10px] text-white/45 mt-0.5">
          Pick a time that works for everyone
        </div>
      </div>

      <FormField label="Title">
        <div className="rounded-md border border-white/[0.1] bg-white/[0.03] px-2 py-1">
          <span className="text-[11.5px] text-white/85">Product sync</span>
          <span className="cd-blink inline-block w-[1.5px] h-[9px] bg-indigo-300 align-middle ml-[1px] translate-y-[1px]" />
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-2">
        <FormField label="Date">
          <PickerField
            value="Apr 26, 2026"
            icon={<CalendarIcon />}
            accent="blue"
          />
        </FormField>
        <FormField label="Time">
          <PickerField
            value="2:00 PM"
            icon={<ClockIcon />}
            accent="violet"
          />
        </FormField>
      </div>

      <FormField label="Duration">
        <PickerField value="1 hour" trailing={<ChevronDownIcon />} />
      </FormField>

      <FormField label="Notes">
        <div className="rounded-md border border-white/[0.1] bg-white/[0.03] px-2 py-1 min-h-[30px]">
          <div className="text-[11px] text-white/70 leading-snug">
            Weekly product sync with design and eng.
          </div>
        </div>
      </FormField>

      <button
        tabIndex={-1}
        aria-hidden
        className="relative w-full rounded-md py-1.5 text-[11.5px] font-semibold text-white overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 shadow-[0_8px_22px_-10px_rgba(99,102,241,0.65)]"
      >
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        Schedule meeting
      </button>
    </div>
  );
}

function SchedulePreview() {
  return (
    <div className="mx-auto" style={{ maxWidth: SCHEDULE_FORM_W }}>
      <ScheduleForm />
    </div>
  );
}

// Natural (unscaled) width/height of ScheduleForm; used to size the thumbnail
// container so overflow is clipped cleanly when transform-scaling.
const SCHEDULE_FORM_W = 320;
const SCHEDULE_FORM_H = 340;
const SCHEDULE_THUMB_SCALE = 0.6;

function ScheduleThumbnail() {
  return (
    <div
      className="relative mx-auto overflow-hidden rounded-md"
      style={{
        width: SCHEDULE_FORM_W * SCHEDULE_THUMB_SCALE,
        height: SCHEDULE_FORM_H * SCHEDULE_THUMB_SCALE,
      }}
    >
      <div
        className="absolute top-0 left-0 pointer-events-none origin-top-left"
        style={{
          transform: `scale(${SCHEDULE_THUMB_SCALE})`,
          width: SCHEDULE_FORM_W,
        }}
      >
        <ScheduleForm />
      </div>
    </div>
  );
}

// ─── Scene 3 preview · Phone verification (OTP) ────────────────────────────

function PhoneOtpPreview() {
  const code = ["4", "8", "2", "", "", ""];
  return (
    <div className="mx-auto max-w-[320px] rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-2.5">
      <div>
        <div className="text-[12px] font-semibold text-white leading-none">
          Verify your number
        </div>
        <div className="text-[10px] text-white/45 mt-1 leading-snug">
          We texted a 6-digit code to{" "}
          <span className="text-white/70 font-mono">+1 (555) 012 3456</span>
        </div>
      </div>

      <FormField label="Phone number">
        <div className="flex items-stretch rounded-md border border-white/[0.1] bg-white/[0.03] overflow-hidden">
          <button
            tabIndex={-1}
            aria-hidden
            className="flex items-center gap-1 px-2 border-r border-white/[0.08] bg-white/[0.02]"
          >
            <UsFlag />
            <span className="text-[11px] font-mono text-white/80">+1</span>
            <ChevronDownIcon />
          </button>
          <div className="flex-1 px-2 py-1 text-[11.5px] text-white/85 font-mono tabular-nums">
            (555) 012 3456
          </div>
        </div>
      </FormField>

      <FormField
        label="Verification code"
        trailing={
          <span className="text-[10px] font-mono text-white/45 tabular-nums">
            <span className="cd-blink">00:42</span>
          </span>
        }
      >
        <div className="grid grid-cols-6 gap-1.5">
          {code.map((d, i) => {
            const isFilled = Boolean(d);
            const isActive = !isFilled && i === code.findIndex((x) => !x);
            return (
              <div
                key={i}
                className={`h-8 rounded-md border text-center flex items-center justify-center text-[13.5px] font-semibold font-mono tabular-nums ${
                  isFilled
                    ? "border-indigo-400/40 bg-indigo-500/10 text-white"
                    : isActive
                      ? "border-indigo-400/30 bg-white/[0.03] text-white/90"
                      : "border-white/[0.08] bg-white/[0.02] text-white/30"
                }`}
              >
                {isFilled ? (
                  d
                ) : isActive ? (
                  <span className="cd-caret inline-block w-[2px] h-[12px] bg-indigo-300 rounded-[1px]" />
                ) : (
                  "·"
                )}
              </div>
            );
          })}
        </div>
      </FormField>

      <button
        tabIndex={-1}
        aria-hidden
        className="relative w-full rounded-md py-1.5 text-[11.5px] font-semibold text-white overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 shadow-[0_8px_22px_-10px_rgba(99,102,241,0.65)]"
      >
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        Verify number
      </button>

      <div className="text-center text-[10px] text-white/45">
        Didn't get a code?{" "}
        <span className="text-indigo-300 font-medium">Resend</span>
      </div>
    </div>
  );
}

// ─── Shared preview atoms ──────────────────────────────────────────────────

function FormField({
  label,
  trailing,
  children,
}: {
  label: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] uppercase tracking-[0.1em] text-white/45 font-medium">
          {label}
        </label>
        {trailing && typeof trailing === "string" ? (
          <span className="text-[10px] text-indigo-300/80 font-medium">
            {trailing}
          </span>
        ) : (
          trailing
        )}
      </div>
      {children}
    </div>
  );
}

function PickerField({
  value,
  icon,
  trailing,
  accent,
}: {
  value: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  accent?: "blue" | "violet";
}) {
  const iconTint =
    accent === "blue"
      ? "text-blue-300"
      : accent === "violet"
        ? "text-violet-300"
        : "text-white/50";
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.03] px-2 py-1">
      {icon && <span className={`shrink-0 ${iconTint}`}>{icon}</span>}
      <span className="flex-1 text-[11.5px] text-white/85">{value}</span>
      {trailing && <span className="shrink-0 text-white/40">{trailing}</span>}
    </div>
  );
}

function CheckboxVisual({ checked }: { checked?: boolean }) {
  return (
    <span
      className={`shrink-0 w-3.5 h-3.5 rounded-[4px] border flex items-center justify-center ${
        checked
          ? "bg-gradient-to-br from-indigo-500 to-violet-500 border-indigo-400/40"
          : "bg-white/[0.03] border-white/15"
      }`}
      aria-hidden
    >
      {checked && (
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </span>
  );
}

function MailIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/40"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/40"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UsFlag() {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 20 14"
      className="rounded-[1px] shrink-0"
      aria-hidden
    >
      <rect width="20" height="14" fill="#b22234" />
      <rect y="2" width="20" height="1.1" fill="#fff" />
      <rect y="4.2" width="20" height="1.1" fill="#fff" />
      <rect y="6.4" width="20" height="1.1" fill="#fff" />
      <rect y="8.6" width="20" height="1.1" fill="#fff" />
      <rect y="10.8" width="20" height="1.1" fill="#fff" />
      <rect y="12.9" width="20" height="1.1" fill="#fff" />
      <rect width="8.5" height="7.5" fill="#3c3b6e" />
    </svg>
  );
}

function SocialButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      tabIndex={-1}
      aria-hidden
      className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] py-1.5 text-[11.5px] font-medium text-white/85 hover:bg-white/[0.04] transition-colors"
    >
      {children}
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-5.8 7.5-11.3 7.5-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.2 0 6.1 1.2 8.3 3.1l5.7-5.7C34.4 4.6 29.5 2.5 24 2.5 12.1 2.5 2.5 12.1 2.5 24S12.1 45.5 24 45.5c11 0 20.5-8 20.5-21.5 0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.3l6.6 4.8c1.8-4.4 6-7.6 11.1-7.6 3.2 0 6.1 1.2 8.3 3.1l5.7-5.7C34.4 4.6 29.5 2.5 24 2.5c-7.4 0-13.8 4-17.7 9.8z"
      />
      <path
        fill="#4CAF50"
        d="M24 45.5c5.4 0 10.3-2 14-5.4l-6.5-5.5C29.5 36.2 26.9 37.5 24 37.5c-5.4 0-10-3.4-11.7-8l-6.6 5.1C9.8 41.1 16.3 45.5 24 45.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.3 4.4-4.3 5.9l6.5 5.5c-.5.5 7-5.1 7-15.4 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white/80"
      aria-hidden
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
