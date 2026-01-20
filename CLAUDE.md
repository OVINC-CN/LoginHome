# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
yarn dev          # Start development server (port 5173)
yarn build        # Build for production (runs tsc then vite build)
yarn lint         # Run ESLint
yarn lint:fix     # Auto-fix ESLint errors
yarn preview      # Preview production build
```

## Architecture Overview

**LoginHome** is a React 19 + TypeScript authentication portal using Vite as the build tool.

### Key Architectural Patterns

**State Management**: Zustand store (`src/store/index.ts`) manages global state including user info, login status, and meta configuration loaded from backend API.

**Internationalization**: Custom i18n system (not react-i18next):
- `src/i18n/index.ts` - Core translation utilities
- `src/contexts/I18nContext.tsx` - React context provider
- `src/i18n/locales/zh.json` and `en.json` - Translation files
- Use `useI18n()` hook to access `t` (translations object) and `changeLocale`

**API Layer**: Axios-based HTTP client (`src/api/index.ts`) with:
- Automatic 401 redirect to `/login?next=...`
- Response unwrapping (returns `data` field directly)
- Backend URL from runtime config or env vars

**Runtime Configuration**: `src/context/index.ts` reads config from:
1. `window.ENV` (set by `public/config.js` at runtime)
2. Vite env vars (`import.meta.env`)

**Routing**: React Router v7 with `Layout` wrapper component. All routes defined in `src/App.tsx`.

**UI Components**: shadcn/ui components in `src/components/ui/`, built on Radix UI primitives with Tailwind CSS styling.

## Code Style Requirements

- Use yarn for package management
- Use eslint-config-alloy rules
- Never hardcode Chinese or English text - always use i18n translations
- Run `yarn lint` and `yarn build` after code changes
- Follow Apple Inc.'s minimalist aesthetic style
- Use `@/` path alias for imports (maps to `src/`)
