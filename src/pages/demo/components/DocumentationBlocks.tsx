import type { FC } from "react";
import { Section } from "./Section";

const cardClass = (isDarkMode: boolean) =>
  `rounded-2xl border p-5 ${isDarkMode ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`;

interface DocControlledPatternProps {
  isDarkMode: boolean;
  summary: string;
}

export const DocControlledPattern: FC<DocControlledPatternProps> = ({
  isDarkMode,
  summary,
}) => (
  <Section title="Controlled vs uncontrolled" isDarkMode={isDarkMode}>
    <div className={cardClass(isDarkMode)}>
      <p
        className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
      >
        {summary}
      </p>
    </div>
  </Section>
);

interface DocEdgeCasesProps {
  isDarkMode: boolean;
  items: string[];
}

export const DocEdgeCases: FC<DocEdgeCasesProps> = ({
  isDarkMode,
  items,
}) => (
  <Section
    title="Edge cases"
    description="Situations that need explicit handling in product code."
    isDarkMode={isDarkMode}
  >
    <div className={cardClass(isDarkMode)}>
      <ul
        className={`list-disc pl-5 space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </Section>
);

interface DocDoDontProps {
  isDarkMode: boolean;
  dos: string[];
  donts: string[];
}

export const DocDoDont: FC<DocDoDontProps> = ({
  isDarkMode,
  dos,
  donts,
}) => (
  <Section
    title="Do and don't"
    description="Practical guidance for production usage."
    isDarkMode={isDarkMode}
  >
    <div className={cardClass(isDarkMode)}>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}
          >
            Do
          </p>
          <ul
            className={`list-disc pl-5 space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {dos.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? "text-rose-400" : "text-rose-700"}`}
          >
            Don&apos;t
          </p>
          <ul
            className={`list-disc pl-5 space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {donts.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </Section>
);
