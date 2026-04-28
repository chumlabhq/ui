import type { FC } from "react";
import { Section } from "./Section";

/**
 * Documentation cards rendered inside every demo (Controlled, Edge cases,
 * Do/Don't). All surfaces and text use brand tokens so they auto-theme
 * with the rest of the docs and read clean in both modes — the previous
 * `text-gray-600` body type rendered too washed out on the cream paper
 * surface in light mode.
 */
const cardClass = "rounded-2xl border border-border-faint bg-bg-elevated p-5";
const bodyClass = "text-sm leading-relaxed text-fg-secondary";
const eyebrowDoClass =
  "text-xs font-semibold uppercase tracking-wider mb-3 text-success";
const eyebrowDontClass =
  "text-xs font-semibold uppercase tracking-wider mb-3 text-danger";

interface DocControlledPatternProps {
  /** Kept for API compatibility — tokens auto-theme so this is unused. */
  isDarkMode?: boolean;
  summary: string;
}

export const DocControlledPattern: FC<DocControlledPatternProps> = ({
  summary,
}) => (
  <Section title="Controlled vs uncontrolled">
    <div className={cardClass}>
      <p className={bodyClass}>{summary}</p>
    </div>
  </Section>
);

interface DocEdgeCasesProps {
  isDarkMode?: boolean;
  items: string[];
}

export const DocEdgeCases: FC<DocEdgeCasesProps> = ({ items }) => (
  <Section
    title="Edge cases"
    description="Situations that need explicit handling in product code."
  >
    <div className={cardClass}>
      <ul className={`list-disc pl-5 space-y-2 ${bodyClass}`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </Section>
);

interface DocDoDontProps {
  isDarkMode?: boolean;
  dos: string[];
  donts: string[];
}

export const DocDoDont: FC<DocDoDontProps> = ({ dos, donts }) => (
  <Section
    title="Do and don't"
    description="Practical guidance for production usage."
  >
    <div className={cardClass}>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className={eyebrowDoClass}>Do</p>
          <ul className={`list-disc pl-5 space-y-2 ${bodyClass}`}>
            {dos.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className={eyebrowDontClass}>Don&apos;t</p>
          <ul className={`list-disc pl-5 space-y-2 ${bodyClass}`}>
            {donts.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </Section>
);
