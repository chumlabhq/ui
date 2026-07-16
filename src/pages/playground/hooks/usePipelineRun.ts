import { useState } from "react";
import type { PipelineRunSummary } from "../types";

// Placeholder until Phase 3 persists runs; freezes the hook surface for consumers.
export function usePipelineRun() {
  const [run] = useState<PipelineRunSummary | null>(null);
  return { run };
}
