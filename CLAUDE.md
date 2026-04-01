# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Data Helper — an AI-powered data visualization dashboard. Users upload CSV/XLSX files, AWS Bedrock (Amazon Nova Lite v1.0) suggests visualizations, and Recharts renders interactive dashboards. UI text and AI responses are in **Spanish**.

## Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Vite dev server at http://localhost:5173
pnpm build          # TypeScript check + Vite production build (output: dist/)
pnpm lint           # ESLint (flat config)
pnpm preview        # Preview production build
```

No test framework is configured.

## Environment

Required in `.env` (see `.env.example`):
```
VITE_AGENT_ID=...
VITE_AGENT_ALIAS_ID=...
VITE_API_BASE_URL=/api/v1   # optional, defaults to /api/v1
```

Validated at startup by `src/lib/env.ts`.

## Architecture

**Stack**: React 19 + TypeScript (strict) + Vite + Tailwind CSS v4 + shadcn/ui + Zustand + Recharts + Axios

### Feature-based structure

- `src/features/workspaces/` — workspace lifecycle (views + Zustand store)
- `src/features/charts/` — chart rendering components
- `src/components/` — shared layout (sidebar, header, nav)
- `src/components/ui/` — shadcn/ui primitives
- `src/services/api.ts` — Axios client with centralized error handling
- `src/types/index.ts` — all TypeScript type definitions
- `src/lib/` — `utils.ts` (cn, generateId, formatDate), `env.ts`

### Workspace state machine

`WorkspaceContent.tsx` routes views based on workspace status:

`empty` → `prompted` → `selecting` → `building` → `ready` | `error`

State lives in a single Zustand store (`useWorkspaceStore`) persisted to localStorage under key `data-helper-workspaces`.

### Data flow

1. **PromptView** — user uploads file + prompt → `api.ingestData()` → AI returns suggested charts
2. **SelectionView** — user picks charts → `api.transformCharts()` (one call per chart) → built chart data
3. **DashboardView** — renders charts via `ChartRenderer`, which maps `ChartKind` to the appropriate viz component

### Chart type routing

`ChartRenderer.tsx` switches on `chart.chart_type` (a `ChartKind` union) to render `LineViz`, `BarViz`, `AreaViz`, `PieViz`, `DonutViz`, `ScatterViz`, `HistogramViz`, etc. Unimplemented types (`box`, `heatmap`, `treemap`) fall back to `LineViz`.

### AI agent design

The Bedrock agent always returns exactly 3 chart suggestions as JSON (no prose). It uses a closed set of chart types aligned with what the frontend supports. Fallback rules ensure 3 charts even with limited column types. See README.md sections 1–12 for rationale.

## Key Conventions

- **Path alias**: `@/` maps to `src/` (configured in tsconfig and vite)
- **Styling**: Tailwind utility classes + OKLCH CSS variables for theming (light/dark via next-themes)
- **Class merging**: always use `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- **Icons**: lucide-react (tree-shakeable, import only what you use)
- **ESLint**: flat config in `eslint.config.js` (no .eslintrc) — typescript-eslint + react-hooks + react-refresh
- **No Prettier** — formatting handled by ESLint
- **Package manager**: pnpm
