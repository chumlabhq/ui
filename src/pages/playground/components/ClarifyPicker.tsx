import { useState } from "react";
import PgButton from "./PgButton";
import type { ClarifyQuestion } from "../types";

interface ClarifyPickerProps {
  questions: ClarifyQuestion[];
  // "page_scope" (Phase 11) renders the scope-guard capability message + a
  // tap-to-build component picker instead of the ordinary questions form.
  reason?: string;
  // answers[i] is the chosen option for questions[i], or undefined if unanswered.
  onSubmit: (answers: (string | undefined)[]) => void;
  onSkip: () => void;
}

export default function ClarifyPicker({ questions, reason, onSubmit, onSkip }: ClarifyPickerProps) {
  const [answers, setAnswers] = useState<(string | undefined)[]>(() =>
    questions.map(() => undefined)
  );

  const choose = (qi: number, option: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = next[qi] === option ? undefined : option;
      return next;
    });
  };

  // Page-scope guard: the message is a capability explanation and each option is
  // a component to build — tapping one starts the build immediately (no Skip;
  // "Build the main section anyway" is one of the options).
  // Any Router-driven outcome (page / multi_component / vague / ambiguous_term /
  // forking_decision / no_target_edit / non_ui) renders one message + tap-to-
  // build options. No Skip — the "build anyway" escape is one of the options.
  if (reason) {
    const q = questions[0];
    const isScope = reason === "page" || reason === "page_scope" || reason === "multi_component";
    return (
      <div className="rule rounded-lg bg-bg-elevated p-4">
        <p className="eyebrow">
          {isScope ? "Let's start with one component" : "One quick question"}
        </p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-secondary">
          {q?.question}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {q?.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSubmit([option])}
              className="rounded-lg border border-border-soft px-3 py-1.5 text-sm text-fg-secondary transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rule rounded-lg bg-bg-elevated p-4">
      <p className="eyebrow">A couple of questions</p>
      <p className="mt-1 text-sm text-fg-secondary">
        Tap to answer, or skip and I&apos;ll use sensible defaults.
      </p>

      <div className="mt-4 space-y-4">
        {questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm font-medium text-fg">{q.question}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((option) => {
                const selected = answers[qi] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(qi, option)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border-soft text-fg-secondary hover:border-border-active hover:text-fg"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <PgButton variant="primary" size="sm" onClick={() => onSubmit(answers)}>
          Build with these
        </PgButton>
        <PgButton variant="ghost" size="sm" onClick={onSkip}>
          Skip
        </PgButton>
      </div>
    </div>
  );
}
