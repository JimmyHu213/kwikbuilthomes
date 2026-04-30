# KwikBuilt Homes

B2B modular housing catalog and quote management platform for KwikBuilt Pty Ltd — Australian-engineered modular homes for developers, builders, and sub-distributors.

## Stack

- **Framework:** Next.js 15 (App Router)
- **CMS:** Payload CMS 3 (embedded in Next.js)
- **Database:** PostgreSQL (via `@payloadcms/db-postgres`)
- **Storage:** Vercel Blob (`@payloadcms/storage-vercel-blob`)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **3D:** React Three Fiber + `@pascal-app/core` + `@pascal-app/viewer`
- **Icons:** lucide-react
- **Validation:** Zod
- **State:** Zustand
- **Hosting:** Vercel

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests (vitest)
npm run lint         # ESLint
npm run payload      # Payload CLI
npm run generate:types  # Regenerate Payload TypeScript types
```

## Git Workflow

- **NEVER** push directly to `main`. All changes must go through a pull request.
- **NEVER** merge PRs with admin privilege bypass. CI must pass and CodeRabbit must review.
- Always create a feature branch from `dev` or `main` for new work.
- Write clear commit messages: `feat:`, `fix:`, `chore:`, `style:`, `docs:`, `test:`, `refactor:`.
- Commit each major feature, fix, or update separately. Do not batch unrelated changes into a single commit.
- Always use **rebase merge** when merging PRs to keep git history linear and clean. No merge commits.
- **Always resolve merge conflicts before creating or pushing a PR.** Run `git fetch origin main && git merge origin/main` on the feature branch, resolve conflicts locally, then push. Never create PRs that have conflicts. Prefer creating branches from `origin/main` with cherry-picked commits for clean PRs.
- Do not commit `.planning/` docs to git.

## Coding Conventions

### Styling
- Use semantic design tokens only: `bg-primary`, `text-foreground`, `bg-secondary`, `border-border`, etc.
- **Never** use hardcoded hex colors (e.g., `#E8611A`). Always use the CSS custom properties defined in `globals.css`.
- Exception: The footer and dark sections use `bg-[#2D2D2D]` and `text-[#F5F3F0]` as established patterns.
- Brand palette: Primary Orange (`--primary`), Charcoal (`--foreground`), Gold/Amber (`--accent`), Warm Off-White (`--secondary`), Warm Light Gray (`--muted`), Warm Border (`--border`).

### UI Patterns
- Orange accent bars: `<div className="w-12 h-1 bg-primary mb-4" />`
- Section container: `max-w-7xl mx-auto px-6`
- Content pages: `max-w-4xl mx-auto px-6`
- Rounded pill CTAs: `rounded-full bg-primary px-8 py-3`
- Card style: `rounded-lg border border-border bg-secondary p-8`
- Icons from `lucide-react` only.

### General
- Prefer open-source tools and libraries.
- All marketing content is managed via Payload Globals (`SiteContent`, `SiteSettings`).
- Product data is managed via Payload collections.
- Server actions for form submissions. Zod for validation.
- Email builders are pure functions: `(data) => { subject, html }`.
- Always `escapeHtml()` user input in email templates.

## Project Structure

```
src/
├── app/
│   ├── (frontend)/       # Public-facing pages
│   │   ├── components/   # Frontend components
│   │   └── ...pages      # Route pages
│   └── (payload)/        # Payload admin panel
├── collections/          # Payload CMS collections
├── globals/              # Payload CMS globals (SiteContent, SiteSettings)
├── components/ui/        # shadcn/ui components
├── fields/               # Reusable Payload field groups
├── lib/
│   ├── actions/          # Server actions
│   ├── email/            # Email template builders
│   ├── schemas/          # Zod validation schemas
│   └── planner/          # Site planner utilities
└── seed/                 # Database seed scripts
```
