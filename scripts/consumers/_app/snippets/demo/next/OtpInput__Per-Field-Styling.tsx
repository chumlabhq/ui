import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  return (
    <OtpInput
                length={4}
                inputClassNames={[
                  `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-error text-cl-error focus:border-cl-error focus:ring-2 focus:ring-cl-error/20 dark:bg-cl-bg-elevated dark:border dark:border-cl-error dark:text-cl-error dark:focus:border-cl-error dark:focus:ring-2 dark:focus:ring-cl-error/20`,
                  `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-warning text-cl-warning focus:border-cl-warning focus:ring-2 focus:ring-cl-warning/20 dark:bg-cl-bg-elevated dark:border dark:border-cl-warning dark:text-cl-warning dark:focus:border-cl-warning dark:focus:ring-2 dark:focus:ring-cl-warning/20`,
                  `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-success text-cl-success focus:border-cl-success focus:ring-2 focus:ring-cl-success/20 dark:bg-cl-bg-elevated dark:border dark:border-cl-success dark:text-cl-success dark:focus:border-cl-success dark:focus:ring-2 dark:focus:ring-cl-success/20`,
                  `w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input-focus text-cl-accent focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 dark:bg-cl-bg-elevated dark:border dark:border-cl-border-input-focus dark:text-cl-accent dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20`
                ]}
                classes={{ control: "flex items-center gap-2" }}
              />
  );
}
