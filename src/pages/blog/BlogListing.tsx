import { Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { BLOG_POSTS } from "./blogData";
import { Pagination } from "../../components/Pagination";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useJsonLd, useCanonical } from "../../hooks/useJsonLd";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { TypographicCover } from "../../components/TypographicCover";
import Reveal from "../../components/Reveal/Reveal";
import { Button } from "../../components/ui";
import { trackEvent } from "../../lib/analytics";

const LISTING_TITLE = "Blog. Guides and articles";
const LISTING_DESCRIPTION =
  "Practical guides on React, Next.js, frontend architecture, accessibility, performance, and building modern web UIs with Chumlab. Updated regularly.";
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
    { "@type": "ListItem", position: 1, name: "Home", item: "https://chumlab.com/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: LISTING_URL },
  ],
};

const POSTS_PER_PAGE = 6;
const ALL_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[0] }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group block"
      data-track-event="blog_card_click"
      data-track-location="blog_listing"
      data-track-target={post.id}
      data-track-category={post.category}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <TypographicCover
          title={post.title}
          seed={post.id}
          eyebrow={post.category}
        />
      </div>
      <div className="pt-5">
        <span className="inline-flex items-center gap-2 eyebrow text-fg-secondary">
          <span
            aria-hidden
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
          />
          {post.category}
        </span>
        <h3 className="mt-3 font-sans text-[19px] font-medium leading-[1.3] text-fg group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 text-[14px] text-fg-secondary leading-[1.55] line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-3 text-[12px] text-fg-tertiary">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-fg">
      <SiteHeader />

      <main className="pt-[var(--header-height)]">
        <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-10">
          <Reveal delay={0} translateY={12} duration={200}>
            <h1
              className="font-sans font-medium text-fg mb-6"
              style={{
                fontSize: "clamp(48px, 9vw, 96px)",
                lineHeight: 0.98,
                letterSpacing: "-0.045em",
              }}
            >
              <span className="serif-accent">Field</span> notes.
            </h1>
          </Reveal>
          <Reveal delay={80} translateY={8} duration={200}>
            <p className="text-[17px] text-fg-secondary leading-[1.55] max-w-[640px] mb-10">
              Practical articles on frontend development, component design, and
              building modern web experiences.
            </p>
          </Reveal>

          <Reveal delay={150} translateY={8} duration={200}>
            <div className="relative max-w-xl group">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none transition-colors group-focus-within:text-accent">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={(e) => {
                  // Track only when the user commits the search — every
                  // keystroke fire would flood GA4 with low-signal events.
                  const q = e.target.value.trim();
                  if (q) trackEvent("blog_search", { query: q });
                }}
                placeholder="Search articles"
                aria-label="Search articles"
                className="w-full pl-7 pr-4 py-3 bg-transparent text-[16px] text-fg placeholder:text-fg-muted outline-none border-b-[0.5px] border-border-soft focus:border-accent/50 transition-colors"
              />
            </div>
          </Reveal>
        </section>

        <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-8">
          <Reveal delay={200} translateY={8} duration={200}>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveCategory(null)}
              className="eyebrow px-3 py-1.5 transition-colors cursor-pointer"
              style={{
                background:
                  activeCategory === null ? "var(--text-primary)" : "transparent",
                color:
                  activeCategory === null ? "var(--bg-base)" : "var(--text-secondary)",
                border: "0.5px solid var(--border-faint)",
              }}
              data-track-event="blog_category_filter"
              data-track-category="all"
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const count = BLOG_POSTS.filter((p) => p.category === cat).length;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="eyebrow px-3 py-1.5 transition-colors cursor-pointer"
                  style={{
                    background: isActive ? "var(--text-primary)" : "transparent",
                    color: isActive ? "var(--bg-base)" : "var(--text-secondary)",
                    border: "0.5px solid var(--border-faint)",
                  }}
                  data-track-event="blog_category_filter"
                  data-track-category={cat}
                >
                  {cat}
                  <span className="ml-1.5 opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          </Reveal>

          {(searchQuery || activeCategory) && (
            <div className="mt-4 flex items-center gap-3 text-[13px] text-fg-tertiary">
              <span>
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "article" : "articles"} found
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(null);
                }}
                data-track-event="blog_filters_clear"
              >
                Clear
              </Button>
            </div>
          )}
        </section>

        <section ref={gridRef} className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-8">
          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {paginatedPosts.map((post, i) => {
                // Top row (i = 0, 1, 2) staggers 60ms apart from 200ms.
                // Cards 3+ render plain — at the original 1150ms delay
                // they would have stayed invisible past the point a fast
                // scroller has already reached the second row.
                if (i >= 3) return <BlogCard key={post.id} post={post} />;
                return (
                  <Reveal
                    key={post.id}
                    delay={250 + i * 30}
                    translateY={16}
                    duration={200}
                  >
                    <BlogCard post={post} />
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <Reveal delay={150} translateY={12} duration={200}>
              <div className="py-16 text-center">
                <p className="font-serif italic text-[28px] text-fg mb-3">
                  Nothing here yet.
                </p>
                <p className="text-[15px] text-fg-tertiary">
                  Try different keywords or clear the filter.
                </p>
              </div>
            </Reveal>
          )}
        </section>

        {totalPages > 1 && (
          <section className="max-w-[1280px] mx-auto px-5 sm:px-8 pb-16">
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
                    "w-9 h-9 text-sm font-medium text-fg-tertiary hover:text-accent transition-colors flex items-center justify-center cursor-pointer",
                  activePageButton:
                    "w-9 h-9 text-sm font-medium bg-fg text-bg-base flex items-center justify-center cursor-pointer rounded-md",
                  navButton:
                    "w-9 h-9 text-fg-tertiary hover:text-accent transition-colors flex items-center justify-center cursor-pointer",
                  ellipsis:
                    "w-9 h-9 flex items-center justify-center text-fg-muted",
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
  );
}
