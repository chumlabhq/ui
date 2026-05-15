import { useParams, Navigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getBlogById } from "./blogData";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import {
  useJsonLd,
  useCanonical,
  usePageMeta,
} from "../../hooks/useJsonLd";
import type { BlogSection, BlogPost } from "./blogData";
import { BlogDiagram } from "./BlogIllustrations";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import Reveal from "../../components/Reveal/Reveal";
import { Button } from "../../components/ui";

function toIsoDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime())
    ? dateStr
    : parsed.toISOString().slice(0, 10);
}

function buildArticleJsonLd(post: BlogPost, url: string) {
  const image = post.coverImage ?? "https://chumlab.com/og-image.png";
  const iso = toIsoDate(post.date);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image,
    url,
    datePublished: iso,
    dateModified: iso,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: "Chumlab",
      url: "https://chumlab.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Chumlab",
      url: "https://chumlab.com",
      logo: {
        "@type": "ImageObject",
        url: "https://chumlab.com/favicon-96x96.png",
      },
    },
  };
}

function buildPostBreadcrumb(post: BlogPost, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://chumlab.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://chumlab.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };
}

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-fg font-medium">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function BlogSectionRenderer({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "heading":
      return (
        <h2
          className="font-sans font-medium text-fg mt-10 mb-4 leading-[1.2]"
          style={{
            fontSize: "clamp(24px, 3vw, 32px)",
            letterSpacing: "-0.025em",
          }}
        >
          {section.content}
        </h2>
      );

    case "subheading":
      return (
        <h3
          className="font-sans font-medium text-fg mt-8 mb-3 leading-[1.3]"
          style={{
            fontSize: "clamp(20px, 2.4vw, 24px)",
            letterSpacing: "-0.02em",
          }}
        >
          {section.content}
        </h3>
      );

    case "paragraph":
      return (
        <p className="text-[16px] sm:text-[17px] text-fg-secondary leading-[1.75] mb-5">
          {section.content ? renderBold(section.content) : null}
        </p>
      );

    case "list":
      return (
        <ul className="space-y-3 mb-6">
          {section.items?.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[16px] sm:text-[17px] text-fg-secondary leading-relaxed"
            >
              <span
                className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span>{renderBold(item)}</span>
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote
          className="my-10 pl-6 py-2"
          style={{ borderLeft: "2px solid var(--accent)" }}
        >
          <p className="font-serif italic text-[20px] sm:text-[24px] text-fg leading-[1.4]">
            {section.content ? renderBold(section.content) : null}
          </p>
        </blockquote>
      );

    case "callout":
      return (
        <div
          className="my-7 px-5 py-4 bg-bg-elevated"
          style={{ borderLeft: "2px solid var(--accent)" }}
        >
          <p className="text-[15.5px] text-fg leading-[1.6] flex items-start gap-3">
            <span
              aria-hidden
              className="font-medium shrink-0"
              style={{ color: "var(--accent)" }}
            >
              Note
            </span>
            <span>{section.content ? renderBold(section.content) : null}</span>
          </p>
        </div>
      );

    case "code":
      return (
        <div
          className="my-6 rounded-md overflow-hidden bg-bg-elevated"
          style={{ border: "0.5px solid var(--border-faint)" }}
        >
          {section.language && (
            <div className="px-5 py-2.5 eyebrow text-fg-tertiary rule rule-b">
              {section.language}
            </div>
          )}
          <pre className="px-5 py-4 overflow-x-auto text-[13.5px] sm:text-[14px]">
            <code className="leading-relaxed font-mono text-fg">
              {section.content}
            </code>
          </pre>
        </div>
      );

    case "divider":
      return <div className="my-12 rule rule-t" />;

    case "diagram":
      return (
        <div className="my-10">
          {section.label && (
            <div className="eyebrow text-fg-tertiary mb-5">{section.label}</div>
          )}
          {section.content && <BlogDiagram type={section.content} />}
        </div>
      );

    default:
      return null;
  }
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const post = id ? getBlogById(id) : undefined;
  const url = post
    ? `https://chumlab.com/blog/${post.id}`
    : "https://chumlab.com/blog";
  const coverImage = post?.coverImage ?? "https://chumlab.com/og-image.png";

  useDocumentTitle(post?.title ?? "Blog", post?.excerpt);
  useCanonical(url);

  const articleJsonLd = useMemo(
    () => (post ? buildArticleJsonLd(post, url) : null),
    [post, url],
  );
  const breadcrumbJsonLd = useMemo(
    () => (post ? buildPostBreadcrumb(post, url) : null),
    [post, url],
  );
  useJsonLd("blog-article-jsonld", articleJsonLd);
  useJsonLd("blog-article-breadcrumb", breadcrumbJsonLd);

  const metaTags = useMemo(() => {
    if (!post) return [];
    return [
      { property: "og:type", content: "article" },
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.excerpt },
      { property: "og:url", content: url },
      { property: "og:image", content: coverImage },
      { property: "article:section", content: post.category },
      { property: "article:published_time", content: toIsoDate(post.date) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: post.title },
      { name: "twitter:description", content: post.excerpt },
      { name: "twitter:image", content: coverImage },
    ];
  }, [post, url, coverImage]);
  usePageMeta(metaTags);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // (Hero entry animations now flow through the shared <Reveal> component
  // below — eyebrow / H1 / subtitle / meta / cover each stagger to the
  // global rhythm.)

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Stable per-article cover variant — same article always picks the same
  // colour combo. Hash → 3 buckets matching the homepage / listing covers.
  const coverHash = (() => {
    let h = 0;
    for (let i = 0; i < post.id.length; i++)
      h = (h * 31 + post.id.charCodeAt(i)) | 0;
    return Math.abs(h) % 3;
  })();
  const coverStyle =
    coverHash === 2
      ? { bg: "bg-accent", title: "text-bg-base" }
      : coverHash === 1
        ? { bg: "bg-bg-elevated", title: "text-accent" }
        : { bg: "bg-bg-elevated", title: "text-fg" };

  const encodedTitle = encodeURIComponent(post.title);
  const encodedUrl = encodeURIComponent(url);
  const tweetHref = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

  const handleCopy = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(url);
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-fg">
      {/* Skip-to-content link for keyboard users. */}
      <a
        href="#article-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-bg-base focus:px-3 focus:py-2 focus:rounded focus:font-medium focus:text-[13px]"
      >
        Skip to article
      </a>

      <SiteHeader />

      <main className="pt-[var(--header-height)]">
        <article className="relative">
          {/* Top utility — back link */}
          <div className="max-w-[920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pt-12 sm:pt-14 lg:pt-16">
            <Reveal delay={0} translateY={8} duration={200}>
              {/* tightest possible — already at the duration floor */}
              <Button
                variant="ghost"
                size="sm"
                as="a"
                href="/blog"
                className="group"
                data-track-event="nav_click"
                data-track-location="blog_detail_top"
                data-track-target="all_articles"
                startIcon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"
                    aria-hidden
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                }
              >
                All articles
              </Button>
            </Reveal>
          </div>

          {/* Hero — category, H1, subtitle, meta + share */}
          <header className="max-w-[920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-14 lg:pb-16">
            <Reveal delay={40} translateY={8} duration={200}>
              <div className="inline-flex items-center gap-2 mb-5 sm:mb-6">
                <span aria-hidden className="w-1 h-1 rounded-full bg-accent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                  {post.category}
                </span>
              </div>
            </Reveal>

            <Reveal delay={80} translateY={12} duration={200}>
              <h1 className="font-sans text-[clamp(34px,5vw,60px)] font-medium tracking-[-0.035em] leading-[1.05] text-fg max-w-[860px]">
                {post.title}
              </h1>
            </Reveal>

            <Reveal delay={150} translateY={12} duration={200}>
              <p className="font-serif italic font-normal text-[clamp(18px,2.2vw,24px)] text-fg-secondary leading-[1.4] mt-5 sm:mt-6 max-w-[680px]">
                {post.subtitle}
              </p>
            </Reveal>

            <Reveal
              delay={200}
              translateY={8}
              duration={200}
              className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8 sm:mt-10 pt-5 border-t border-border-faint"
            >
              <div className="flex items-center gap-3 font-mono text-[11px] text-fg-secondary">
                <span>{post.date}</span>
                <span aria-hidden className="text-fg-muted">
                  ·
                </span>
                <span>{post.readTime}</span>
              </div>
              <div className="sm:ml-auto flex items-center gap-1.5">
                <Button
                  variant="icon"
                  size="sm"
                  onClick={handleCopy}
                  aria-label="Copy link"
                  data-track-event="blog_share"
                  data-track-method="copy_link"
                  data-track-post-id={post.id}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                    aria-hidden
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </Button>
                <Button
                  variant="icon"
                  size="sm"
                  as="a"
                  href={tweetHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter"
                  data-track-event="blog_share"
                  data-track-method="twitter"
                  data-track-post-id={post.id}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                    aria-hidden
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Button>
              </div>
            </Reveal>
          </header>

          {/* Decorative cover — same width as the hero block above so the
              left edge aligns with the back link, eyebrow, H1, subtitle,
              and meta row. Mirrors the listing-page cover system (3
              colour variants, hashed by id). Large visual element scales
              into place rather than translating. */}
          <Reveal
            delay={250}
            translateY={0}
            duration={300}
            scale={0.97}
            className="max-w-[920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 mb-14 sm:mb-16 lg:mb-20"
          >
            <div
              className={`relative aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5] rounded-xl overflow-hidden border border-border-faint flex items-center justify-center px-6 sm:px-10 lg:px-14 ${coverStyle.bg}`}
            >
              <p
                className={`font-serif italic font-normal text-center leading-[1.05] tracking-[-0.025em] text-[clamp(28px,4vw,56px)] max-w-[800px] ${coverStyle.title}`}
              >
                {post.title}
              </p>
            </div>
          </Reveal>

          {/* Article body — renders plain. The original implementation
              wrapped this in a single Reveal at delay=1000, but at that
              delay the prose stayed invisible long after a fast scroller
              had already reached it. Plain rendering ensures the article
              is always immediately readable. */}
          <div
            id="article-content"
            className="max-w-[920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24"
          >
            {post.sections.map((section, i) => (
              <BlogSectionRenderer key={i} section={section} />
            ))}

            <div className="mt-16 pt-10 border-t border-border-faint">
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-tertiary mb-3">
                Keep going
              </div>
              <h3
                className="font-sans font-medium text-fg mb-4"
                style={{
                  fontSize: "clamp(24px, 3vw, 32px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                }}
              >
                Building a modern frontend?{" "}
                <em className="font-serif italic font-normal text-accent">
                  Skip the boilerplate.
                </em>
              </h3>
              <Button
                variant="ghost"
                size="md"
                as="a"
                href="/accordion"
                endIcon={<span aria-hidden>→</span>}
                data-track-event="cta_click"
                data-track-location="blog_detail_inline"
                data-track-target="explore_components"
              >
                Explore Components
              </Button>
            </div>
          </div>

          {/* Bottom utility — back link + back to top */}
          <div className="max-w-[920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24">
            <div className="pt-8 border-t border-border-faint flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="sm"
                as="a"
                href="/blog"
                className="group"
                data-track-event="nav_click"
                data-track-location="blog_detail_bottom"
                data-track-target="all_articles"
                startIcon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"
                    aria-hidden
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                }
              >
                All articles
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="group"
                data-track-event="blog_back_to_top"
                data-track-post-id={post.id}
                endIcon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                }
              >
                Back to top
              </Button>
            </div>
          </div>
        </article>

        <SiteFooter />
      </main>
    </div>
  );
}
