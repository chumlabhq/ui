import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Tooltip } from "../../../../components/Tooltip";
import {
  useListMyChatsQuery,
  useLazyGetChatsPageQuery,
} from "../../../../redux/api/playgroundApi";
import type { PlaygroundChat } from "../../types";

export type PlaygroundView = "build" | "settings";

interface SidebarProps {
  view: PlaygroundView;
  onSelectView: (view: PlaygroundView) => void;
  onNew: () => void;
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

const COLLAPSE_KEY = "pg_sidebar_collapsed";

const PLUS_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

const SETTINGS_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const COLLAPSE_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path
      d="M16.666 2.5H3.33268C2.41352 2.5 1.66602 3.2475 1.66602 4.16667V15.8333C1.66602 16.7525 2.41352 17.5 3.33268 17.5H16.666C17.5852 17.5 18.3327 16.7525 18.3327 15.8333V4.16667C18.3327 3.2475 17.5852 2.5 16.666 2.5ZM3.33268 15.8333V5.83333H8.33268V15.8333H3.33268ZM9.99935 15.8333V5.83333H16.666V4.16667L16.6677 15.8333H9.99935Z"
      fill="currentColor"
    />
  </svg>
);

const CHAT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
    />
  </svg>
);

function bucket(iso: string): string {
  const d = new Date(iso).getTime();
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (d >= startToday) return "Today";
  if (d >= startToday - 86400000) return "Yesterday";
  if (d >= startToday - 7 * 86400000) return "Previous 7 days";
  if (d >= startToday - 30 * 86400000) return "Previous 30 days";
  return new Date(iso).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function NavButton({
  icon,
  label,
  collapsed,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group flex w-full items-center gap-3 rounded-md py-2 text-[13.5px] transition-colors [&_svg]:h-[18px] [&_svg]:w-[18px] ${
        collapsed ? "justify-center px-0" : "px-2.5"
      } ${active ? "bg-fg/[0.06] text-fg" : "text-fg-secondary hover:bg-fg/[0.045] hover:text-fg"}`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
  // Tooltip only when collapsed — the label is already visible when expanded.
  return collapsed ? (
    <Tooltip content={label} side="right" asChild>
      {button}
    </Tooltip>
  ) : (
    button
  );
}

// Claude-style collapsible sidebar: brand + collapse toggle, a New action, a
// scrollable day-grouped Recents list (cursor-paginated on scroll), and
// Settings pinned at the bottom.
export default function Sidebar({
  view,
  onSelectView,
  onNew,
  activeChatId,
  onSelectChat,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(
    () => typeof localStorage !== "undefined" && localStorage.getItem(COLLAPSE_KEY) === "1"
  );

  const { data: page1, isLoading } = useListMyChatsQuery({ limit: 30 });
  const [fetchPage] = useLazyGetChatsPageQuery();

  const [older, setOlder] = useState<PlaygroundChat[]>([]);
  const [olderCursor, setOlderCursor] = useState<string | null>(null);
  const [olderHasMore, setOlderHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const chats = useMemo(() => {
    const seen = new Set<string>();
    const out: PlaygroundChat[] = [];
    for (const c of [...(page1?.chats ?? []), ...older]) {
      if (seen.has(c._id)) continue;
      seen.add(c._id);
      out.push(c);
    }
    return out;
  }, [page1, older]);

  const cursor = older.length ? olderCursor : page1?.nextCursor ?? null;
  const hasMore = older.length ? olderHasMore : page1?.hasMore ?? false;

  const loadMore = async () => {
    if (!cursor || !hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetchPage({ cursor, limit: 30 }).unwrap();
      setOlder((prev) => [...prev, ...res.chats]);
      setOlderCursor(res.nextCursor ?? null);
      setOlderHasMore(!!res.hasMore);
    } catch {
      setOlderHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll: observe the sentinel; setState happens in the async
  // callback, not synchronously in the effect body.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void loadMoreRef.current();
      },
      { root: scrollRef.current, rootMargin: "120px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, collapsed]);

  const groups = useMemo(() => {
    const map = new Map<string, PlaygroundChat[]>();
    const order: string[] = [];
    for (const c of chats) {
      const key = bucket(c.updatedAt);
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)!.push(c);
    }
    return order.map((key) => ({ key, items: map.get(key)! }));
  }, [chats]);

  const toggleCollapse = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <aside
      className={`rule-r flex h-full shrink-0 flex-col border-border-faint bg-bg-base transition-[width] duration-200 ${
        collapsed ? "w-14" : "w-64"
      }`}
    >
      {/* collapse toggle — the "Playground" title now lives in the header */}
      <div className={`flex h-12 shrink-0 items-center ${collapsed ? "justify-center px-0" : "justify-end px-3"}`}>
        {collapsed ? (
          <Tooltip content="Expand sidebar" side="right" asChild>
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Expand sidebar"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-fg-tertiary transition-colors hover:bg-fg/[0.045] hover:text-fg"
            >
              {COLLAPSE_ICON}
            </button>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-fg-tertiary transition-colors hover:bg-fg/[0.045] hover:text-fg"
          >
            {COLLAPSE_ICON}
          </button>
        )}
      </div>

      {/* New */}
      <div className="px-2 pt-1">
        <NavButton icon={PLUS_ICON} label="New" collapsed={collapsed} onClick={onNew} />
      </div>

      {/* Recents (expanded only) */}
      {collapsed ? (
        <div className="flex-1" />
      ) : (
        <div className="mt-2 flex min-h-0 flex-1 flex-col">
          <div className="px-4 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-tertiary">
            Recents
          </div>
          <div ref={scrollRef} className="pg-no-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-2">
            {isLoading && chats.length === 0 ? (
              <div className="flex flex-col gap-1.5 px-1 pt-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded-md bg-fg/[0.04]" />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <p className="px-2.5 pt-2 text-[12.5px] text-fg-tertiary">No builds yet.</p>
            ) : (
              groups.map((group) => (
                <div key={group.key} className="mb-1">
                  <div className="px-2.5 pb-1 pt-2 text-[10.5px] font-medium uppercase tracking-[0.08em] text-fg-muted">
                    {group.key}
                  </div>
                  {group.items.map((chat) => (
                    <button
                      key={chat._id}
                      type="button"
                      onClick={() => onSelectChat(chat._id)}
                      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left transition-colors [&_svg]:h-4 [&_svg]:w-4 ${
                        chat._id === activeChatId && view === "build"
                          ? "bg-fg/[0.06] text-fg"
                          : "text-fg-secondary hover:bg-fg/[0.045] hover:text-fg"
                      }`}
                    >
                      <span className="shrink-0 text-fg-tertiary">{CHAT_ICON}</span>
                      <span className="truncate text-[13px]">{chat.title || "Untitled build"}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
            {hasMore && (
              <div ref={sentinelRef} className="py-3 text-center text-[11px] text-fg-muted">
                {loadingMore ? "Loading…" : ""}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings pinned bottom */}
      <div className="rule-t border-border-faint px-2 py-2">
        <NavButton
          icon={SETTINGS_ICON}
          label="Settings"
          collapsed={collapsed}
          active={view === "settings"}
          onClick={() => onSelectView("settings")}
        />
      </div>
    </aside>
  );
}
