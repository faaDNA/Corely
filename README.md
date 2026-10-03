# Personal Dashboard

Full-stack personal productivity workspace: tasks, projects, notes, bookmarks, habits, and calendar in one dashboard.

## Struktur

```
personal-dashboard/
├── apps/web/          # Next.js app (App Router)
├── packages/ui/       # Shared UI components
├── packages/types/    # Shared TypeScript types
├── packages/config/   # Shared configs
├── pnpm-workspace.yaml
└── turbo.json
```

## Menjalankan

```bash
pnpm install
pnpm dev          # turbo run dev
```

Buka http://localhost:3000 (redirect ke /dashboard).

## Tech Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Radix UI · Lucide · next-themes · Recharts · @dnd-kit · react-hook-form · Zod · Turborepo · pnpm