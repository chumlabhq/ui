import { Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { BLOG_POSTS } from "./blogData";
import { Pagination } from "../../components/Pagination";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useJsonLd, useCanonical } from "../../hooks/useJsonLd";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

// ─── Page metadata + schema ────────────────────────────────────────────────

const LISTING_TITLE = "Blog — Guides & Articles";
const LISTING_DESCRIPTION =
  "Practical guides on React, Next.js, frontend architecture, accessibility, performance, and building modern web UIs with Chumlab UI. Updated regularly.";
const LISTING_URL = "https://chumlab.com/blog";

function buildBlogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Chumlab Blog",
    url: LISTING_URL,
    description: LISTING_DESCRIPTION,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Chumlab",
      url: "https://chumlab.com",
    },
    blogPost: BLOG_POSTS.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://chumlab.com/blog/${p.id}`,
      datePublished: p.date,
      articleSection: p.category,
      keywords: p.tags.join(", "),
    })),
  };
}

const LISTING_BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://chumlab.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: LISTING_URL,
    },
  ],
};

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
  useDocumentTitle(LISTING_TITLE, LISTING_DESCRIPTION);
  useCanonical(LISTING_URL);
  const blogJsonLd = useMemo(() => buildBlogJsonLd(), []);
  useJsonLd("blog-listing-jsonld", blogJsonLd);
  useJsonLd("blog-listing-breadcrumb", LISTING_BREADCRUMB_JSON_LD);
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
        <SiteHeader />

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

          <SiteFooter />
        </main>
      </div>
    </div>
  );
}
