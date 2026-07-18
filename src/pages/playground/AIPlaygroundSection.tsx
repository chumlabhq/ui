import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, addIcon } from "@iconify/react";
import { useSearchParams } from "react-router-dom";
import { useEnterPlayground } from "./lib/enterPlayground";
import Reveal from "../../components/Reveal/Reveal";
import { Button } from "../../components/ui";
import logoSmall from "../../assets/images/logo-small.png";

// Register the few icons this section renders so they paint instantly and never
// hit api.iconify.design on the public landing page. Data lifted verbatim from
// the @iconify-json packs. (The live preview sandbox keeps lazy-fetching — it
// renders arbitrary user icons; this is a fixed marketing surface.)
addIcon("lucide:mail", {
  body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/></g>',
  width: 24,
  height: 24,
});
addIcon("lucide:lock", {
  body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g>',
  width: 24,
  height: 24,
});
addIcon("logos:google-icon", {
  body: '<path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>',
  width: 256,
  height: 262,
});

/**
 * Section 4 — AI Playground promo.
 *
 * Browser-window card containing a single-column conversational chat demo
 * that loops through three example prompts (OTP input, login page from a
 * screenshot, team data table). The persistent greeting message stays
 * mounted across cycles; everything posted *after* the greeting belongs to
 * the active cycle and gets cleared at the end before the next one starts.
 *
 * Phase machine: each task gets its own phase so progression is linear.
 * One `setTimeout` per phase transition; one `setInterval` for code
 * streaming. All timers are cleaned up on pause / unmount and a mount-guard
 * prevents stale callbacks from updating state after teardown.
 */

// ─── Token model (lightweight syntax highlighter) ─────────────────────────

type TokenKind = "kw" | "str" | "fn" | "punc" | "comment";
interface Token {
  k: TokenKind;
  t: string;
}

const K = (t: string): Token => ({ k: "kw", t });
const S = (t: string): Token => ({ k: "str", t });
const F = (t: string): Token => ({ k: "fn", t });
const P = (t: string): Token => ({ k: "punc", t });

function tokenClass(k: TokenKind): string {
  switch (k) {
    case "kw":
      return "text-[#c4b5fd]";
    case "str":
      return "text-[#c5e1a5]";
    case "fn":
      return "text-[#93c5fd]";
    case "punc":
      return "text-fg";
    case "comment":
      return "text-[#6b7280] italic";
  }
}

function lineLength(line: Token[]): number {
  let n = 0;
  for (const tok of line) n += tok.t.length;
  return n;
}

// Blank lines count as one streaming tick so they pause briefly between
// neighbouring lines instead of all appearing at once.
function totalCodeChars(code: Token[][]): number {
  let n = 0;
  for (const line of code) n += Math.max(lineLength(line), 1);
  return n;
}

function renderCode(code: Token[][], upTo: number): React.ReactNode[] {
  const els: React.ReactNode[] = [];
  let consumed = 0;
  for (let i = 0; i < code.length; i++) {
    if (consumed > upTo) break;
    const line = code[i];
    const len = Math.max(lineLength(line), 1);
    const lineUpTo = Math.min(lineLength(line), Math.max(0, upTo - consumed));

    const spans: React.ReactNode[] = [];
    let used = 0;
    for (let j = 0; j < line.length; j++) {
      if (used >= lineUpTo) break;
      const tok = line[j];
      const take = Math.min(tok.t.length, lineUpTo - used);
      spans.push(
        <span key={j} className={tokenClass(tok.k)}>
          {tok.t.slice(0, take)}
        </span>,
      );
      used += take;
    }

    els.push(
      <div key={i} className="min-h-[1.65em]">
        {spans.length > 0 ? spans : <>&nbsp;</>}
      </div>,
    );
    consumed += len;
  }
  return els;
}

// ─── Preview components (polished mockups of generated output) ────────────

function OTPInputPreview() {
  const boxes: Array<{ value: string; focus: boolean }> = [
    { value: "1", focus: false },
    { value: "2", focus: false },
    { value: "3", focus: false },
    { value: "", focus: true },
    { value: "", focus: false },
    { value: "", focus: false },
  ];
  return (
    <div className="w-full max-w-[300px] mx-auto bg-bg-elevated border border-border-faint rounded-lg p-4 flex flex-col gap-3">
      <div className="text-center space-y-1">
        <div className="text-[15px] font-medium text-fg leading-tight">
          Verify your number
        </div>
        <div className="text-[12px] text-fg-secondary leading-snug">
          Enter the 6-digit code sent to your phone.
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        {boxes.map((box, i) => (
          <div
            key={i}
            className={`w-9 h-10 rounded-md bg-bg-base flex items-center justify-center font-mono text-[14px] font-medium transition-colors ${
              box.focus
                ? "border border-accent shadow-[0_0_0_3px_rgba(91,155,255,0.2)] text-fg"
                : box.value
                  ? "border border-border-soft text-fg"
                  : "border border-border-soft text-fg-muted"
            }`}
          >
            {box.focus ? (
              <span
                aria-hidden
                className="inline-block w-px h-3.5 bg-accent animate-cursor"
              />
            ) : (
              box.value || ""
            )}
          </div>
        ))}
      </div>
      <div className="text-center font-mono text-[10px] text-fg-tertiary">
        Didn&rsquo;t receive a code? Resend in 0:42
      </div>
      <div className="w-full py-2.5 rounded-md bg-fg text-bg-base font-medium text-[13px] text-center">
        Verify
      </div>
    </div>
  );
}

