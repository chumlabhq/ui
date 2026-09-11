"use client";

import { useState } from "react";
import { TextArea } from "@chumlab/ui/textarea";

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

export default function TextAreaExample() {
  const [feedback2, setFeedback2] = useState("");
  return (
    <form
      onSubmit={
        (e) => {
          e.preventDefault();
          alert("Message sent!");
        }
      }
      className="w-full max-w-md space-y-4"
    >
      <div className="text-center space-y-1 mb-6">
        <h3 className="text-xl font-semibold tracking-tight text-cl-text">Get in touch</h3>
        <p className="text-sm text-cl-text-tertiary">We'd love to hear from you</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="contact-name"
            className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary"
          >
            Name
          </label>
          <input
            id="contact-name"
            placeholder="John Doe"
            required
            className="px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm transition-all duration-150 bg-white border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 dark:bg-cl-text/4 dark:border dark:border-cl-text/10 dark:text-white dark:placeholder:text-cl-text-tertiary dark:focus:ring-2 dark:focus:ring-cl-accent/30"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="contact-email"
            className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            required
            className="px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm transition-all duration-150 bg-white border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 dark:bg-cl-text/4 dark:border dark:border-cl-text/10 dark:text-white dark:placeholder:text-cl-text-tertiary dark:focus:ring-2 dark:focus:ring-cl-accent/30"
          />
        </div>
      </div>
      <TextArea
        label="Message"
        placeholder="How can we help?"
        required
        rows={5}
        maxLength={500}
        showCount
        clearable
        value={feedback2}
        onChange={(e) => setFeedback2(e.target.value)}
        onClear={() => setFeedback2("")}
        startIcon={<MailIcon className="text-cl-text-tertiary" />}
        classes={
          {
            control: "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50",
            input: "w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-disabled",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            message: "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
        className="flex flex-col"
      />
      <button
        type="submit"
        className="w-full py-2.5 rounded-cl-lg font-medium text-sm text-cl-bg transition-all bg-cl-text text-cl-bg hover:opacity-90 shadow-lg shadow-accent/20 cursor-pointer"
      >
        Send Message
      </button>
    </form>
  );
}
