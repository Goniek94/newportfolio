# Mateusz Goszczycki — Portfolio

Personal portfolio site for **Mateusz Goszczycki**, full-stack engineer.
Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.

Live: <https://mateusz-goszczycki.vercel.app>

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4 + CSS variables for fluid typography
- **Animation:** Framer Motion (page transitions, hover/scroll effects)
- **Icons:** react-icons
- **Linting:** ESLint 9 + `eslint-config-next`

## Structure

```
src/app/
├── components/         # Top-level page sections + reusable widgets
│   ├── Hero.tsx
│   ├── AboutMe.tsx
│   ├── Projects.tsx
│   ├── Contacts.tsx
│   ├── InitialLoader.tsx
│   ├── CustomCursor.tsx
│   ├── VSCodeViewer.tsx           # Modal: VSCode-style code preview
│   ├── ProjectsVaultModal.tsx     # Modal: project picker
│   ├── InteractiveCVModal.tsx     # Modal: long-form CV view
│   └── about/                     # AboutMe sub-components (Terminal, Counter, …)
├── data/
│   ├── projects.ts                # Project case studies (used by Projects.tsx)
│   ├── hero-quotes.tsx            # Rotating hero quotes
│   └── vscode/                    # Snippet bundles rendered inside VSCodeViewer
│       ├── autosell/
│       ├── matchdays/
│       └── windows_xp/
├── hooks/
│   └── useIsTouch.ts              # SSR-safe pointer-coarse detection (useSyncExternalStore)
├── globals.css
├── layout.tsx
└── page.tsx
```

The `data/vscode/*` files export **string literals** of code from the author's
real projects. They are rendered inside the in-page "VSCode" modal — they are
not executable modules.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Quality

```bash
npm run typecheck    # tsc --noEmit
npm run lint
npm run build
```

## Deployment

Deployed on Vercel. `app/layout.tsx` declares the canonical URL, OpenGraph
metadata and Twitter Card metadata for social previews.
