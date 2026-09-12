import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-success text-cl-bg hover:bg-cl-success dark:bg-cl-success dark:text-cl-bg dark:hover:bg-cl-success"
        onClick={
          () =>
          toast.success("File uploaded", {
            description:
              "Your file has been successfully uploaded to the server."
          })
        }
      >
        Success with Description
      </button>
      <button
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
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-warning text-cl-bg hover:bg-cl-warning dark:bg-cl-warning dark:text-cl-bg dark:hover:bg-cl-warning"
        onClick={
          () =>
          toast.warning("Session expiring", {
            description:
              "Your session will expire in 5 minutes. Please save your work."
          })
        }
      >
        Warning with Description
      </button>
    </>
  );
}
