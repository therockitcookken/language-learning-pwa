# Foundation and Core Learning Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a runnable, tested first vertical slice for guest industrial-language learning.

**Architecture:** A Next.js App Router application exposes validated route handlers backed by Prisma repositories. Shared domain functions implement normalised search, quiz scoring and SM-2 review scheduling; UI uses tokenised accessible components.

**Tech Stack:** Next.js, React, TypeScript strict, Tailwind CSS, Zod, Prisma/PostgreSQL, Vitest, Playwright, Docker Compose.

## Global Constraints

- Persist no secrets in source control; validate configuration with `.env.example`.
- All APIs validate input and return typed error envelopes.
- Support Vietnamese, simplified/traditional Chinese and English display from the first slice.
- Build guest flows before account-only enhancements.
- Run format, lint, typecheck, unit tests and production build for each accepted module.

---

### Task 1: Repository foundation

**Files:** Create root package/workspace config, `apps/web`, `packages/domain`, `packages/data`, `.env.example`, Docker files, README and CI scripts.

- [ ] Create a strict TypeScript workspace and Next.js application shell.
- [ ] Add a failing configuration validation test; run it and confirm failure before implementation.
- [ ] Implement environment schema and safe defaults; run the test to pass.
- [ ] Add Docker Compose PostgreSQL and a health check without credentials in Git.
- [ ] Run format, lint, typecheck, unit test and production build; commit `feat: scaffold application foundation`.

### Task 2: Domain and data slice

**Files:** Create Prisma schema, migration, vocabulary importer, validators, fixtures and domain tests.

- [ ] Write failing tests for multilingual search normalisation and SM-2 scheduling.
- [ ] Implement pure domain functions and verify tests pass.
- [ ] Define versioned vocabulary and progress tables with filter/search indexes.
- [ ] Create a repeatable seed fixture containing verified industrial terms and report exact counts.
- [ ] Run database integration test and commit `feat: add learning domain and seed pipeline`.

### Task 3: Guest dictionary and review loop

**Files:** Create dictionary API, search/detail pages, flashcard controls, quiz API/state, accessible UI tests and Playwright flow.

- [ ] Write failing API and component tests for search, favorite state, review grade and quiz answer persistence.
- [ ] Implement service/repository/route layers with Zod validation and rate-limit adapter.
- [ ] Implement responsive UI with keyboard focus and reduced-motion behavior.
- [ ] Add Playwright test for search → playback → flashcard → quiz → progress.
- [ ] Run full release gate and commit `feat: deliver guest learning loop`.

### Task 4: Review gate

**Files:** Create `reports/review-01` and update task board.

- [ ] Inspect diff, test output, accessibility scan and responsive screenshots.
- [ ] Fix all critical/high findings and re-run affected tests.
- [ ] Record verified scope and remaining limits; commit `docs: record foundation review`.
