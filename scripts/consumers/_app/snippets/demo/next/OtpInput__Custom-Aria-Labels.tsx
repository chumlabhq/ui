import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  return (
    <OtpInput
                length={4}
                inputAriaLabel={(index, len) =>
                  `Code field ${index + 1} out of ${len}`
                }
                groupAriaLabel="Verification code entry"
                label="Custom a11y labels"
                classes={({
        group: "flex items-center gap-2",
        input: `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed`,
        label: `block text-sm font-medium mb-2 text-cl-text-secondary`,
        separator: `text-lg select-none text-cl-text-disabled`
      })}
              />
  );
}
