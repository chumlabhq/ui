import { ToastProvider, useToast } from "@chumlab/ui/toast";

export default function App() {
  return (
    <ToastProvider>
      <MyComponent />
    </ToastProvider>
  );
}

function MyComponent() {
  const toast = useToast();
  return (
    <button onClick={() => toast.success("Saved successfully!")}>
      Save
    </button>
  );
}
