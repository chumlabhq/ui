import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Localized close label", {
            description: "The close button has a custom aria-label",
            closeAriaLabel: "Dismiss this notification"
          })
        }
      >
        Custom closeAriaLabel
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Spanish label", {
            description:
              "El boton de cierre tiene una etiqueta personalizada",
            closeAriaLabel: "Cerrar notificacion"
          })
        }
      >
        i18n Example (Spanish)
      </button>
    </>
  );
}
