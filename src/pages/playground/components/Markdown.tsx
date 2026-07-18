import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Assistant prose is markdown — render it properly (bold, lists, headings,
// inline code, links) with the playground's tokens. No raw HTML is emitted
// (react-markdown builds React nodes, not innerHTML), so it's XSS-safe.
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[13.5px] leading-relaxed text-fg-secondary [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-fg-muted">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-fg-muted">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-fg/[0.08] px-1 py-0.5 font-mono text-[12px] text-fg">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-lg border border-border-faint bg-fg/[0.04] p-3 font-mono text-[12px] leading-relaxed [&_code]:bg-transparent [&_code]:p-0">
              {children}
            </pre>
          ),
          h1: ({ children }) => <h3 className="mb-1.5 mt-3 font-display text-[15px] font-semibold text-fg">{children}</h3>,
          h2: ({ children }) => <h3 className="mb-1.5 mt-3 font-display text-[14px] font-semibold text-fg">{children}</h3>,
          h3: ({ children }) => <h4 className="mb-1 mt-2.5 font-display text-[13px] font-semibold text-fg">{children}</h4>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-border-soft pl-3 text-fg-tertiary">{children}</blockquote>
          ),
          hr: () => <hr className="my-3 border-border-faint" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
