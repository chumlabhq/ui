import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  return (
    <>
      <OtpInput
        length={4}
        classes={
          {
                          ...({
            group: "flex items-center gap-2",
            input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed",
            label: "block text-sm font-medium mb-2 text-cl-text-secondary",
            separator: "text-lg select-none text-cl-text-tertiary"
          }),
                          input: "w-14 h-14 text-center text-xl font-bold rounded-full border-2 transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20"
                        }
        }
      />
      <OtpInput
        length={6}
        classes={
          {
                           ...({
             group: "flex items-center gap-2",
             input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed",
             label: "block text-sm font-medium mb-2 text-cl-text-secondary",
             separator: "text-lg select-none text-cl-text-tertiary"
           }),
                           control: "flex items-center gap-1.5",
          input: "w-9 h-9 text-center text-sm font-semibold rounded-cl-md transition-all focus:outline-none bg-white border border-cl-border text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20"
                         }
        }
      />
      <OtpInput
        length={6}
        classes={
          {
                          ...({
            group: "flex items-center gap-2",
            input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed",
            label: "block text-sm font-medium mb-2 text-cl-text-secondary",
            separator: "text-lg select-none text-cl-text-tertiary"
          }),
                          control: "flex items-center gap-3",
                          input: "w-10 h-12 text-center text-lg font-semibold border-0 border-b-2 rounded-none bg-transparent transition-all focus:outline-none border-cl-border-input text-cl-text focus:border-cl-border-input-focus dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus"
                        }
        }
      />
    </>
  );
}
