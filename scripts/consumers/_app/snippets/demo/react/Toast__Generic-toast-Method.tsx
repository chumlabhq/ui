import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={() => toast.toast("Simple string message")}
      >
        String Shorthand
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "success",
            message: "Full config",
            description: "Using toast() with object config",
            duration: 4000,
            showProgress: true
          })
        }
      >
        Object Config
      </Button>
    </>
  );
}

export default function ToastExample() {
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}
