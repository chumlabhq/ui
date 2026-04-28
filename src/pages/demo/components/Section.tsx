import { cn } from "../../../utils/cn";

interface SectionProps {
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  /** Kept for API compatibility; deep-space tokens follow the parent .demo-light scope. */
  isDarkMode?: boolean;
}

/**
 * Section heading inside a demo page. Spec: 20-22 px font-medium, NOT a
 * clamp() — these are docs sub-headings, not marketing display type.
 * 12 px top margin between sections so each section reads as its own block.
 */
export const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
}) => (
  <section className="space-y-4 mt-12 first:mt-0">
    <div className="mb-2">
      <h2 className="font-sans font-medium text-cl-text text-[20px] sm:text-[22px] leading-[1.25] tracking-[-0.02em]">
        {title}
      </h2>
      {description && (
        <p className="font-sans text-[14px] text-cl-text-secondary leading-[1.6] mt-2 max-w-[680px]">
          {description}
        </p>
      )}
    </div>
    {children}
  </section>
);

interface DocsHeroProps {
  /** Eyebrow tag — uppercase, mono. Defaults to "Documentation". */
  eyebrow?: string;
  /** Main heading word(s). For component pages, just the component name. */
  title: string;
  /**
   * Optional second word rendered in the serif-italic accent style. Used by
   * narrative pages like "Getting *started.*". Component pages typically
   * pass just `title` and skip this.
   */
  accent?: string;
  /** Subtitle paragraph below the heading. */
  description: string;
  /** Optional import statement rendered as a code block under the subtitle. */
  code?: string;
}

/**
 * Hero block for every docs/demo page. Mirrors the Getting Started layout
 * exactly — eyebrow + hairline rule + large display heading + subtitle +
 * optional import code — so every component page reads as one family.
 */
export const DocsHero: React.FC<DocsHeroProps> = ({
  eyebrow = "Components",
  title,
  accent,
  description,
  code,
}) => (
  <header className="mb-12">
    <div className="eyebrow text-fg-tertiary mb-3">{eyebrow}</div>
    <div className="rule rule-t mb-8" />
    <h1
      className="font-sans font-medium text-fg mb-5 leading-[1.05]"
      style={{
        fontSize: "clamp(36px, 6vw, 56px)",
        letterSpacing: "-0.03em",
      }}
    >
      {title}
      {accent && (
        <>
          {" "}
          <span className="serif-accent">{accent}</span>
        </>
      )}
    </h1>
    <p className="text-[15px] sm:text-[15.5px] text-fg-secondary leading-[1.6] max-w-2xl">
      {description}
    </p>
    {code && (
      <div className="mt-8">
        <pre className="rounded-cl-lg border border-cl-border bg-cl-code-bg text-cl-code-text font-mono text-[12px] leading-[1.65] px-4 py-3 overflow-x-auto whitespace-pre-wrap break-all">
          <code>{code}</code>
        </pre>
      </div>
    )}
  </header>
);

interface CodeBlockProps {
  code: string;
  isDarkMode?: boolean;
}

/**
 * Compatibility alias — a thin wrapper that renders the spec-compliant
 * CodeFenced primitive (header + copy button). Existing demo imports of
 * `<CodeBlock>` keep working.
 */
import { CodeFenced } from "./primitives";
export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => (
  <CodeFenced code={code} />
);

interface DemoWrapperProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
  className?: string;
  layout?: "flex-row" | "flex-col" | "block" | "inline";
}

export const DemoWrapper: React.FC<DemoWrapperProps> = ({
  children,
  className = "",
  layout = "flex-row",
}) => {
  const layoutClasses =
    layout === "flex-row"
      ? "flex flex-col sm:flex-row flex-wrap items-stretch sm:items-start gap-4"
      : layout === "flex-col"
        ? "flex flex-col gap-4"
        : layout === "inline"
          ? "flex flex-row flex-wrap items-center gap-4"
          : "";

  return (
    <div
      className={cn(
        "relative rounded-cl-lg border border-cl-border bg-cl-bg-elevated overflow-hidden",
        className,
      )}
    >
      <div className={`p-4 sm:p-5 ${layoutClasses}`}>{children}</div>
    </div>
  );
};

interface DemoLabelProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const DemoLabel: React.FC<DemoLabelProps> = ({ children }) => (
  <p className="eyebrow text-fg-tertiary mb-3">{children}</p>
);

interface ComponentHeaderProps {
  title: string;
  description?: string;
  isDarkMode?: boolean;
}

export const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  title,
  description,
}) => (
  <div className="mb-10 pb-6 rule rule-b">
    <h1
      className="font-sans font-medium text-fg mb-3 leading-[1.05]"
      style={{
        fontSize: "clamp(36px, 5vw, 48px)",
        letterSpacing: "-0.03em",
      }}
    >
      {title}
    </h1>
    {description && (
      <p className="text-[15px] text-fg-secondary leading-[1.55] max-w-2xl">
        {description}
      </p>
    )}
  </div>
);

interface PropRowProps {
  name: string;
  type: string;
  defaultVal?: string;
  description?: string;
  isDarkMode?: boolean;
}

export const PropRow: React.FC<PropRowProps> = ({
  name,
  type,
  defaultVal,
  description,
}) => (
  <tr className="rule rule-t">
    <td
      className="px-4 py-2 font-mono text-[13px] break-words align-top"
      style={{ color: "var(--accent)" }}
    >
      {name}
    </td>
    <td className="px-4 py-2 font-mono text-xs break-words align-top text-fg-secondary">
      {type}
    </td>
    <td className="px-4 py-2 font-mono text-xs break-words align-top text-fg-tertiary">
      {defaultVal ?? "-"}
    </td>
    <td className="px-4 py-2 text-[13px] break-words align-top text-fg-secondary">
      {description ?? "-"}
    </td>
  </tr>
);

interface PropsTableProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const PropsTable: React.FC<PropsTableProps> = ({ children }) => (
  <div className="overflow-x-auto w-full min-w-0 -mx-4 px-4 sm:mx-0 sm:px-0">
    <table className="w-full table-fixed text-left min-w-[600px]">
      <colgroup>
        <col className="w-[22%]" />
        <col className="w-[25%]" />
        <col className="w-[13%]" />
        <col className="w-[40%]" />
      </colgroup>
      <thead>
        <tr className="text-fg-tertiary rule rule-b">
          <th className="px-4 py-2 eyebrow">Prop</th>
          <th className="px-4 py-2 eyebrow">Type</th>
          <th className="px-4 py-2 eyebrow">Default</th>
          <th className="px-4 py-2 eyebrow">Description</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);
