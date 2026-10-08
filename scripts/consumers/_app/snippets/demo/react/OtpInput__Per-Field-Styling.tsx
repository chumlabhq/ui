import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  return (
    <OtpInput
      length={4}
      inputClassNames={
        [
          "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-error text-cl-error focus:border-cl-error focus:ring-2 focus:ring-cl-error/20 dark:border dark:focus:ring-2",
          "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-warning text-cl-warning focus:border-cl-warning focus:ring-2 focus:ring-cl-warning/20 dark:border dark:focus:ring-2",
          "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-success text-cl-success focus:border-cl-success focus:ring-2 focus:ring-cl-success/20 dark:border dark:focus:ring-2",
          "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input-focus text-cl-accent focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 dark:border dark:focus:ring-2"
        ]
      }
      classes={{ control: "flex items-center gap-2" }}
    />
  );
}
