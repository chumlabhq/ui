import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Input } from "@chumlab/ui/input";
import { TextArea } from "@chumlab/ui/textarea";

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
        <Input
          label="Name"
          id="contact-name"
          placeholder="John Doe"
          required
          classes={
            {
              root: "flex flex-col",
              label: "block text-[13px] font-medium mb-1.5 text-cl-text-chrome"
            }
          }
        />
        <Input
          label="Email"
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          required
          classes={
            {
              root: "flex flex-col",
              label: "block text-[13px] font-medium mb-1.5 text-cl-text-chrome"
            }
          }
        />
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
        classes={
          {
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50",
            input: "w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-tertiary",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            /* No colour here on purpose. The library paints this slot
               `data-[invalid]:text-cl-error data-[valid]:text-cl-success`; a plain
               colour token drops both variants and then only the last one survives,
               which is how every error message on this page rendered green. */
            message: "text-xs mt-1.5 flex items-center gap-1.5",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
        className="flex flex-col"
      />
      <Button type="submit" fullWidth className="bg-cl-text text-cl-bg hover:opacity-90">
        Send Message
      </Button>
    </form>
  );
}
