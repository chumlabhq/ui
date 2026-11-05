import type { FullConfig } from "@playwright/test";

/** `name` in this repository's package.json. Vite's dev server serves that file from its root. */
export const PACKAGE_NAME = "@chumlab/ui";

/** The fetch never outlives a stuck server by more than this; nothing else in the run has started. */
const ANSWER_MS = 10_000;

/**
 * Vite binds `localhost` to whichever family the OS lists first, and Node's fetch
 * resolves it for itself: in the Playwright Linux image Vite listened on ::1 and
 * fetch tried 127.0.0.1, which refused, with a browser and curl both reaching it.
 * So a `localhost` address is tried under each loopback name.
 */
const answer = async (url: string): Promise<Response> => {
  const parsed = new URL(url);
  if (parsed.hostname !== "localhost") return fetch(url, { signal: AbortSignal.timeout(ANSWER_MS) });
  let failure: unknown;
  for (const host of ["localhost", "127.0.0.1", "[::1]"]) {
    parsed.hostname = host;
    try {
      return await fetch(parsed.href, { signal: AbortSignal.timeout(ANSWER_MS) });
    } catch (error) {
      failure = error;
    }
  }
  throw failure;
};

const describeAnswer = async (base: string): Promise<string> => {
  try {
    const home = await answer(base);
    const title = /<title[^>]*>([^<]*)<\/title>/i.exec(await home.text())?.[1]?.trim();
    return `HTTP ${home.status} at /, ${title ? `title "${title}"` : "no <title>"}, server header "${home.headers.get("server") ?? "none"}"`;
  } catch (error) {
    return `nothing usable at /: ${String(error)}`;
  }
};

/**
 * Why the server at `base` is not this repository's dev server, or null when it is.
 *
 * Playwright's `reuseExistingServer` takes whatever answers on the port: during
 * run E, 5173 was serving another project, and a run reusing it would have
 * tested that app. A title or a route is not proof, because any single-page app
 * answers 200 with its own HTML on every path. `/package.json` is a file only a
 * server rooted at this repository has, and its `name` is read rather than
 * assumed.
 */
export async function serverMismatch(base: string): Promise<string | null> {
  const url = new URL("/package.json", base).href;
  let name: unknown;
  try {
    name = ((await (await answer(url)).json()) as { name?: unknown }).name;
  } catch {
    name = undefined;
  }
  if (name === PACKAGE_NAME) return null;
  return (
    `The server at ${base} is not this repository's dev server. ${url} should name "${PACKAGE_NAME}" and ` +
    `${name === undefined ? "has no readable name" : `names ${JSON.stringify(name)}`}. What answered: ${await describeAnswer(base)}.\n` +
    "No test ran. Stop that server or set PLAYWRIGHT_BASE_URL to a port of this repository's own."
  );
}

export default async function globalSetup(config: FullConfig): Promise<void> {
  const base = config.projects[0]?.use.baseURL;
  if (!base) throw new Error("no baseURL in the first Playwright project, so the server cannot be identified");
  const mismatch = await serverMismatch(base);
  if (mismatch) throw new Error(mismatch);
  console.log(`server identity: ${PACKAGE_NAME} at ${base} (1 of 1 server checked)`);
}
