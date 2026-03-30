import { Link } from "react-router-dom";
import { useEffect } from "react";
import { LogoMark, LogoWordmark } from "../../components/brand/Logo";
import { BLOG_POSTS } from "./blogData";
// ─── Blog Card (stacked single-column) ─────────────────────────────────────

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[0] }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.05] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${post.coverGradient[0]}18, ${post.coverGradient[1]}14)`,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-xs text-gray-500">{post.readTime}</span>
        </div>

        <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-blue-100 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="text-xs text-gray-500">{post.date}</span>
          <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
            Read more
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Blog Listing Page ──────────────────────────────────────────────────────

export default function BlogListing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#04040a] text-white selection:bg-blue-600/30 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-blue-600/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-violet-600/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* ── HEADER ── */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#04040a]/60 border-b border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="flex items-center justify-between py-3.5">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative group-hover:scale-105 transition-transform duration-500">
                  <LogoMark size={40} />
                </div>
                <LogoWordmark className="text-[22px]" />
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  to="/accordion"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/[0.05]"
                >
                  Components
                </Link>
                <Link
                  to="/blog"
                  className="text-sm text-white font-medium transition-colors duration-300 px-4 py-2 rounded-lg bg-white/[0.05]"
                >
                  Blog
                </Link>
                <Link
                  to="/accordion"
                  className="text-sm font-medium px-5 py-2 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/[0.08] hover:border-blue-500/25 transition-all duration-300 ml-2"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* ── HERO ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-28 sm:pt-32 pb-10">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4 text-white">
              Insights & Guides
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              Practical articles on frontend development, component design, and
              building modern web experiences.
            </p>
          </section>

          {/* ── BLOG GRID ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {BLOG_POSTS.length === 0 && (
              <div className="text-center py-20 text-gray-500 text-base">
                No posts yet. Check back soon.
              </div>
            )}
          </section>

          {/* ── FOOTER ── */}
          <footer className="max-w-6xl mx-auto px-6 sm:px-8 pb-8 pt-8">
            <div className="border-t border-white/[0.06] pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogoMark size={28} />
                  <LogoWordmark className="text-[16px]" />
                  <span className="text-xs text-gray-600 ml-2">
                    MIT License
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Link
                    to="/button"
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Components
                  </Link>
                  <Link
                    to="/blog"
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Blog
                  </Link>
                  <a
                    href="https://github.com"
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
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
