import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
        onClick={() => toast.toast("Simple string message")}
      >
        String Shorthand
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            type: "success",
            message: "Full config",
            description: "Using toast() with object config",
            duration: 4000,
            showProgress: true
          })
        }
      >
        Object Config
      </button>
    </>
  );
}
