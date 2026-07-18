// Raw pipeline/model errors → messages in the product's voice. Errors say
// what happened and what to do; no apologies, no raw JSON.
export function friendlyError(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (s.includes("output limit") || s.includes("max_tokens") || s.includes("too big")) {
    return "That build got too large to finish in one pass — try a narrower request or split it up.";
  }
  if (s.includes("overloaded") || s.includes("529") || s.includes("rate") || s.includes("busy")) {
    return "The AI is busy right now — give it a few seconds and try again.";
  }
  if (s.includes("quota") || s.includes("limit reached")) {
    return "You've used today's generations — they reset at midnight UTC.";
  }
  if (s.includes("network") || s.includes("failed to fetch") || s.includes("stream request failed")) {
    return "Lost the connection mid-build — check your network and try again.";
  }
  return "Something went wrong on that build — try again.";
}

// Parse the "## Deliberate simplifications" line from a streamed plan into a
// deliver-summary assumption.
export function assumptionsFromPlan(planText: string): string[] {
  if (!planText) return [];
  const match = planText.match(/##\s*Deliberate simplifications\s*\n+([\s\S]*?)(\n##|$)/i);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^[-*\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 2);
}

// The @chumlab/ui primitives a generated file imports, for "built with …".
export function primitivesFromCode(code: string): string[] {
  const found = new Set<string>();
  for (const m of code.matchAll(/from\s+["']@chumlab\/ui\/([a-z-]+)["']/g)) {
    const name = m[1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
    found.add(name);
  }
  return [...found];
}
