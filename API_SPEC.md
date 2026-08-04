# API Specification

All endpoints return `{ data }` on success and `{ error: { code, message, requestId } }` on failure.

- `GET /api/v1/dictionary/search`: authenticated or guest; query, language and filters; paginated results.
- `GET /api/v1/vocabulary/:id`: entry, senses, examples and pronunciation metadata.
- `POST /api/v1/flashcards/:id/review`: authenticated or guest; grade Again/Hard/Good/Easy; returns next schedule.
- `POST /api/v1/quizzes`: creates a persisted quiz session from a filter or learning path.
- `POST /api/v1/quizzes/:id/answers`: validates and scores one answer idempotently.
- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`: secure cookie session flows.
- `GET /api/v1/admin/content/*`, `POST /api/v1/admin/imports`, `POST /api/v1/admin/export`: editor/admin role enforced server-side.

Mutations validate body schemas, enforce origin/CSRF requirements, rate limit by actor and route, and log request IDs without sensitive payloads.
