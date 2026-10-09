import { LinearLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-md">
      <LinearLoader className="text-cl-accent" trackColor="var(--cl-accent-bg)" />
      <LinearLoader className="text-cl-success" trackColor="var(--cl-success-bg)" />
      <LinearLoader className="text-cl-error" trackColor="var(--cl-error-bg)" />
    </div>
  );
}
