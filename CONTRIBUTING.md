# Contributing to Chumlab UI

Thank you for your interest in contributing to Chumlab UI!

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
