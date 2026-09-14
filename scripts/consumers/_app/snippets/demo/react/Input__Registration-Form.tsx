import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Input } from "@chumlab/ui/input";

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

const AlertIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
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

const wrapperFor = (err: boolean, ok: boolean) =>
    err ? "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-error shadow-sm shadow-danger/0.04 focus-within:ring-2 focus-within:ring-cl-error/15 dark:border dark:border-cl-error/40 dark:focus-within:ring-2 dark:focus-within:ring-cl-error/25" : ok ? "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-success shadow-sm shadow-success/0.04 focus-within:ring-2 focus-within:ring-cl-success/15 dark:border dark:border-cl-success/40 dark:focus-within:ring-2 dark:focus-within:ring-cl-success/25" : "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50";

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function InputExample() {
  const [registrationSubmit, setRegistrationSubmit] = useState("not fired yet");
  const [username2, setUsername2] = useState("");
  const [email2, setEmail2] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const emailOk = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailBad = email.length > 0 && !emailOk;
  const userOk = username.length >= 3;
  const userBad = username.length > 0 && username.length < 3;
  return (
    <>
      <form
        onSubmit={
          (e) => {
            e.preventDefault();
            setRegistrationSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
          }
        }
        className="w-full sm:max-w-md space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="firstName"
            label="First name"
            placeholder="John"
            required
            classes={
              {
                root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
                input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
                label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
                prefix: "text-sm select-none text-cl-text-tertiary",
                suffix: "text-sm select-none text-cl-text-tertiary",
                count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
              }
            }
          />
          <Input
            name="lastName"
            label="Last name"
            placeholder="Doe"
            required
            classes={
              {
                root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
                input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
                label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
                prefix: "text-sm select-none text-cl-text-tertiary",
                suffix: "text-sm select-none text-cl-text-tertiary",
                count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
              }
            }
          />
        </div>
        <Input
          label="Username"
          placeholder="johndoe"
          required
          prefix="@"
          clearable
          maxLength={20}
          showCount
          name="username"
          onClear={() => setUsername2("")}
          value={username2}
          onChange={(e) => setUsername2(e.target.value)}
          success={userOk}
          successMessage={
            <>
              <CheckIcon />
              Available
            </>
          }
          error={userBad}
          errorMessage="Min 3 characters"
          classes={
            { ...({
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }), control: wrapperFor(userBad, userOk) }
          }
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          startIcon={<MailIcon className="text-cl-text-tertiary" />}
          clearable
          name="email"
          onClear={() => setEmail2("")}
          value={email2}
          onChange={(e) => setEmail2(e.target.value)}
          success={emailOk}
          successMessage={
            <>
              <CheckIcon />
              Valid
            </>
          }
          error={emailBad}
          errorMessage={
            <>
              <AlertIcon />
              Invalid format
            </>
          }
          classes={
            { ...({
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }), control: wrapperFor(emailBad, emailOk) }
          }
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min 8 characters"
          required
          startIcon={<LockIcon className="text-cl-text-tertiary" />}
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }
          }
        />
        <Input
          name="website"
          label="Website"
          placeholder="yoursite"
          prefix="https://"
          suffix=".com"
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }
          }
        />
        <Button
          type="submit"
          fullWidth
          className="bg-cl-text text-cl-bg hover:opacity-90 shadow-lg shadow-accent/20"
        >
          Create Account
        </Button>
      </form>
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onSubmit:
        {registrationSubmit}
      </div>
    </>
  );
}
