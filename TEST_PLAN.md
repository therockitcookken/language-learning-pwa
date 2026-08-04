# Test Plan

Unit tests cover validators, search normalization, SM-2 scheduling, scoring and authorization policies. Integration tests cover API contracts, database constraints, imports and guest-to-account migration. Playwright verifies guest dictionary search, pronunciation control, flashcard review, quiz persistence, progress dashboard, registration, admin content creation and responsive navigation. Release gates run format, lint, typecheck, unit/integration tests, Playwright, dependency audit and production build.
