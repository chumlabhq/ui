import { useState } from "react";
import { Button } from "@chumlab/ui/button";

export default function ButtonExample() {
  const [loading, setLoading] = useState(false);
  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };
  return (
    <>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:shadow-accent/20 focus-visible:ring-offset-cl-bg"
        loading={loading}
        loadingText="Processing..."
        onClick={simulateLoading}
      >
        Click to Load
      </Button>
      <p className="text-sm text-cl-text-secondary">
        {loading ? "Loading for 2 seconds..." : "Click the button"}
      </p>
    </>
  );
}
