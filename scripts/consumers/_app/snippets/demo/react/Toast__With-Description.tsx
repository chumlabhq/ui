import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-success text-cl-bg hover:bg-cl-success"
        onClick={
          () =>
          toast.success("File uploaded", {
            description:
              "Your file has been successfully uploaded to the server."
          })
        }
      >
        Success with Description
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-error text-cl-bg hover:bg-cl-error/90"
        onClick={
          () =>
          toast.error("Upload failed", {
            description:
              "The file size exceeds the maximum limit of 10MB."
          })
        }
      >
        Error with Description
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-warning text-cl-bg hover:bg-cl-warning"
        onClick={
          () =>
          toast.warning("Session expiring", {
            description:
              "Your session will expire in 5 minutes. Please save your work."
          })
        }
      >
        Warning with Description
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
