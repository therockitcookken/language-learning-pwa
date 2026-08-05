# GENERAL_GRAMMAR_CURRENT_AUDIT.md - Grammar Module Audit Report

Comprehensive audit of the current Grammar Module code, data models, routes, components, and content context.

---

## 1. Context Audit & Factory Domain Elimination Focus

- **Current State**: The grammar module previously contained factory/industrial example sentences (e.g. `进入车间必须佩戴安全帽`, `传送带被硬物卡住了`, `Batch #402 was rejected`).
- **Required Action**: Remove/replace all industrial, factory, office, corporate, safety PPE, CNC, and shift report contexts from the **Grammar Module** and replace them with **General Daily Life Communication Contexts** (Daily life, family, friends, school, travel, shopping, dining, cooking, hobbies, sports, weather, emotions, social plans, public services, transportation, etc.).
- **Preservation Scope**: Vocabulary dictionary and pronunciation lab retain their domain terms for other modules; only the **Grammar Module** is refactored to General Communication.

---

## 2. Route & Component Architecture Audit

- **Route**: `src/app/grammar/page.tsx`
- **Catalog Dataset Aggregator**: `src/lib/data/grammar-dataset.ts`
- **Catalog Catalogs**:
  - `src/lib/data/grammar-catalogs/chinese-grammar-catalog.ts`
  - `src/lib/data/grammar-catalogs/english-grammar-catalog.ts`
  - `src/lib/data/grammar-catalogs/grammar-comparisons-catalog.ts`
  - `src/lib/data/grammar-catalogs/grammar-dialogues-catalog.ts`
  - `src/lib/data/grammar-catalogs/grammar-error-lab-catalog.ts`
- **Seed Pipeline**:
  - `src/lib/data/seeds/zh/*.json`
  - `src/lib/data/seeds/en/*.json`
  - `scripts/validate-and-seed-grammar.ts`
- **Database Schema**: Prisma `GrammarLesson` table (SQLite `dev.db`).
- **Test Suites**: `src/lib/validation/__tests__/grammar-module.test.ts`.

---

## 3. Mandatory 47-Attribute Quality Checklist Per Lesson

Every General Communication Grammar Lesson MUST contain:
1. `id`, 2. `slug`, 3. `language` (`zh` | `en`), 4. `level` (`HSK1-6` | `A1-C2`), 5. `grammarFamily`, 6. `grammarType`, 7. `topic` (Daily communication topics: `daily-life`, `travel`, `dining`, `shopping`, `hobbies`, `family`, `school`...), 8. `difficulty`, 9. `titleVi`, 10. `summaryVi`, 11. `learningGoals`, 12. `prerequisiteKnowledge`, 13. `formula`, 14. `breakdownAnalysis`, 15. `explanationVi`, 16. `meaning`, 17. `communicativeFunction`, 18. `usageConditions`, 19. `forbiddenCases`, 20. `exceptions`, 21. `sentencePosition`, 22. `registerStyle` (Spoken, written, casual, polite), 23. `formalityLevel`, 24. `correctExamples` (Min 5), 25. `dailyLifeExamples` (Min 2), 26. `wrongExamples` (Min 2 with root cause & fix), 27. `commonLearnerErrors` (Min 3 Vietnamese error patterns), 28. `confusingStructures`, 29. `comparisonTable`, 30. `dailyDialogue`, 31. `coreVocabulary`, 32. `quickCheck`, 33. `fullExerciseSuite` (A-K 11 exercise types), 34. `answerKeyWithExplanations`, 35. `relatedLessons`, 36. `flashcardData`, 37. `audioMetadata`, 38. `searchKeywords`, 39. `filterMetadata`, 40. `status`, 41. `contentVersion`, 42. `reviewStatus`, 43. `sourceLicense`, 44. `titleEn`, 45. `titleZhSimp`, 46. `titleZhTrad`, 47. `scrambledWords/correctOrder`.

---

## 4. Audit Findings Summary

- **Routes & UI Components**: Structurally sound, support filtering, search, audio playback, and modal drawer view.
- **Database & Prisma ORM**: `GrammarLesson` table present in `dev.db` and synchronized via `prisma db push`.
- **Validation Script**: `validate-and-seed-grammar.ts` functional, requires context check for general communication topics.
