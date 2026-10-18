"use client";

import { Button } from "@chumlab/ui/button";
import { Input } from "@chumlab/ui/input";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <form
      data-demo-recipe="toast-after-submit"
      className="w-full sm:max-w-sm space-y-4"
      onSubmit={
        (event) => {
          event.preventDefault();
          const email = String(new FormData(event.currentTarget).get("email") ?? "");
          toast.success(`Subscribed ${email}`, { description: "The first issue arrives on Monday." });
        }
      }
    >
      <Input name="email" type="email" label="Email" required placeholder="you@example.com" />
      <Button type="submit" className="bg-cl-text text-cl-bg hover:opacity-90">
        Subscribe
      </Button>
    </form>
  );
}

export default function ToastExample() {
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}
