# Factory Language Learning — Master Plan

## Product objective

Build a Vietnamese-first PWA for Vietnamese factory workers learning practical Mandarin and English. The product supports guest learning immediately, authenticated progress sync, content administration, structured imports, and measurable learning outcomes.

## Delivery phases

1. Foundation: monorepo, Next.js, strict TypeScript, Docker, PostgreSQL, Prisma, environment validation, CI-quality scripts.
2. Core learning: multilingual shell, searchable dictionary, pronunciation playback/recording fallback, grammar, flashcards, quiz engine, learning paths and progress.
3. Accounts and administration: guest-to-account migration, role-based authorization, admin content workflow, audit records, import/export.
4. Content and reliability: licensed data pipeline, validation, seed reporting, PWA/offline support, accessibility and performance checks.
5. Release readiness: end-to-end testing, ten review reports, security review, production build, operating documentation and deployment runbook.

## Scope control

Every phase ships a working vertical slice. The data pipeline must report exact imported counts and source licenses; target catalogue sizes are not claimed until validation completes. Paid speech or AI APIs remain optional adapters with browser/device fallbacks.

## Ownership

Codex owns architecture, integration, security decisions, code review and verification. Antigravity is assigned bounded design and implementation-review tasks; no output is accepted without repository checks.
