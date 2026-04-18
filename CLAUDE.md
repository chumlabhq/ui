## MANDATORY: Query Wiki Before Reading Source Code

IMPORTANT: You MUST NOT read source code files (*.py, *.ts, *.js, etc.) or use the Explore agent to understand the codebase UNTIL you have first queried the wiki knowledge base. This is a BLOCKING REQUIREMENT — violating it wastes tokens and time.

**Before reading ANY source file, you MUST do these steps IN ORDER:**

1. Run `cd /Users/adityaagarwal/Documents/Brain/kern-ui && graphify query "your question"` to query the knowledge graph.
2. Read `/Users/adityaagarwal/Documents/Brain/kern-ui/wiki/index.md` to find relevant wiki pages.
3. Read the relevant wiki pages from `/Users/adityaagarwal/Documents/Brain/kern-ui/wiki/`.
4. ONLY if the wiki does not have the answer, THEN read source code files.

The wiki at `/Users/adityaagarwal/Documents/Brain/kern-ui` contains exhaustive documentation of the entire codebase — architecture, services, models, routes, flows, and integrations. Reading source files directly when this information already exists in the wiki is wasteful.

If `/Users/adityaagarwal/Documents/Brain/kern-ui/graphify-out/wiki/index.md` exists, use it as an additional navigation index.

Only read raw files in `/Users/adityaagarwal/Documents/Brain/kern-ui/raw/` if the user explicitly says "read the raw file".

## Wiki-Brain Session Rules

**Ingesting sources.** When the user drops a file into `/Users/adityaagarwal/Documents/Brain/kern-ui/raw/`
and asks you to ingest it, follow `/wiki-brain ingest` — read the source,
summarize, create/update wiki pages, cross-link aggressively, update
`wiki/index.md`, append to `log.md`.

**Every session must end with a log entry.** Before ending a session, append
one line to `/Users/adityaagarwal/Documents/Brain/kern-ui/log.md` in this exact format:

```
## [YYYY-MM-DD HH:MM] session | <3-8 word session title>
Touched: <comma-separated wiki pages, or "none">
```

**If the session produced durable knowledge** — update or create relevant wiki pages. Cross-link with `[[Page Name]]`. Update `wiki/index.md`.

**If the session was trivial** — skip the wiki update. Just append the log line.

**Never modify files in `raw/`.** Sources are immutable.
**Claude owns `wiki/` entirely.**
**Always update `wiki/index.md`** when you create or rename a wiki page.
**Cross-link aggressively.** `[[Page Name]]` Obsidian syntax.

## Wiki-Brain Commands Available

- `/wiki-brain` — status menu
- `/wiki-brain ingest <file>` — ingest a source
- `/wiki-brain query "<q>"` — query the graph + wiki
- `/wiki-brain lint` — health-check the wiki
- `/wiki-brain rebuild` — force a Graphify rebuild
- `/wiki-brain doctor` — verify install
- `/recall` — show last 5 activities + read linked pages