function LoginPagePreview() {
  return (
    <div className="w-full max-w-[280px] mx-auto bg-bg-elevated border border-border-faint rounded-lg p-4 flex flex-col gap-3">
      {/* Logo */}
      <div className="mx-auto w-8 h-8 rounded-lg bg-bg-base border border-border-faint flex items-center justify-center overflow-hidden">
        <img
          src={logoSmall}
          alt=""
          aria-hidden
          className="w-6 h-6 object-contain"
        />
      </div>

      {/* Title + subtitle */}
      <div className="text-center space-y-0.5">
        <div className="text-[16px] font-medium text-fg leading-tight">
          Welcome back
        </div>
        <div className="text-[12px] text-fg-secondary leading-snug">
          Sign in to continue to Chumlab.
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <div className="font-mono text-[10px] uppercase tracking-wider text-fg-secondary">
          Email
        </div>
        <div className="h-8 rounded-md border border-border-soft bg-bg-base flex items-center gap-2 px-2.5">
          <Icon
            icon="lucide:mail"
            width={14}
            height={14}
            className="text-fg-tertiary shrink-0"
            aria-hidden
          />
          <span className="text-[12px] text-fg font-mono truncate">
            you@chumlab.com
          </span>
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <div className="font-mono text-[10px] uppercase tracking-wider text-fg-secondary">
          Password
        </div>
        <div className="h-8 rounded-md border border-border-soft bg-bg-base flex items-center gap-2 px-2.5">
          <Icon
            icon="lucide:lock"
            width={14}
            height={14}
            className="text-fg-tertiary shrink-0"
            aria-hidden
          />
          <span className="text-[12px] text-fg font-mono tracking-widest">
            •••••••••
          </span>
        </div>
      </div>

      {/* Sign in */}
      <div className="w-full py-2 rounded-md bg-fg text-bg-base font-medium text-[13px] text-center">
        Sign in
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-fg/15" />
        <span className="font-mono text-[11px] text-fg-tertiary">or</span>
        <div className="flex-1 h-px bg-fg/15" />
      </div>

      {/* Google */}
      <div className="w-full py-2 rounded-md border border-border-active bg-transparent text-fg font-medium text-[13px] flex items-center justify-center gap-2">
        <Icon icon="logos:google-icon" width={16} height={16} aria-hidden />
        Continue with Google
      </div>
    </div>
  );
}

const TABLE_ROWS = [
  {
    initials: "MR",
    color: "#14b8a6",
    name: "Maya Rivera",
    role: "Senior Designer",
    status: "Active" as const,
    date: "Mar 2024",
  },
  {
    initials: "DK",
    color: "#a78bfa",
    name: "Dev Kapoor",
    role: "Frontend Eng.",
    status: "Active" as const,
    date: "Jun 2024",
  },
  {
    initials: "AY",
    color: "#fb923c",
    name: "Adi Yadav",
    role: "Founder",
    status: "Active" as const,
    date: "Jan 2023",
  },
  {
    initials: "SS",
    color: "#f472b6",
    name: "Sara Singh",
    role: "Product Mgr.",
    status: "Pending" as const,
    date: "Sep 2024",
  },
  {
    initials: "RJ",
    color: "var(--accent)",
    name: "Raj Joshi",
    role: "Designer",
    status: "Invited" as const,
    date: "Today",
  },
];

const STATUS_PILL: Record<"Active" | "Pending" | "Invited", string> = {
  Active: "bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/30",
  Pending: "bg-[#facc15]/15 text-[#facc15] border-[#facc15]/30",
  Invited: "bg-fg/10 text-fg-secondary border-border-active",
};

