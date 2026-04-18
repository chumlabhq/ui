import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogoMark } from "../../brand/Logo";
import { getBlogById } from "./blogData";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import type { BlogSection } from "./blogData";
import { BlogDiagram } from "./BlogIllustrations";

/** SVG delivered as an `<img>` src when a post has no `coverImage` (avoids CSS background on a div). */
function gradientCoverSrc(colors: [string, string]): string {
  const [c0, c1] = colors;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c0}"/><stop offset="100%" stop-color="${c1}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ─── Markdown-lite bold rendering ───────────────────────────────────────────

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-white font-semibold">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// ─── Section renderer ───────────────────────────────────────────────────────

function BlogSectionRenderer({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "heading":
      return (
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-14 mb-5 tracking-tight leading-tight">
          {section.content}
        </h2>
      );

    case "subheading":
      return (
        <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mt-8 mb-3">
          {section.content}
        </h3>
      );

    case "paragraph":
      return (
        <p className="text-base sm:text-[17px] text-gray-300 leading-[1.85] mb-5">
          {section.content ? renderBold(section.content) : null}
        </p>
      );

    case "list":
      return (
        <ul className="space-y-3 mb-6 ml-1">
          {section.items?.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-base sm:text-[17px] text-gray-300 leading-relaxed"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="mt-0.5 shrink-0 text-blue-400"
              >
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
              </svg>
              <span>{renderBold(item)}</span>
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="relative my-10 pl-5 sm:pl-7 py-5 border-l-[3px] border-blue-500/50 bg-blue-500/[0.04] rounded-r-xl">
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 italic leading-relaxed font-medium">
            "{section.content ? renderBold(section.content) : null}"
          </p>
        </blockquote>
      );

    case "callout":
      return (
        <div className="my-7 px-4 sm:px-6 py-4 sm:py-5 rounded-xl border border-blue-500/20 bg-blue-500/[0.06]">
          <p className="text-[16px] text-blue-200 leading-relaxed flex items-start gap-3">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-blue-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>{section.content ? renderBold(section.content) : null}</span>
          </p>
        </div>
      );

    case "code":
      return (
        <div className="my-6 rounded-xl border border-white/[0.08] bg-[#0d0d1a] overflow-hidden">
          {section.language && (
            <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {section.language}
              </span>
            </div>
          )}
          <pre className="px-5 py-4 overflow-x-auto text-xs sm:text-sm">
            <code className="text-sm leading-relaxed text-gray-300 font-mono">
              {section.content}
            </code>
          </pre>
        </div>
      );

    case "divider":
      return (
        <div className="my-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.12]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/[0.05]" />
          </div>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
      );

    case "diagram":
      return (
        <div className="my-10">
          {section.label && (
            <div className="flex items-center gap-2.5 mb-5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {section.label}
              </span>
            </div>
          )}
          {section.content && <BlogDiagram type={section.content} />}
        </div>
      );

    default:
      return null;
  }
}

// ─── Blog Detail Page ───────────────────────────────────────────────────────

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const post = id ? getBlogById(id) : undefined;
  useDocumentTitle(post?.title ?? "Blog");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white selection:bg-blue-600/30 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-blue-600/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-violet-600/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* ── HEADER ── */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#04040a]/60">
          <div className="w-full px-5 sm:px-8">
            <div className="flex items-center justify-between py-3.5">
              <Link to="/" className="flex items-center gap-3">
                <LogoMark size={160} />
              </Link>
              <div className="flex items-center gap-1">
                <div className="hidden sm:flex items-center gap-1">
                  <Link
                    to="/accordion"
                    className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                  >
                    Components
                  </Link>
                  <Link
                    to="/blog"
                    className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/faq"
                    className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                  >
                    FAQ
                  </Link>
                  <a
                    href="https://github.com/chumlabhq/ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-white/6"
                    aria-label="GitHub"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                </div>
                <Link
                  to="/accordion"
                  className="text-[12px] font-medium px-5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/8 hover:border-blue-500/25 transition-all duration-300 sm:ml-2"
                >
                  Get Started
                </Link>
                <button
                  onClick={() => setMenuOpen(true)}
                  className="sm:hidden p-2 rounded-lg text-white/80 hover:bg-white/[0.06] transition-colors ml-1"
                  aria-label="Open menu"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {menuOpen && (
          <div className="fixed inset-0 z-[60] sm:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute top-0 right-0 h-full w-[280px] max-w-[80vw] bg-[#0a0a14] border-l border-white/[0.06] p-6 flex flex-col gap-1">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg text-white/60 hover:bg-white/[0.06] transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <Link
                to="/accordion"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium text-white/90 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                Components
              </Link>
              <Link
                to="/blog"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium text-white/90 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/faq"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium text-white/90 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                FAQ
              </Link>
              <a
                href="https://github.com/chumlabhq/ui"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium text-white/90 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        )}

        <main className="pt-[65px]">
          {/* ── BLOG ARTICLE WRAPPER ── */}
          <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 mb-6 group"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:-translate-x-1 transition-transform duration-300"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              All articles
            </Link>

            {/* Bordered article card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              {/* ── COVER IMAGE ── */}
              <img
                src={post.coverImage ?? gradientCoverSrc(post.coverGradient)}
                alt={post.coverImage ? post.title : ""}
                className="block w-full object-cover max-h-[250px] sm:max-h-none"
                decoding="async"
              />

              {/* ── ARTICLE HEADER ── */}
              <div className="px-5 sm:px-8 lg:px-10 pt-8 pb-2">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <span className="text-gray-700">|</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-[44px] font-bold tracking-tight leading-[1.15] mb-5 text-white">
                  {post.title}
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                  {post.subtitle}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6 mb-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-gray-400 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── ARTICLE CONTENT ── */}
              <article className="px-5 sm:px-8 lg:px-10 pb-10 pt-6">
                {post.sections.map((section, i) => (
                  <BlogSectionRenderer key={i} section={section} />
                ))}

                {/* End CTA */}
                <div className="mt-16 pt-10 border-t border-white/[0.06]">
                  <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/[0.06] to-violet-500/[0.04] p-6 sm:p-10 text-center">
                    <h3 className="text-xl font-bold text-white mb-3">
                      Building a modern frontend?
                    </h3>
                    <p className="text-base text-gray-400 mb-6">
                      Skip the boilerplate. Use production-ready components.
                    </p>
                    <Link
                      to="/accordion"
                      className="inline-flex items-center gap-2 text-sm font-semibold px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                    >
                      Explore Components
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <footer className="w-full px-5 sm:px-8 pb-6">
            <div className="border-t border-white/4 pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <LogoMark size={120} />
                  <span className="text-xs text-gray-700 ml-2">
                    MIT License
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <Link
                    to="/button"
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors duration-300"
                  >
                    Components
                  </Link>
                  <Link
                    to="/blog"
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors duration-300"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/faq"
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors duration-300"
                  >
                    FAQ
                  </Link>
                  <a
                    href="https://github.com"
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors duration-300"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
