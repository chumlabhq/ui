import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Input } from "@chumlab/ui/input";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [checkoutSubmit, setCheckoutSubmit] = useState("not fired yet");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState<PhoneNumberData | undefined>();
  return (
    <>
      <form
        className="w-full sm:max-w-md space-y-4"
        onSubmit={
          (e) => {
            e.preventDefault();
            setCheckoutSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
          }
        }
      >
        <Input
          id="checkout-name"
          name="checkout_name"
          label="Full Name"
          required
          value={checkoutName}
          onValueChange={setCheckoutName}
          placeholder="John Doe"
          classes={
            {
              root: "flex flex-col gap-1",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              control: "h-10 px-3 rounded-cl-md border bg-transparent transition-all duration-150 border-cl-border-input bg-white focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-cl-border-input-focus dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50",
              input: "text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary"
            }
          }
        />
        <Input
          id="checkout-email"
          name="checkout_email"
          type="email"
          label="Email"
          required
          value={checkoutEmail}
          onValueChange={setCheckoutEmail}
          placeholder="john@example.com"
          classes={
            {
              root: "flex flex-col gap-1",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              control: "h-10 px-3 rounded-cl-md border bg-transparent transition-all duration-150 border-cl-border-input bg-white focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-cl-border-input-focus dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50",
              input: "text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary"
            }
          }
        />
        <InternationalPhoneInput
          name="checkout_phone"
          label="Phone Number"
          required
          value={checkoutPhone}
          onValueChange={setCheckoutPhone}
          enablePasteDetection
          classes={
            {
              root: "flex flex-col gap-1",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50 dark:[color-scheme:dark]",
              countrySelect: {
                       trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-white hover:bg-cl-bg-hover text-cl-text dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:hover:bg-cl-text/6 dark:text-cl-text-secondary",
                       content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-text/10",
                       searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-text/10",
                       searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary",
                       list: "max-h-60 overflow-y-auto",
                       item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/6 dark:data-[focused]:bg-cl-text/10 dark:text-cl-text-secondary",
                       icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                       itemIndicator: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
                       searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                       empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                     }
            }
          }
        />
        <Button
          type="submit"
          fullWidth
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        >
          Complete Checkout
        </Button>
      </form>
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onSubmit:
        {checkoutSubmit}
      </div>
    </>
  );
}
