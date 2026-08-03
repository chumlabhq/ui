# Contributing to Chumlab UI

Thank you for your interest in contributing to Chumlab UI!

## Reporting a bug

Open a [bug report](https://github.com/chumlabhq/ui/issues/new?template=bug_report.yml).
The form asks for the component, a reproduction, your `@chumlab/ui` and React
versions, and how you load the styles — those five fields are usually the
difference between a bug being fixed quickly and it waiting on follow-up
questions.

A reduced reproduction (StackBlitz, CodeSandbox, or a minimal snippet) is worth
more than a long description.

## Requesting a feature

Open a [feature request](https://github.com/chumlabhq/ui/issues/new?template=feature_request.yml).
Lead with the problem rather than the proposed API — it usually produces a
better design, and sometimes the library already covers it via `className`, the
`classes` slot map, `--cl-*` tokens, or a `render*` prop.

## Questions

Usage questions belong in
[Discussions](https://github.com/chumlabhq/ui/discussions) or the
[docs](https://chumlab.com/getting-started), not the issue tracker.

## Triage

Issues and pull requests are reviewed and merged at the maintainer's discretion.
Not every request will be accepted — a small, coherent API is worth more than a
complete one. If a change is significant, please open an issue before writing
code so the approach can be agreed first.

## Getting Started

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Development

### Project Structure

```
src/
├── components/       # All UI components
│   └── ComponentName/
│       ├── ComponentName.tsx      # Main component
│       ├── index.ts               # Public exports
│       ├── utils/
│       │   ├── types.ts           # TypeScript types
│       │   ├── constants.ts       # Default classes and constants
│       │   ├── helpers.ts         # Utility functions (if needed)
│       │   ├── context.ts         # React context (if needed)
│       │   └── icons.tsx          # Component-specific icons (if needed)
│       ├── components/            # Sub-components (if needed)
│       └── __tests__/             # Unit tests
├── utils/            # Shared utilities
├── pages/            # Demo pages (not part of library)
└── index.ts          # Library entry point
```

### Component Conventions

- Use `forwardRef` for all components
- Export named types from `utils/types.ts`
- Provide a `classes` prop for CSS class overrides
- Support `unstyled` mode
- Include `data-*` attributes for styling hooks
- Use `cn()` utility for class merging

The `## All Props` table in each component's `.ai.md` is **generated** from its
`.schema.json` — edit the schema and run `node scripts/generate-ai-md-props.mjs
--all`, then `npm run build:llms`. Hand edits to that table are overwritten.

### Testing

- **Unit tests**: `npm run test` (Vitest)
- **E2E tests**: `npm run test:e2e` (Playwright)
- **Coverage**: `npm run test:coverage`

All components must have unit tests. Target 90%+ coverage.

### Accessibility

All components must meet WCAG 2.1 AA standards:
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

### Code Style

- TypeScript strict mode
- ESLint with `npm run lint`
- No `any` types
- Named exports (for tree-shaking)

## Pull Requests

1. Create a feature branch from `main`
2. Write tests for new functionality
3. Ensure all tests pass: `npm run test:all`
4. Ensure no lint errors: `npm run lint`
5. Submit a PR with a clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
