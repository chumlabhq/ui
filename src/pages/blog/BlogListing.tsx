import { Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { LogoMark } from "../../components/brand/Logo";
import { BLOG_POSTS } from "./blogData";
import { Pagination } from "../../components/Pagination";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const POSTS_PER_PAGE = 6;

// Extract unique categories from blog data
const ALL_CATEGORIES = Array.from(
  new Set(BLOG_POSTS.map((p) => p.category))
);

// ─── Search Icon ────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// ─── Blog Card ──────────────────────────────────────────────────────────────

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[0] }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.05] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1"
    >
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

      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[11px] font-medium text-gray-500 bg-white/[0.05] px-2 py-0.5 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-gray-600">{post.readTime}</span>
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
  useDocumentTitle("Blog — Insights & Guides on Frontend Development");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter posts by search and category
  const filteredPosts = useMemo(() => {
    let posts = BLOG_POSTS;

    if (activeCategory) {
      posts = posts.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }

    return posts;
  }, [searchQuery, activeCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [currentPage, filteredPosts]);

  // Reset to page 1 when filters change
  const [prevFilters, setPrevFilters] = useState({ searchQuery, activeCategory });
  if (prevFilters.searchQuery !== searchQuery || prevFilters.activeCategory !== activeCategory) {
    setPrevFilters({ searchQuery, activeCategory });
    setCurrentPage(1);
  }

  // Smooth scroll to grid on page change (not on initial load)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (gridRef.current) {
      const y = gridRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

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
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <LogoMark size={160} />
                  <div className="absolute -inset-3 rounded-full bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  to="/accordion"
                  className="text-[12px] text-gray-500 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/4"
                >
                  Components
                </Link>
                <Link
                  to="/blog"
                  className="text-[12px] text-gray-500 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/4"
                >
                  Blog
                </Link>
                <Link
                  to="/accordion"
                  className="text-[12px] font-medium px-5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/8 hover:border-blue-500/25 transition-all duration-300 ml-3 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* ── HERO ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-28 sm:pt-32 pb-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4 text-white">
              Insights & Guides
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              Practical articles on frontend development, component design, and
              building modern web experiences.
            </p>
          </section>

          {/* ── SEARCH + FILTERS ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-8">
            {/* Search bar */}
            <div className="relative mb-5">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, category, or topic..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === null
                    ? "bg-blue-600 text-white cursor-pointer"
                    : "bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer"
                }`}
              >
                All
              </button>
              {ALL_CATEGORIES.map((cat) => {
                const count = BLOG_POSTS.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                      activeCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                    }`}
                  >
                    {cat}
                    <span className="ml-1.5 text-xs opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Active filter info */}
            {(searchQuery || activeCategory) && (
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                <span>
                  {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
                </span>
                {(searchQuery || activeCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory(null);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </section>

          {/* ── BLOG GRID ── */}
          <section ref={gridRef} className="max-w-6xl mx-auto px-6 sm:px-8 pb-8">
            {paginatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-600 text-lg mb-2">No articles found</div>
                <p className="text-gray-600 text-sm">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </section>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-16">
              <div className="flex justify-center">
                <Pagination
                  value={currentPage}
                  totalPages={totalPages}
                  onValueChange={setCurrentPage}
                  classes={{
                    root: "",
                    nav: "flex items-center gap-2",
                    pageButtons: "flex items-center gap-1",
                    pageButton:
                      "w-9 h-9 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center justify-center cursor-pointer",
                    activePageButton:
                      "w-9 h-9 rounded-lg text-sm font-medium bg-blue-600 text-white flex items-center justify-center cursor-pointer",
                    navButton:
                      "w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center justify-center cursor-pointer",
                    ellipsis: "w-9 h-9 flex items-center justify-center text-gray-600",
                    selector: "",
                    selectorButton: "",
                    selectorDropdown: "",
                    selectorDropdownWrapper: "",
                    selectorOption: "",
                    label: "",
                    dropdownIcon: "",
                    prevIcon: "",
                    nextIcon: "",
                    pageInfo: "",
                  }}
                />
              </div>
            </section>
          )}

          {/* ── FOOTER ── */}
          <footer className="w-full px-5 sm:px-8 pb-6">
            <div className="border-t border-white/4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogoMark size={140} />
                  <span className="text-[10px] text-gray-700 ml-2">
                    MIT License
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <Link
                    to="/button"
                    className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300"
                  >
                    Components
                  </Link>
                  <Link
                    to="/blog"
                    className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300"
                  >
                    Blog
                  </Link>
                  <a
                    href="https://github.com"
                    className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300"
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
