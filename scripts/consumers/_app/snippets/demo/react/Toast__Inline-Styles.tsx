import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "info",
            message: "Custom shadow",
            description: "Using style prop for box-shadow",
            style: {
              boxShadow: "0 10px 40px rgba(59, 130, 246, 0.5)"
            }
          })
        }
      >
        Custom Shadow
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "success",
            message: "Custom width",
            description: "This toast has a wider minimum width",
            style: {
              minWidth: "400px"
            }
          })
        }
      >
        Custom Width
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "warning",
            message: "Gradient background",
            description: "Using style for gradient",
            style: {
              background:
                "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              border: "none"
            }
          })
        }
      >
        Gradient Background
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
