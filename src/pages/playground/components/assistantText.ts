export interface ParsedAssistantText {
  plan: string;
  code: string;
  phase: "planning" | "coding" | "complete";
}

// The develop prompt asks for a <plan> block followed by one ```tsx fence -
// two distinct streaming states for the UI. Recomputed per delta; the texts
// are small enough that incremental parsing isn't worth the state.
export function parseAssistantText(text: string): ParsedAssistantText {
  const fenceStart = text.indexOf("```tsx");
  const planStart = text.indexOf("<plan>");
  const planEnd = text.indexOf("</plan>");

  let plan = "";
  if (planStart !== -1) {
    plan = (planEnd !== -1 ? text.slice(planStart + 6, planEnd) : text.slice(planStart + 6)).trim();
  } else if (fenceStart === -1) {
    plan = text.trim();
  }

  let code = "";
  let closed = false;
  if (fenceStart !== -1) {
    const body = text.slice(fenceStart + 6).replace(/^\n/, "");
    const fenceEnd = body.indexOf("```");
    closed = fenceEnd !== -1;
    code = closed ? body.slice(0, fenceEnd) : body;
  }

  return {
    plan,
    code,
    phase: fenceStart === -1 ? "planning" : closed ? "complete" : "coding",
  };
}
