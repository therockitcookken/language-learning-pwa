# Architecture

## Chosen approach

Use a Next.js full-stack application with a layered server design: route handlers call application services, services enforce validation and authorization, repositories isolate Prisma access, and background-ready jobs are exposed through a queue adapter. This keeps the first deployable product compact without losing boundaries needed for later extraction.

## Components

- `apps/web`: Next.js App Router PWA, i18n, accessible responsive UI.
- `packages/domain`: shared entities, validators, spaced-repetition and quiz scoring logic.
- `packages/data`: Prisma schema, migrations, seed/import/validation scripts.
- `packages/ui`: design tokens and reusable components.
- `tests`: unit, integration and Playwright suites.

## Runtime services

PostgreSQL is required. Redis is optional behind a cache/queue interface. Object storage and external TTS are optional adapters; development uses local-safe implementations and never exposes API keys to the client.

## Security boundaries

Public routes permit guest sessions with a signed anonymous identifier. Authenticated routes validate session and role server-side. Admin-only mutations create audit events. All input is schema-validated; rate limits, CSRF protections for cookie mutations, secure headers and log redaction are mandatory release gates.
