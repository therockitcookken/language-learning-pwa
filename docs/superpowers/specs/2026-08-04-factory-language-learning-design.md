# Factory Language Learning Design

The product is a Vietnamese-first industrial-language learning PWA. It gives a guest user a complete initial study loop — search an industrial term, hear it, save it, review it as a flashcard, complete a quiz and see progress — before asking for an account. Accounts synchronise progress and unlock administration according to server-enforced roles.

The application starts as a modular Next.js monorepo backed by PostgreSQL and Prisma. Content is imported and versioned through licensed sources rather than embedded in UI code. A layered token-based interface favours reliable mobile use in industrial contexts and respects reduced motion and accessibility needs.

The first release is delivered as testable vertical slices. Large catalogue targets are achieved by a documented, repeatable data pipeline with exact reports; the product will never represent incomplete data as complete.
