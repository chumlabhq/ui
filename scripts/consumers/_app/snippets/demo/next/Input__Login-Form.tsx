"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Checkbox } from "@chumlab/ui/checkbox";
import { Input } from "@chumlab/ui/input";

const EyeIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const LockIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function InputExample() {
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSubmit, setLoginSubmit] = useState("not fired yet");
  const [forgotNote, setForgotNote] = useState<string | null>(null);
  return (
    <>
      <form
        onSubmit={
          (e) => {
            e.preventDefault();
            setLoginSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
          }
        }
        className="w-full sm:max-w-sm space-y-5"
      >
        <div className="text-center space-y-1 mb-8">
          <h3 className="text-xl font-semibold tracking-tight text-cl-text">Welcome back</h3>
          <p className="text-sm text-cl-text-tertiary">Sign in to continue</p>
        </div>
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          startIcon={<MailIcon className="text-cl-text-tertiary" />}
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }
          }
        />
        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          placeholder="Enter password"
          required
          startIcon={<LockIcon className="text-cl-text-tertiary" />}
          endIcon={
            showPw ? (
              <EyeOffIcon className="text-cl-text-tertiary hover:text-cl-text-secondary" />
            ) : (
              <EyeIcon className="text-cl-text-tertiary hover:text-cl-text-secondary" />
            )
          }
          onEndIconClick={() => setShowPw(!showPw)}
          endIconLabel={showPw ? "Hide" : "Show"}
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }
          }
        />
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onValueChange={setRememberMe}
            size="sm"
          />
          <Button
            type="button"
            size="sm"
            className="bg-transparent text-cl-accent hover:bg-cl-accent-bg hover:text-cl-accent-hover"
            onClick={() => setForgotNote("Password reset link sent (demo)")}
          >
            Forgot?
          </Button>
        </div>
        <Button type="submit" fullWidth className="bg-cl-text text-cl-bg hover:opacity-90">
          Sign In
        </Button>
      </form>
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onSubmit:
        {loginSubmit}
        {
          forgotNote && (
            <div role="status">
              Forgot?:
              {forgotNote}
            </div>
          )
        }
      </div>
    </>
  );
}
