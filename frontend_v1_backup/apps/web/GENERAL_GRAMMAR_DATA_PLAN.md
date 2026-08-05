# GENERAL_GRAMMAR_DATA_PLAN.md - Data Architecture & Schema Plan

Data schema, validation specifications, seed batch strategy, and database ingestion rules for the General Daily Life Communication Grammar System.

---

## 1. Database Schema & Prisma Entity Models

The Grammar Module utilizes the primary Prisma model `GrammarLesson` (stored in SQLite `prisma/dev.db`):

```prisma
model GrammarLesson {
  id              String        @id @default(uuid())
  language        String        // "zh" or "en"
  title           String
  titleVi         String
  titleEn         String
  titleZh         String?
  level           String        // HSK1-6 or A1-C2
  topic           String        // e.g. "daily-life", "travel", "dining", "shopping", "hobbies"
  factoryDomain   String        // Mapped to general communication domain (e.g. "giao_tiep", "du_lich")
  formula         String
  explanationVi   String
  explanationEn   String
  correctExample  String        // JSON array of correct daily life examples
  wrongExample    String        // JSON array of wrong examples + root cause + fix
  commonMistakes  String?       // JSON array of Vietnamese error patterns
  comparisonNotes String?       // Comparison table matrix
  factoryScenario String?       // Daily communication scenario roleplay data
  status          ContentStatus @default(PUBLISHED)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

---

## 2. Ingestion & Validation Pipeline Rules

1. **Strict 47-Attribute Enforcement**:
   - `id`, `language`, `titleVi`, `titleEn`, `level`, `topic`, `formula`, `explanationVi`, `communicativeFunction`, `usageConditions`, `forbiddenCases`, `exceptions`, `sentencePosition`, `registerStyle`, `correctExamples`, `wrongExamples`, `commonLearnerErrors`, `confusingStructures`, `comparisonTable`, `workplaceDialogue`, `coreVocabulary`, `quickCheck`, `fullQuiz`, `relatedLessons`, `flashcardData`, `audioText`, `searchKeywords`, `filterMetadata`.

2. **Idempotent Upsert Execution**:
   - `prisma.grammarLesson.upsert()` ensures zero duplicate records on repeated script executions.

3. **Zero Placeholder Policy**:
   - Rejects any titles containing "Bài 248", "Mẫu 248", or dummy loops.
