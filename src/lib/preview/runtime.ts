// Sandboxed preview runtime: import map, token injection, Babel transform and
// the postMessage bridge. Built in Phase 2.

export interface PreviewRuntimeOptions {
  container: HTMLIFrameElement;
}

export interface PreviewRuntime {
  render: (code: string) => void;
  dispose: () => void;
}

export function createPreviewRuntime(
  _options: PreviewRuntimeOptions
): PreviewRuntime {
  throw new Error("Preview runtime is not implemented");
}
