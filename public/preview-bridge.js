// Runs inside the sandboxed preview iframe. Receives { type: 'render', code }
// from the parent, transforms with Babel, executes the module via a blob URL
// (imports resolve through the generated import map), and reports back
// { type: 'rendered' } or { type: 'error', error: VerifyError }.
import * as React from "react";
import { createRoot } from "react-dom/client";

const ORIGIN = window.location.origin;
const mount = document.getElementById("root");

let root = null;
let renderFailed = false;

function post(message) {
  window.parent.postMessage(message, ORIGIN);
}

function postRenderError(err) {
  renderFailed = true;
  const error = {
    kind: "render",
    message: err && err.message ? err.message : String(err),
  };
  if (err && err.stack) error.stack = err.stack;
  if (err && err.loc) error.loc = `${err.loc.line}:${err.loc.column}`;
  post({ type: "error", error });
}

function applyTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  document.documentElement.classList.toggle("dark", next === "dark");
  document.documentElement.classList.toggle("light", next === "light");
}

async function render(code) {
  renderFailed = false;
  try {
    // The .tsx filename is what makes preset-typescript parse JSX.
    const transformed = window.Babel.transform(code, {
      filename: "Generated.tsx",
      presets: ["typescript", ["react", { runtime: "automatic" }]],
    }).code;

    const url = URL.createObjectURL(
      new Blob([transformed], { type: "text/javascript" })
    );
    let mod;
    try {
      mod = await import(url);
    } finally {
      URL.revokeObjectURL(url);
    }

    const Component = mod.default;
    if (typeof Component !== "function") {
      throw new Error("Generated code must default-export a React component");
    }

    if (root) root.unmount();
    root = createRoot(mount, { onUncaughtError: postRenderError });
    root.render(React.createElement(Component));

    // Two frames so the commit (and any crash it surfaces through
    // onUncaughtError) lands before success is reported.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!renderFailed) post({ type: "rendered" });
      })
    );
  } catch (err) {
    postRenderError(err);
  }
}

window.addEventListener("error", (event) => {
  postRenderError(event.error || new Error(event.message));
});
window.addEventListener("unhandledrejection", (event) => {
  postRenderError(event.reason);
});

window.addEventListener("message", (event) => {
  if (event.origin !== ORIGIN) return;
  const data = event.data || {};
  if (data.type === "render") render(String(data.code || ""));
  if (data.type === "setTheme") applyTheme(data.theme);
});

applyTheme(document.documentElement.dataset.theme);
post({ type: "ready" });
