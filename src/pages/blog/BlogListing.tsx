import { Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { LogoMark } from "../../brand/Logo";
import { BLOG_POSTS } from "./blogData";
import { Pagination } from "../../components/Pagination";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const POSTS_PER_PAGE = 6;

// Extract unique categories from blog data
const ALL_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

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
      aria-hidden
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
      <div className="relative h-36 sm:h-44 overflow-hidden">
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

      <div className="p-4 sm:p-5">
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
  useDocumentTitle("Blog");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
          p.excerpt.toLowerCase().includes(q),
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
  const [prevFilters, setPrevFilters] = useState({
    searchQuery,
    activeCategory,
  });
  if (
    prevFilters.searchQuery !== searchQuery ||
    prevFilters.activeCategory !== activeCategory
  ) {
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
      const y =
        gridRef.current.getBoundingClientRect().top + window.scrollY - 100;
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

        {/* Mobile menu overlay */}
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

        <main>
          {/* ── HERO ── */}
          <section className="px-4 sm:px-6 lg:px-10 pt-28 sm:pt-32 pb-10 sm:pb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
                Insights &{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Guides
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
                Practical articles on frontend development, component design,
                and building modern web experiences.
              </p>

              <div className="relative max-w-xl mx-auto">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 text-[15px] outline-none focus:border-blue-500/30 focus:bg-white/[0.06] transition-all duration-300"
                />
              </div>
            </div>
          </section>

          {/* ── FILTERS ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-8">
            {/* Category pills */}
            <div className="-mx-6 px-6 sm:mx-0 sm:px-0">
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
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
                  const count = BLOG_POSTS.filter(
                    (p) => p.category === cat,
                  ).length;
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
            </div>

            {/* Active filter info */}
            {(searchQuery || activeCategory) && (
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                <span>
                  {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "article" : "articles"} found
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
          <section
            ref={gridRef}
            className="max-w-6xl mx-auto px-6 sm:px-8 pb-8"
          >
            {paginatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20 px-4 sm:px-0">
                <div className="text-gray-600 text-sm sm:text-lg mb-2">
                  No articles found
                </div>
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
                      "w-10 h-10 sm:w-9 sm:h-9 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center justify-center cursor-pointer",
                    activePageButton:
                      "w-10 h-10 sm:w-9 sm:h-9 rounded-lg text-sm font-medium bg-blue-600 text-white flex items-center justify-center cursor-pointer",
                    navButton:
                      "w-10 h-10 sm:w-9 sm:h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center justify-center cursor-pointer",
                    ellipsis:
                      "w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600",
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