function TeamTablePreview() {
  return (
    <div className="w-full max-w-[480px] mx-auto bg-bg-elevated border border-border-faint rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-faint">
        <span className="font-mono text-[11px] text-fg-secondary">
          247 members
        </span>
        <span
          aria-hidden
          className="w-5 h-5 rounded border border-border-faint flex items-center justify-center text-fg-tertiary"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3"
            aria-hidden
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
          </svg>
        </span>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead className="bg-bg-elevated/40">
          <tr className="border-b border-border-faint">
            <th className="w-7 px-2 py-2">
              <span
                aria-hidden
                className="inline-flex w-3.5 h-3.5 rounded-sm border border-accent/40 bg-accent/15 items-center justify-center"
              >
                <span className="w-1.5 h-px bg-accent" />
              </span>
            </th>
            <th className="px-2 py-2 font-mono text-[9px] uppercase tracking-wider text-accent">
              <span className="inline-flex items-center gap-1">
                Name
                <svg
                  viewBox="0 0 12 6"
                  fill="currentColor"
                  className="w-2 h-1"
                  aria-hidden
                >
                  <path d="M6 0 0 6h12Z" />
                </svg>
              </span>
            </th>
            <th className="px-2 py-2 font-mono text-[9px] uppercase tracking-wider text-fg-tertiary">
              Role
            </th>
            <th className="px-2 py-2 font-mono text-[9px] uppercase tracking-wider text-fg-tertiary">
              Status
            </th>
            <th className="px-2 py-2 font-mono text-[9px] uppercase tracking-wider text-fg-tertiary">
              Joined
            </th>
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((row, i) => (
            <tr
              key={row.initials}
              className="border-b border-border-faint last:border-b-0"
            >
              <td className="w-7 px-2 py-1.5">
                {i === 0 ? (
                  <span
                    aria-hidden
                    className="inline-flex w-3.5 h-3.5 rounded-sm bg-accent border border-accent items-center justify-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="var(--bg-base)"
                      className="w-2 h-2"
                      aria-hidden
                    >
                      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z" />
                    </svg>
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="inline-block w-3.5 h-3.5 rounded-sm border border-border-active"
                  />
                )}
              </td>
              <td className="px-2 py-1.5">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-medium shrink-0"
                    style={{
                      background: `${row.color}30`,
                      color: row.color,
                    }}
                  >
                    {row.initials}
                  </span>
                  <span className="text-[12px] text-fg truncate">
                    {row.name}
                  </span>
                </span>
              </td>
              <td className="px-2 py-1.5 text-[11px] text-fg-secondary truncate">
                {row.role}
              </td>
              <td className="px-2 py-1.5">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full border text-[9px] font-medium ${STATUS_PILL[row.status]}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-2 py-1.5 font-mono text-[10px] text-fg-secondary whitespace-nowrap">
                {row.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-border-faint">
        <span className="font-mono text-[10px] text-fg-secondary">
          Showing 1–25 of 247
        </span>
        <div className="flex items-center gap-1">
          <span
            aria-hidden
            className="w-5 h-5 rounded border border-border-faint flex items-center justify-center text-fg-tertiary"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-2.5 h-2.5"
              aria-hidden
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </span>
          <span
            aria-hidden
            className="w-5 h-5 rounded border border-accent/30 bg-accent/15 flex items-center justify-center text-[10px] font-medium text-accent"
          >
            1
          </span>
          {["2", "3"].map((n) => (
            <span
              key={n}
              aria-hidden
              className="w-5 h-5 rounded border border-border-faint flex items-center justify-center text-[10px] font-medium text-fg-secondary"
            >
              {n}
            </span>
          ))}
          <span aria-hidden className="px-1 text-[10px] text-fg-muted">
            …
          </span>
          <span
            aria-hidden
            className="w-5 h-5 rounded border border-border-faint flex items-center justify-center text-[10px] font-medium text-fg-secondary"
          >
            10
          </span>
          <span
            aria-hidden
            className="w-5 h-5 rounded border border-border-faint flex items-center justify-center text-fg-tertiary"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-2.5 h-2.5"
              aria-hidden
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

// Login-page screenshot inside the cycle-2 user message bubble. Renders the
// real `LoginPagePreview` component shrunk via CSS `zoom` so the screenshot
// the user "uploads" is literally the same UI the AI ends up generating —
// same text, same icons, same Google G — just smaller. Wrapped in a tile
// with the `login.png` filename badge to read as a real image upload.
function LoginScreenshotSkeleton() {
  return (
    <div className="w-[160px] sm:w-[200px] rounded-lg bg-bg-elevated border border-border-soft mb-2 relative overflow-hidden">
      <div className="px-2 py-3" style={{ zoom: 0.6 }}>
        <LoginPagePreview />
      </div>
      <span className="absolute bottom-1.5 right-1.5 font-mono text-[8px] text-fg-secondary bg-bg-elevated/90 px-1.5 py-0.5 rounded">
        login.png
      </span>
    </div>
  );
}

// ─── Cycles ───────────────────────────────────────────────────────────────

interface PlanTask {
  label: string;
  tag: string;
}

interface Cycle {
  id: string;
  type: "text" | "screenshot";
  userPrompt: string;
  /** Customised text response from Chumlab AI shown after the user message
   *  and the thinking dots. Stays visible through the rest of the cycle. */
  aiIntro: string;
  filename: string;
  tasks: PlanTask[];
  code: Token[][];
  Preview: React.ComponentType;
  Skeleton?: React.ComponentType;
}

const CYCLES: Cycle[] = [
  {
    id: "otp",
    type: "text",
    userPrompt: "A 6-digit OTP input with auto-focus and paste support.",
    aiIntro:
      "Got it — I'll wire up a 6-digit OTPInput with auto-focus and paste detection, then drop it under a Verify button.",
    filename: "VerifyOTP.tsx",
    tasks: [
      { label: "Parse OTP requirements from prompt", tag: "form · auth" },
      { label: "Import OTPInput, Button", tag: "@chumlab/ui" },
      { label: "Wire 6-digit input with auto-focus", tag: "OTPInput" },
      { label: "Add paste detection + auto-submit", tag: "paste" },
    ],
    code: [
      [
        K("import"),
        P(" { "),
        F("OTPInput"),
        P(", "),
        F("Button"),
        P(" } "),
        K("from"),
        P(" "),
        S('"@chumlab/ui"'),
        P(";"),
      ],
      [],
      [K("export"), P(" "), K("function"), P(" "), F("VerifyOTP"), P("() {")],
      [P("  "), K("return"), P(" (")],
      [
        P("    <"),
        F("div"),
        P(" className="),
        S('"space-y-6 max-w-sm"'),
        P(">"),
      ],
      [P("      <"), F("div"), P(" className="), S('"space-y-1"'), P(">")],
      [
        P("        <"),
        F("h2"),
        P(" className="),
        S('"text-lg font-medium"'),
        P(">Verify your number</"),
        F("h2"),
        P(">"),
      ],
      [
        P("        <"),
        F("p"),
        P(" className="),
        S('"text-sm text-muted"'),
        P(">"),
      ],
      [P("          Enter the 6-digit code sent to your phone.")],
      [P("        </"), F("p"), P(">")],
      [P("      </"), F("div"), P(">")],
      [P("      <"), F("OTPInput")],
      [P("        length={6}")],
      [P("        autoFocus")],
      [
        P("        onComplete={("),
        P("code"),
        P(") => "),
        F("verify"),
        P("("),
        P("code"),
        P(")}"),
      ],
      [P("      />")],
      [
        P("      <"),
        F("Button"),
        P(" className="),
        S('"w-full"'),
        P(">Verify</"),
        F("Button"),
        P(">"),
      ],
      [P("    </"), F("div"), P(">")],
      [P("  );")],
      [P("}")],
    ],
    Preview: OTPInputPreview,
  },
  {
    id: "login",
    type: "screenshot",
    userPrompt: "Build this for me.",
    aiIntro:
      "Looking at the screenshot. I'll detect the form layout, rebuild it with Logo, Input, Button, Divider, and finish with a Google sign-in row.",
    filename: "LoginPage.tsx",
    tasks: [
      { label: "Detect login layout from image", tag: "vision" },
      { label: "Import Logo, Input, Button, Divider", tag: "@chumlab/ui" },
      { label: "Compose form with email, password", tag: "Input ×2" },
      { label: "Add Google sign-in with icon", tag: "OAuth" },
    ],
    code: [
      [
        K("import"),
        P(" { "),
        F("Logo"),
        P(", "),
        F("Input"),
        P(", "),
        F("Button"),
        P(", "),
        F("Divider"),
        P(" } "),
        K("from"),
        P(" "),
        S('"@chumlab/ui"'),
        P(";"),
      ],
      [
        K("import"),
        P(" { "),
        F("Icon"),
        P(" } "),
        K("from"),
        P(" "),
        S('"@iconify/react"'),
        P(";"),
      ],
      [],
      [K("export"), P(" "), K("function"), P(" "), F("LoginPage"), P("() {")],
      [P("  "), K("return"), P(" (")],
      [
        P("    <"),
        F("div"),
        P(" className="),
        S('"max-w-sm space-y-6"'),
        P(">"),
      ],
      [
        P("      <"),
        F("div"),
        P(" className="),
        S('"text-center space-y-2"'),
        P(">"),
      ],
      [P("        <"), F("Logo"), P(" size="), S('"lg"'), P(" />")],
      [
        P("        <"),
        F("h1"),
        P(" className="),
        S('"text-xl font-medium"'),
        P(">Welcome back</"),
        F("h1"),
        P(">"),
      ],
      [
        P("        <"),
        F("p"),
        P(" className="),
        S('"text-sm text-muted"'),
        P(">"),
      ],
      [P("          Sign in to continue to Chumlab.")],
      [P("        </"), F("p"), P(">")],
      [P("      </"), F("div"), P(">")],
      [P("      <"), F("form"), P(" className="), S('"space-y-3"'), P(">")],
      [
        P("        <"),
        F("Input"),
        P(" label="),
        S('"Email"'),
        P(" type="),
        S('"email"'),
        P(" />"),
      ],
      [
        P("        <"),
        F("Input"),
        P(" label="),
        S('"Password"'),
        P(" type="),
        S('"password"'),
        P(" />"),
      ],
      [
        P("        <"),
        F("Button"),
        P(" type="),
        S('"submit"'),
        P(" className="),
        S('"w-full"'),
        P(">"),
      ],
      [P("          Sign in")],
      [P("        </"), F("Button"), P(">")],
      [P("      </"), F("form"), P(">")],
      [P("      <"), F("Divider"), P(">or</"), F("Divider"), P(">")],
      [
        P("      <"),
        F("Button"),
        P(" variant="),
        S('"outline"'),
        P(" className="),
        S('"w-full"'),
        P(">"),
      ],
      [
        P("        <"),
        F("Icon"),
        P(" icon="),
        S('"logos:google-icon"'),
        P(" width={16} height={16} />"),
      ],
      [P("        Continue with Google")],
      [P("      </"), F("Button"), P(">")],
      [P("    </"), F("div"), P(">")],
      [P("  );")],
      [P("}")],
    ],
    Preview: LoginPagePreview,
    Skeleton: LoginScreenshotSkeleton,
  },
  {
    id: "table",
    type: "text",
    userPrompt: "A data table with sorting, pagination, and row selection.",
    aiIntro:
      "On it — I'll use the Table primitive with sortable columns, a Checkbox-driven row selection, and Pagination set to 25 per page.",
    filename: "TeamTable.tsx",
    tasks: [
      { label: "Parse table requirements from prompt", tag: "data" },
      {
        label: "Import Table, Checkbox, Avatar, Pagination",
        tag: "@chumlab/ui",
      },
      { label: "Build sortable columns + row selection", tag: "Table" },
      { label: "Wire pagination with 25 per page", tag: "Pagination" },
    ],
    code: [
      [
        K("import"),
        P(" { "),
        F("Table"),
        P(", "),
        F("Checkbox"),
        P(", "),
        F("Avatar"),
        P(", "),
        F("Pagination"),
        P(" } "),
        K("from"),
        P(" "),
        S('"@chumlab/ui"'),
        P(";"),
      ],
      [],
      [K("export"), P(" "), K("function"), P(" "), F("TeamTable"), P("() {")],
      [P("  "), K("return"), P(" (")],
      [P("    <"), F("Table")],
      [P("      data={members}")],
      [P("      columns={[")],
      [
        P("        { id: "),
        S('"name"'),
        P(", header: "),
        S('"Name"'),
        P(", sortable: "),
        K("true"),
        P(" },"),
      ],
      [
        P("        { id: "),
        S('"role"'),
        P(", header: "),
        S('"Role"'),
        P(", sortable: "),
        K("true"),
        P(" },"),
      ],
      [
        P("        { id: "),
        S('"status"'),
        P(", header: "),
        S('"Status"'),
        P(" },"),
      ],
      [
        P("        { id: "),
        S('"joined"'),
        P(", header: "),
        S('"Joined"'),
        P(", sortable: "),
        K("true"),
        P(" },"),
      ],
      [P("      ]}")],
      [P("      rowSelection")],
      [P("      pagination={{ pageSize: 25 }}")],
      [P("    />")],
      [P("  );")],
      [P("}")],
    ],
    Preview: TeamTablePreview,
  },
];

// ─── Phase machine ────────────────────────────────────────────────────────

type Phase =
  | "inputTyping"
  | "sendBeat"
  | "thinking"
  | "aiIntro"
  | "task1"
  | "task2"
  | "task3"
  | "task4"
  | "codeStream"
  | "rendering"
  | "rest"
  | "cleanup";

const PHASE_ORDER: readonly Phase[] = [
  "inputTyping",
  "sendBeat",
  "thinking",
  "aiIntro",
  "task1",
  "task2",
  "task3",
  "task4",
  "codeStream",
  "rendering",
  "rest",
  "cleanup",
];

// All values are in milliseconds. `inputTyping` and `codeStream` are
// excluded — their durations are driven by per-character intervals below.
const PHASE_DURATIONS: Record<
  Exclude<Phase, "inputTyping" | "codeStream">,
  number
> = {
  // Brief beat after the prompt finishes typing into the input field —
  // simulates the user clicking send. The user-message bubble mounts
  // (right-aligned with the user avatar) and the input clears.
  sendBeat: 350,
  thinking: 900,
  aiIntro: 1500,
  task1: 900,
  task2: 900,
  task3: 900,
  task4: 900,
  rendering: 1000,
  rest: 3000,
  cleanup: 1000,
};

const PROMPT_MS = 35; // per character, user prompt typing
const CODE_MS = 22; // per character, code streaming

const TASK_PHASES: readonly Phase[] = ["task1", "task2", "task3", "task4"];

function taskState(
  taskIndex: number,
  phase: Phase,
): "pending" | "active" | "done" {
  if (
    phase === "inputTyping" ||
    phase === "sendBeat" ||
    phase === "thinking" ||
    phase === "aiIntro"
  )
    return "pending";
  const idx = TASK_PHASES.indexOf(phase);
  if (idx === -1) return "done"; // past planning
  if (taskIndex < idx) return "done";
  if (taskIndex === idx) return "active";
  return "pending";
}

function completedTaskCount(phase: Phase, total: number): number {
  if (
    phase === "inputTyping" ||
    phase === "sendBeat" ||
    phase === "thinking" ||
    phase === "aiIntro"
  )
    return 0;
  const idx = TASK_PHASES.indexOf(phase);
  if (idx === -1) return total;
  return idx;
}

interface LoopState {
  cycleIdx: number;
  phase: Phase;
  promptChars: number;
  codeChars: number;
}

function usePlaygroundLoop({
  cycles,
  paused,
  slowFactor,
  staticFinal,
}: {
  cycles: Cycle[];
  paused: boolean;
  slowFactor: number;
  staticFinal: boolean;
}): LoopState {
  // Lazy initial state — when `prefers-reduced-motion: reduce` is on at
  // first render we mount straight into the final completed state of
  // cycle 0 (full prompt, full code, preview shown) so there's no flash
  // of mid-cycle state and no need to run a derived-state effect.
  const [cycleIdx, setCycleIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>(() =>
    staticFinal ? "rest" : "inputTyping",
  );
  const [promptChars, setPromptChars] = useState(() =>
    staticFinal ? cycles[0].userPrompt.length : 0,
  );
  const [codeChars, setCodeChars] = useState(() =>
    staticFinal ? totalCodeChars(cycles[0].code) : 0,
  );

  // If `staticFinal` flips mid-session (the user toggles reduced-motion
  // in their OS), adjust state during render — the canonical alternative
  // to a derived-state effect. See:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevStaticFinal, setPrevStaticFinal] = useState(staticFinal);
  if (staticFinal !== prevStaticFinal) {
    setPrevStaticFinal(staticFinal);
    setCycleIdx(0);
    if (staticFinal) {
      setPhase("rest");
      setPromptChars(cycles[0].userPrompt.length);
      setCodeChars(totalCodeChars(cycles[0].code));
    } else {
      // Reduced-motion turned off — restart the loop from the top.
      setPhase("inputTyping");
      setPromptChars(0);
      setCodeChars(0);
    }
  }

  // Mount guard — flips to false on unmount so any in-flight callback bails
  // out cleanly instead of calling setState on an unmounted component.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ─ Effect A — single setTimeout per non-streaming, non-typing phase.
  // Cleanup clears it on pause / unmount / phase change so timers can
  // never accumulate.
  useEffect(() => {
    if (paused || staticFinal) return;
    if (phase === "inputTyping" || phase === "codeStream") return;

    const duration = PHASE_DURATIONS[phase] * slowFactor;
    const timer = setTimeout(() => {
      if (!isMountedRef.current) return;

      if (phase === "cleanup") {
        // Wrap to next cycle: reset both stream offsets, advance index,
        // return to the start of the phase order. All four updates batch
        // into one render so the next effect run sees consistent state.
        setPromptChars(0);
        setCodeChars(0);
        setCycleIdx((c) => (c + 1) % cycles.length);
        setPhase("inputTyping");
        return;
      }

      const idx = PHASE_ORDER.indexOf(phase);
      if (idx === -1) return;
      setPhase(PHASE_ORDER[idx + 1]);
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, paused, staticFinal, slowFactor, cycles]);

  // ─ Effect B — interval driving the prompt typing into the input field.
  // Active only while phase === "inputTyping". When the cursor reaches the
  // end of the prompt, the interval clears itself and hands off to
  // "sendBeat" — which clears the input and mounts the user-message bubble.
  useEffect(() => {
    if (paused || staticFinal) return;
    if (phase !== "inputTyping") return;

    const total = cycles[cycleIdx].userPrompt.length;
    if (total <= 0) {
      // Defer the phase advance — calling setState synchronously from
      // an effect body causes cascading renders. setTimeout(0) bumps it
      // to a fresh microtask outside the effect.
      const handoff = window.setTimeout(() => {
        if (isMountedRef.current) setPhase("sendBeat");
      }, 0);
      return () => window.clearTimeout(handoff);
    }

    const interval = window.setInterval(() => {
      if (!isMountedRef.current) {
        window.clearInterval(interval);
        return;
      }
      setPromptChars((prev) => {
        const next = prev + 1;
        if (next >= total) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            if (isMountedRef.current) setPhase("sendBeat");
          }, 0);
          return total;
        }
        return next;
      });
    }, PROMPT_MS * slowFactor);

    return () => window.clearInterval(interval);
  }, [phase, paused, staticFinal, slowFactor, cycleIdx, cycles]);

  // ─ Effect C — interval driving the code stream. Same shape as Effect B.
  useEffect(() => {
    if (paused || staticFinal) return;
    if (phase !== "codeStream") return;

    const total = totalCodeChars(cycles[cycleIdx].code);
    if (total <= 0) {
      // Same deferred-handoff pattern as Effect B's empty-prompt path.
      const handoff = window.setTimeout(() => {
        if (isMountedRef.current) setPhase("rendering");
      }, 0);
      return () => window.clearTimeout(handoff);
    }

    const interval = window.setInterval(() => {
      if (!isMountedRef.current) {
        window.clearInterval(interval);
        return;
      }
      setCodeChars((prev) => {
        const next = prev + 1;
        if (next >= total) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            if (isMountedRef.current) setPhase("rendering");
          }, 0);
          return total;
        }
        return next;
      });
    }, CODE_MS * slowFactor);

    return () => window.clearInterval(interval);
  }, [phase, paused, staticFinal, slowFactor, cycleIdx, cycles]);

  return { cycleIdx, phase, promptChars, codeChars };
}

// ─── Section ──────────────────────────────────────────────────────────────

export default function AIPlaygroundSection() {
  const [params, setParams] = useSearchParams();
  const enterPlayground = useEnterPlayground();

  // Track C: the old ?openPlayground=1 waitlist links funnel straight into the
  // entry guard now — authenticated users land in /playground, everyone else
  // starts auth. No onboarding modal.
  useEffect(() => {
    if (params.get("openPlayground") !== "1") return;
    const p = new URLSearchParams(params);
    p.delete("openPlayground");
    setParams(p, { replace: true });
    enterPlayground();
  }, [params, setParams, enterPlayground]);

  // Pause coordination — any of these flips `paused` true. Hover is
  // intentionally NOT in this list; the demo plays continuously like a
  // video and ignores the cursor.
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(true);
  // Lazy initializers read the matching media-query value on mount so the
  // listener effects below only need to handle change events — no
  // synchronous setState in an effect body.
  const [hidden, setHidden] = useState(() =>
    typeof document !== "undefined" ? document.hidden : false,
  );
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [slowFactor, setSlowFactor] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches
      ? 1
      : 1.2,
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // (Heading-block entry animations now flow through the shared <Reveal>
  // component below. The `isInView` IntersectionObserver above is preserved
  // because it gates the continuous chat-cycle loop, not entry timing.)

  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setSlowFactor(mq.matches ? 1 : 1.2);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const paused = !isInView || hidden || reducedMotion;
  const { cycleIdx, phase, promptChars, codeChars } = usePlaygroundLoop({
    cycles: CYCLES,
    paused,
    slowFactor,
    staticFinal: reducedMotion,
  });

  const cycle = CYCLES[cycleIdx];
  const PreviewComponent = cycle.Preview;
  const Skeleton = cycle.Skeleton;

  // Status label + send-button state derived directly from phase. Both
  // stay in lock-step with the loop without any extra timers. While the
  // user is typing into the input or the send beat plays, the AI hasn't
  // started yet — status reads "Ready" and the send icon is idle.
  const statusLabel: "Ready" | "Planning" | "Coding" | "Rendering" =
    useMemo(() => {
      if (phase === "inputTyping" || phase === "sendBeat") return "Ready";
      if (
        phase === "thinking" ||
        phase === "aiIntro" ||
        phase === "task1" ||
        phase === "task2" ||
        phase === "task3" ||
        phase === "task4"
      )
        return "Planning";
      if (phase === "codeStream") return "Coding";
      if (phase === "rendering") return "Rendering";
      return "Ready"; // rest, cleanup
    }, [phase]);

  const sendState: "idle" | "working" =
    statusLabel === "Ready" ? "idle" : "working";

  // Visibility flags for each cycle-scoped message.
  const showInputTyping = phase === "inputTyping";
  // The user bubble is rendered from `sendBeat` onwards — i.e. once the
  // user has "sent" the prompt. It stays through the rest of the cycle and
  // fades out only during `cleanup`.
  const showUserBubble = phase !== "inputTyping";
  const showThinking = phase === "thinking";
  const showAIIntro =
    phase === "aiIntro" ||
    phase === "task1" ||
    phase === "task2" ||
    phase === "task3" ||
    phase === "task4" ||
    phase === "codeStream" ||
    phase === "rendering" ||
    phase === "rest" ||
    phase === "cleanup";
  const showPlan =
    phase === "task1" ||
    phase === "task2" ||
    phase === "task3" ||
    phase === "task4" ||
    phase === "codeStream" ||
    phase === "rendering" ||
    phase === "rest" ||
    phase === "cleanup";
  const showCode =
    phase === "codeStream" ||
    phase === "rendering" ||
    phase === "rest" ||
    phase === "cleanup";
  const showPreview =
    phase === "rendering" || phase === "rest" || phase === "cleanup";
  const fadingOut = phase === "cleanup";
  const fadeContentClass = fadingOut
    ? "opacity-30 blur-[1px]"
    : "opacity-100 blur-0";

  // Keep the conversation scrolled to the bottom as content streams in.
  // Direct `scrollTop` assignment (not `scrollTo({ behavior: "smooth" })`)
  // — the smooth variant queued concurrent animations 600+ times per cycle
  // and could leak to the page-level scroller on some browsers, jumping
  // the visitor to a different section. Direct scrollTop is instant,
  // contained to the chat element, and follows the messages live.
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion) return;
    const el = chatRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [phase, promptChars, codeChars, cycleIdx, reducedMotion]);

  return (
    <>
      <section
        ref={sectionRef}
        id="ai-playground"
        aria-labelledby="ai-playground-heading"
        className="relative py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-bg-base"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-6 lg:px-8">
          <h3 className="sr-only">
            How the Chumlab AI Playground works: chat, code, live preview
          </h3>

          {/* ── HEADING BLOCK (above the demo) ─────────────────────────── */}
          <div className="mb-10 sm:mb-12 lg:mb-14 max-w-[720px]">
            <Reveal delay={50} translateY={12} duration={200}>
              <h2
                id="ai-playground-heading"
                className="font-sans text-[clamp(32px,6vw,72px)] font-medium tracking-[-0.04em] leading-[1.0] text-fg"
              >
                Watch a component
                <br />
                come to{" "}
                <em className="font-serif italic font-normal text-accent">
                  life.
                </em>
              </h2>
            </Reveal>

            <Reveal delay={100} translateY={8} duration={200}>
              <p className="font-sans text-base sm:text-lg text-fg-secondary leading-[1.55] mt-5 sm:mt-6 max-w-[560px]">
                See how Chumlab AI takes a prompt or a screenshot and ships
                production ready code in seconds. Three real examples on autoplay
                below.
              </p>
            </Reveal>
          </div>

          {/* ── BROWSER WINDOW DEMO ────────────────────────────────────── */}
          <Reveal
            delay={150}
            translateY={0}
            duration={300}
            scale={0.97}
            className="relative w-full mb-14 sm:mb-16 lg:mb-20"
          >
            <div
              role="img"
              aria-label="Animated chat demo of the Chumlab AI Playground turning prompts into React components"
              className="relative bg-bg-elevated border border-border-faint rounded-xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6),inset_0_0_0_0.5px_var(--border-faint)]"
            >
              {/* Browser chrome — unchanged */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-border-faint bg-gradient-to-b from-fg/[0.02] to-transparent">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-fg/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-fg/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-fg/15" />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1 rounded-md bg-bg-base border border-border-faint font-mono text-[11px] text-fg-secondary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3 h-3 text-fg-muted shrink-0"
                    aria-hidden
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2Z" />
                  </svg>
                  <span className="truncate">chumlab.ai/playground</span>
                </div>
              </div>

              {/* Chat header */}
              <div className="flex items-center justify-center gap-2.5 py-3 border-b border-border-faint">
                <div className="relative shrink-0">
                  <div className="w-7 h-7 rounded-full bg-bg-base border border-border-soft flex items-center justify-center overflow-hidden">
                    <img
                      src={logoSmall}
                      alt="Chumlab AI"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4ade80] border-2 border-[#0a0d12]"
                  />
                </div>
                <span className="font-sans text-[14px] font-medium text-fg">
                  Chumlab AI
                </span>
                <span aria-hidden className="text-fg-muted">
                  ·
                </span>
                <span
                  className={`font-mono text-[11px] ${
                    statusLabel === "Ready"
                      ? "text-[#4ade80]"
                      : "text-accent"
                  }`}
                >
                  {statusLabel}
                </span>
              </div>

              {/* Chat conversation */}
              <div
                ref={chatRef}
                className="scrollbox px-5 sm:px-7 py-6 sm:py-7 min-h-[460px] md:min-h-[540px] max-h-[640px] overflow-y-auto flex flex-col gap-4"
              >
                {/* Persistent AI greeting — never cleared. */}
                <AIMessage>
                  <div className="inline-block max-w-[88%] bg-bg-base border border-border-faint rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="font-sans text-[14px] text-fg leading-[1.55]">
                      Hey, I&rsquo;m{" "}
                      <span className="text-accent font-medium">
                        Chumlab AI
                      </span>
                      . Describe a component or drop a screenshot, and
                      I&rsquo;ll write production ready React using Chumlab
                      primitives.
                    </p>
                  </div>
                </AIMessage>

                {/* Cycle-scoped messages — keyed by cycle.id so the whole
                    block fades out then remounts fresh on each cycle. */}
                <div
                  key={cycle.id}
                  className={`flex flex-col gap-4 transition-[opacity,filter] duration-700 ${fadeContentClass}`}
                >
                  {/* User message — mounts at `sendBeat` (after the prompt
                      finishes typing into the input field). Avatar on the
                      right, bubble flush against it. */}
                  {showUserBubble && (
                    <UserMessage>
                      {cycle.type === "screenshot" && Skeleton ? (
                        <div className="bg-accent/[0.12] border border-accent/25 rounded-2xl rounded-tr-sm p-2.5">
                          <Skeleton />
                          <p className="font-sans text-[13px] text-fg leading-[1.5] px-1.5 pt-1.5 pb-1">
                            {cycle.userPrompt}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-accent/[0.12] border border-accent/25 rounded-2xl rounded-tr-sm px-4 py-2.5">
                          <p className="font-sans text-[14px] text-fg leading-[1.5]">
                            {cycle.userPrompt}
                          </p>
                        </div>
                      )}
                    </UserMessage>
                  )}

                  {/* Thinking indicator */}
                  {showThinking && (
                    <AIMessage>
                      <div className="bg-bg-base border border-border-faint rounded-2xl rounded-tl-sm px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <span
                            aria-hidden
                            className="w-1.5 h-1.5 rounded-full bg-fg/40 motion-safe:animate-bounce"
                            style={{ animationDelay: "0s" }}
                          />
                          <span
                            aria-hidden
                            className="w-1.5 h-1.5 rounded-full bg-fg/40 motion-safe:animate-bounce"
                            style={{ animationDelay: "0.15s" }}
                          />
                          <span
                            aria-hidden
                            className="w-1.5 h-1.5 rounded-full bg-fg/40 motion-safe:animate-bounce"
                            style={{ animationDelay: "0.3s" }}
                          />
                        </div>
                      </div>
                    </AIMessage>
                  )}

                  {/* AI intro — short customised text response per cycle.
                      Mounts at `aiIntro` phase and stays visible through
                      the rest of the cycle. */}
                  {showAIIntro && (
                    <AIMessage>
                      <div className="inline-block max-w-[88%] bg-bg-base border border-border-faint rounded-2xl rounded-tl-sm px-4 py-2.5">
                        <p className="font-sans text-[14px] text-fg leading-[1.5]">
                          {cycle.aiIntro}
                        </p>
                      </div>
                    </AIMessage>
                  )}

                  {/* Plan card */}
                  {showPlan && (
                    <AIMessage>
                      <div className="inline-block max-w-[92%] min-w-[280px] sm:min-w-[320px] bg-bg-base border border-border-faint rounded-2xl rounded-tl-sm overflow-hidden">
                        <div className="px-3.5 py-2 border-b border-border-faint flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3.5 h-3.5 text-accent"
                              aria-hidden
                            >
                              <path d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z" />
                            </svg>
                            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-secondary">
                              Task plan
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-fg-tertiary">
                            {completedTaskCount(phase, cycle.tasks.length)} /{" "}
                            {cycle.tasks.length}
                          </span>
                        </div>
                        <ul className="m-0 p-0 list-none">
                          {cycle.tasks.map((task, i) => {
                            const state = taskState(i, phase);
                            return (
                              <li
                                key={task.label}
                                className="flex items-center justify-between px-3.5 py-2 border-b border-border-faint last:border-b-0 gap-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    aria-hidden
                                    className={`w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center ${
                                      state === "pending"
                                        ? "border border-border-active"
                                        : state === "active"
                                          ? "border border-accent bg-accent/30 motion-safe:animate-pulse"
                                          : "bg-[#4ade80]"
                                    }`}
                                  >
                                    {state === "done" && (
                                      <svg
                                        viewBox="0 0 24 24"
                                        fill="var(--bg-base)"
                                        className="w-2 h-2"
                                        aria-hidden
                                      >
                                        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z" />
                                      </svg>
                                    )}
                                  </span>
                                  <span
                                    className={`font-sans text-[13px] truncate ${
                                      state === "pending"
                                        ? "text-fg-secondary"
                                        : state === "active"
                                          ? "text-fg"
                                          : "text-fg-tertiary line-through"
                                    }`}
                                  >
                                    {task.label}
                                  </span>
                                </div>
                                <span className="font-mono text-[10px] text-fg-tertiary px-1.5 py-0.5 rounded border border-border-faint bg-bg-elevated shrink-0">
                                  {task.tag}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </AIMessage>
                  )}

                  {/* Code card */}
                  {showCode && (
                    <AIMessage>
                      <div className="inline-block max-w-full w-full bg-bg-base border border-border-faint rounded-2xl rounded-tl-sm overflow-hidden">
                        <div className="px-3.5 py-2 border-b border-border-faint flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3.5 h-3.5 text-accent shrink-0"
                              aria-hidden
                            >
                              <path d="M9.4 16.6 4.8 12l4.6-4.6a1 1 0 1 0-1.4-1.4l-5.3 5.3a1 1 0 0 0 0 1.4l5.3 5.3a1 1 0 1 0 1.4-1.4Zm5.2 0 4.6-4.6-4.6-4.6a1 1 0 1 1 1.4-1.4l5.3 5.3a1 1 0 0 1 0 1.4l-5.3 5.3a1 1 0 1 1-1.4-1.4Z" />
                            </svg>
                            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-secondary shrink-0">
                              {phase === "codeStream" ? "Streaming" : "Code"}
                            </span>
                            <span aria-hidden className="text-fg-muted">
                              ·
                            </span>
                            <span className="font-mono text-[10px] text-fg-secondary truncate">
                              {cycle.filename}
                            </span>
                          </div>
                          <span
                            aria-hidden
                            className="text-fg-tertiary shrink-0"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3.5 h-3.5"
                              aria-hidden
                            >
                              <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
                            </svg>
                          </span>
                        </div>
                        <div className="px-3.5 py-3 font-mono text-[11px] md:text-[12px] leading-[1.65] overflow-x-auto">
                          {renderCode(cycle.code, codeChars)}
                        </div>
                      </div>
                    </AIMessage>
                  )}

                  {/* Preview card */}
                  {showPreview && (
                    <AIMessage>
                      <div className="preview-anim inline-block max-w-full w-full bg-bg-base border border-border-faint rounded-2xl rounded-tl-sm overflow-hidden">
                        <div className="px-3.5 py-2 border-b border-border-faint flex items-center gap-2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3.5 h-3.5 text-[#4ade80]"
                            aria-hidden
                          >
                            <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm4.768 8.64-5.5 5.5a1 1 0 0 1-1.414 0l-2.5-2.5a1 1 0 1 1 1.414-1.414l1.793 1.793 4.793-4.793a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-secondary">
                            Preview
                          </span>
                          <span aria-hidden className="text-fg-muted">
                            ·
                          </span>
                          <span className="font-mono text-[10px] text-[#4ade80]">
                            live
                          </span>
                        </div>
                        <div className="px-5 py-6 sm:px-6 sm:py-7 flex items-center justify-center min-h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(91,155,255,0.04),transparent_70%)]">
                          <PreviewComponent />
                        </div>
                      </div>
                    </AIMessage>
                  )}
                </div>
              </div>

              {/* Input area — the prompt for the active cycle types into
                  this field char-by-char during the `inputTyping` phase,
                  then the field clears (placeholder reappears) when the
                  user-message bubble mounts above. */}
              <div className="px-4 sm:px-5 py-3 border-t border-border-faint flex items-center gap-2">
                <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-base border border-border-faint">
                  {showInputTyping ? (
                    <span className="font-sans text-[13px] text-fg truncate">
                      {cycle.userPrompt.slice(0, promptChars)}
                      <span
                        aria-hidden
                        className="inline-block w-[2px] h-[14px] bg-accent align-text-bottom animate-cursor ml-0.5"
                      />
                    </span>
                  ) : (
                    <span className="font-sans text-[13px] text-fg-tertiary truncate">
                      Describe a component or drop a screenshot...
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Upload attachment"
                  className="w-9 h-9 rounded-lg bg-fg/[0.06] hover:bg-fg/[0.10] border border-border-soft hover:border-border-active flex items-center justify-center transition-colors shrink-0"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-[18px] h-[18px] text-fg-secondary"
                    aria-hidden
                  >
                    <path d="M16.5 6.5v10.25a4.75 4.75 0 0 1-9.5 0V5.5a3.25 3.25 0 0 1 6.5 0v10.5a1.75 1.75 0 0 1-3.5 0V6.5a.75.75 0 0 0-1.5 0v9.5a3.25 3.25 0 0 0 6.5 0V5.5a4.75 4.75 0 0 0-9.5 0v11.25a6.25 6.25 0 0 0 12.5 0V6.5a.75.75 0 0 0-1.5 0Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Send"
                  data-state={sendState}
                  className="ai-send-btn w-9 h-9 rounded-lg bg-accent hover:bg-[#7eb1ff] flex items-center justify-center transition-colors shrink-0"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ai-send-icon w-[20px] h-[20px] text-bg-base"
                    aria-hidden
                  >
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z M19 14L19.6 16.4L22 17L19.6 17.6L19 20L18.4 17.6L16 17L18.4 16.4L19 14Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Subtle radial glow under the window — desktop only */}
            <div
              aria-hidden
              className="hidden md:block absolute -inset-x-20 -bottom-12 h-32 bg-[radial-gradient(ellipse_at_center,rgba(91,155,255,0.08),transparent_70%)] pointer-events-none"
            />
          </Reveal>

          {/* ── BELOW-DEMO BLOCK ─────────────────────────────────────── */}
          <div className="max-w-[640px]">
            <h2 className="font-sans text-[clamp(36px,5.5vw,64px)] font-medium tracking-[-0.04em] leading-[1.0] text-fg">
              Describe a component.
              <br />
              Get{" "}
              <em className="font-serif italic font-normal text-accent">
                production code
              </em>
              .
            </h2>

            <p className="font-sans text-[15px] sm:text-[16px] text-fg-secondary leading-[1.55] mt-5 max-w-[560px]">
              Type a prompt, drop a screenshot, or paste a UI you&rsquo;ve
              already designed. The playground writes typed React using your
              Chumlab primitives accessibility, theme tokens, and edge cases
              handled. From idea to production ready code in a single paste.
            </p>

            <Button
              variant="primary"
              size="md"
              onClick={enterPlayground}
              className="group mt-7 sm:mt-8"
              endIcon={
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              }
            >
              Try the AI Playground
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Shared message wrappers ──────────────────────────────────────────────

function AIMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 msg">
      <div className="relative shrink-0 mt-1">
        <div className="w-7 h-7 rounded-full bg-bg-base border border-border-soft flex items-center justify-center overflow-hidden">
          <img
            src={logoSmall}
            alt=""
            aria-hidden
            className="w-5 h-5 object-contain"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// Mirror of `AIMessage` for user messages — bubble pinned to the right,
// filled person avatar to its right.
function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-end gap-2.5 msg">
      <div className="min-w-0 max-w-[calc(100%-2.625rem)] sm:max-w-[80%] flex justify-end">
        {children}
      </div>
      <div className="relative shrink-0 mt-1">
        <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden
          >
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
