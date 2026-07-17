import { useState } from "react";
import { Button } from "../../../components/ui";
import type { ClarifyQuestion } from "../types";

interface ClarifyPickerProps {
  questions: ClarifyQuestion[];
  // answers[i] is the chosen option for questions[i], or undefined if unanswered.
  onSubmit: (answers: (string | undefined)[]) => void;
  onSkip: () => void;
}

export default function ClarifyPicker({ questions, onSubmit, onSkip }: ClarifyPickerProps) {
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
        <Button variant="primary" size="sm" onClick={() => onSubmit(answers)}>
          Build with these
        </Button>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Skip
        </Button>
      </div>
    </div>
  );
}
