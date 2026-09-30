// The development warnings read `process.env.NODE_ENV`, which the library build
// leaves in place for the consumer's bundler to replace. Declared here rather
// than through @types/node: tsc does not emit a .d.ts input, so the published
// declarations never gain a Node reference or a global `process`.
declare const process: { readonly env: { readonly NODE_ENV?: string } };
