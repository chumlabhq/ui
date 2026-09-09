import { Fragment, type FC } from "react";

/**
 * Inline markdown as the .ai.md files write it: `code` and **strong**.
 *
 * The generated docs carry the source's own markdown — 408 strings with
 * backticks and 44 with `**` across props, class keys, shapes, the
 * accessibility notes and the keyboard tables. Every one of them used to reach
 * the page through `{text}`, so a reader saw the asterisks and backticks
 * themselves and `aria-expanded` was indistinguishable from prose.
 *
 * Rendered here rather than stripped in the generator: the markers carry the
 * distinction between a prop name and a sentence, and dropping them to get
 * plain text would lose exactly what they are for. The generator cannot make
 * React emit a <code>, and turning 2469 description strings into segment
 * arrays would move a presentation concern into the data for no gain.
 */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export const Inline: FC<{ text: string }> = ({ text }) => (
  <>
    {text
      .split(TOKEN)
      .filter(Boolean)
      .map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return (
            <strong key={i} className="font-medium text-fg">
              {part.slice(2, -2)}
            </strong>
          );
        if (part.startsWith("`") && part.endsWith("`"))
          return (
            <code key={i} className="font-mono text-[0.92em] text-accent">
              {part.slice(1, -1)}
            </code>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
  </>
);
