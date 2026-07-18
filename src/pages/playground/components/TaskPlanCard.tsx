import type { PipelineTier } from "../types";

interface PlanSection {
  title: string;
  body: string;
}

// The plan stage streams markdown with ## sections (Inventory / Structure /
// States / Subtasks). Parsed leniently - anything before the first heading
// or a plan with no headings at all renders as plain text.
function parseSections(text: string): { intro: string; sections: PlanSection[] } {
  const lines = text.split("\n");
  const sections: PlanSection[] = [];
  const intro: string[] = [];
  let current: PlanSection | null = null;

  for (const line of lines) {
    const heading = /^##\s+(.+)$/.exec(line);
    if (heading) {
      current = { title: heading[1].trim(), body: "" };
      sections.push(current);
      continue;
    }
    if (current) current.body += (current.body ? "\n" : "") + line;
    else intro.push(line);
  }

  return { intro: intro.join("\n").trim(), sections };
}

interface TaskPlanCardProps {
  plan: string;
  streaming?: boolean;
  tier?: PipelineTier | null;
}

export default function TaskPlanCard({ plan, streaming = false, tier }: TaskPlanCardProps) {
  const { intro, sections } = parseSections(plan);

  return (
    <div className="rule rounded-lg border-border-faint bg-bg-elevated px-4 py-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium tracking-[-0.01em]">Build plan</span>
        <span className="font-mono text-[11px] uppercase tracking-wide text-fg-tertiary">
          {streaming ? "planning" : (tier ?? "")}
        </span>
      </div>
      {intro && <p className="mt-2 whitespace-pre-wrap text-sm text-fg-secondary">{intro}</p>}
      {sections.map((section) => (
        <div key={section.title} className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            {section.title}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-fg-secondary">
            {section.body.trim()}
          </p>
        </div>
      ))}
      {streaming && <span className="animate-cursor text-accent">▎</span>}
    </div>
  );
}
