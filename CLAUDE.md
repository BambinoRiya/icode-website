# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**.

```bash
pnpm dev      # start dev server (Next.js)
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint .
```

There is no test suite configured in this repo. `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `pnpm build` will succeed even with type errors — run `tsc --noEmit` manually if you need a real type check.

## Architecture

This is a Next.js 16 App Router site (originally scaffolded by v0.app — see the `v0 sandbox internal files` entries in `.gitignore`) for "iCODE Abakwa," combining a public marketing site with a small Supabase-backed CMS covering three content types: Field Notes (articles), Systems, and Events.

### Public site vs. CMS split

- `app/page.tsx`, `app/team/page.tsx` and the section components in `components/` (`hero-section`, `systems-section`, `events-section`, `field-notes-section`, `live-mode-section`, `navbar`, `footer`) make up the marketing homepage. Each data-backed section (`systems-section`, `events-section`, `field-notes-section`) follows the server/client pairing pattern below and renders **only** published rows from Supabase — there is no static fallback data, so an empty table means an empty section.
- `app/field-notes/page.tsx` + `app/field-notes/[slug]/page.tsx`, `app/systems/page.tsx` + `app/systems/[slug]/page.tsx`, and `app/events/page.tsx` are the public listing/detail pages for each content type, reading from `field_notes`, `systems`, and `events` respectively.
- `app/icode-hq/**` is a self-serve admin CMS (login, signup, dashboard for Field Notes, `systems/`, `events/`) gated by Supabase Auth, with a create/edit page per content type at `<section>/[id]/page.tsx` (`id === 'new'` for create). The path is intentionally not `/admin` and is not linked from the public site (no navbar/footer link) — `lib/supabase/proxy.ts` enforces the redirect-to-login **server-side** for any unauthenticated request under `/icode-hq` (excluding `/icode-hq/login` and `/icode-hq/signup`), and `app/robots.ts` + `app/icode-hq/layout.tsx` keep the whole section out of search indexes. See `CMS_GUIDE.md` for the end-user-facing description of the Field Notes workflow (article fields, slug generation, publish/draft state, `field_notes` schema).

### Supabase integration (three separate clients — don't mix them up)

- `lib/supabase/client.ts` — browser client (`createBrowserClient`), used in `'use client'` components, e.g. the admin dashboard/login pages.
- `lib/supabase/server.ts` — server client (`createServerClient` + `next/headers` cookies), for use inside Server Components/Route Handlers. Per the comment in the file, always instantiate a fresh client per request — do not hoist it into a module-level variable (Fluid compute safety).
- `lib/supabase/proxy.ts` (`updateSession`) — invoked from the root `proxy.ts` (this project's Next.js middleware, renamed from `middleware.ts` to `proxy.ts`) on every request except static assets, to refresh the auth session cookie and redirect unauthenticated users away from `/icode-hq/*` (the admin CMS).
- `lib/articles.ts`, `lib/systems-data.ts`, and `lib/events-data.ts` each create their own plain `@supabase/supabase-js` client (not the SSR-aware one) for public reads (`getPublishedArticles()`, `getAllSystems()`, `getAllPublishedEvents()`, etc.), since these don't depend on auth/cookies. Admin pages under `app/icode-hq/**` instead query the tables directly via the browser client (`lib/supabase/client.ts`), since they need to see unpublished rows too.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (in `.env.local`, not committed).

### Server/Client component pairing pattern

Sections that need Supabase data follow a split pattern: an `async` Server Component fetches data and passes it as props to a `'use client'` companion component that owns interactivity/animation. Example: `components/field-notes-section.tsx` (server, calls `getPublishedArticles`) renders `components/field-notes-section-client.tsx` (client, uses `framer-motion`/`useInView`). Follow this pattern rather than fetching data inside client components.

Heavy/browser-only dependencies are lazy-loaded with `next/dynamic` and `ssr: false` — see `components/hero-section.tsx` loading `Logo3D` (the `three.js` / `@react-three/fiber` logo) this way.

### Article read time & content

- Article body content is stored as Tiptap JSON in the `body_content` JSONB column; `components/tiptap-editor.tsx` is the admin's rich-text editor.
- `lib/read-time.ts` derives read time (`calculateReadTime`, 200 wpm) from text extracted out of Tiptap JSON via `extractTextFromTiptap`.
- `lib/supabase/storage.ts` handles article image uploads/deletes against the `field-note-images` Supabase Storage bucket, storing under an `articles/` prefix with UUID filenames.

### UI components

`components/ui/` is a shadcn/ui set (`components.json`: style `new-york`, base color `neutral`, icon library `lucide`) built on Radix primitives. Use the `@/*` path alias (maps to repo root) and the existing `cn()` helper in `lib/utils.ts` (`clsx` + `tailwind-merge`) for conditional classNames — this is the established convention throughout `components/ui/`.

### Styling

Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`) — theme tokens (`--background`, `--primary`, `--radius`, etc.) are defined as CSS custom properties directly in `app/globals.css` under `:root` and mapped in an `@theme inline` block. Brand colors: primary `#e53888` (pink), secondary/accent `#0d9488` (teal). When adding new colors or radii, extend `app/globals.css` rather than introducing a separate Tailwind config.

### Images

`next.config.mjs` sets `images: { unoptimized: true }`, so `next/image` does not run through Next's image optimizer — remote article images (Supabase Storage, Unsplash, etc.) work without configuring `images.domains`/`remotePatterns`.
