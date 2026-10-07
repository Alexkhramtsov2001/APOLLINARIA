# APPOLINARIA — Portfolio

Interactive portfolio for Apollinaria Vorobyeva.

## Stack

- Semantic HTML5
- CSS split by responsibility
- TypeScript application source (`src/**/*.ts`)
- Vite
- Vitest
- Playwright
- ESLint + Prettier
- GitHub Actions
- Lighthouse CI budget

## Development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run test:e2e
npm run build
node tests/runtime-check.mjs
```

## Lighthouse

The Lighthouse script builds the project and starts its own preview server:

```bash
npm run lighthouse
```

CI also runs Lighthouse against the production build and enforces budgets for Performance, Accessibility, Best Practices and SEO.

## Architecture

- `src/main.ts` — application entry point
- `js/main.js` — generated browser runtime kept in sync by the build script
- `src/core/` — lifecycle, events, configuration and scroll state
- `src/components/` — reusable interface components
- `src/features/` — independent interactive features
- `src/data/` — typed content models and renderers
- `tests/` — unit/data/architecture and end-to-end tests

The visual design and existing portfolio content remain unchanged by the engineering upgrade.
