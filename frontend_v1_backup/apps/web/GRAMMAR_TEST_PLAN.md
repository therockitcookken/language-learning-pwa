# GRAMMAR_TEST_PLAN.md - Quality Assurance & Automated Test Strategy

This document outlines the testing strategy, test suites, quality audit scripts, and verification commands for the **Factory Grammar System**.

---

## 1. AUTOMATED TEST SUITES

```
src/lib/validation/__tests__/
├── grammar-module.test.ts             # Dataset integrity, level taxonomy, topic filtering, and sentence scrambler tests
├── dictionary-frontend.test.ts        # Dictionary & search tests
├── vocabulary-integrity.test.ts       # Vocabulary dataset integrity tests
├── pronunciation-voice-router.test.ts # Voice router & single source of truth state tests
└── pronunciation-studio.test.ts       # Studio component tests
```

---

## 2. TEST CASES IN `grammar-module.test.ts`
1. **Production Dataset Integrity**: Verify `GRAMMAR_DATASET` contains valid Chinese and English lessons.
2. **Zero Synthetic Contamination**: Verify 0 items contain fake loop titles ("Bài 248").
3. **Multi-dimensional Filtering**: Test `getGrammarLessons` filtering by `lang`, `level`, `topic`, and `searchQuery`.
4. **Sentence Scrambler Data Integrity**: Verify all records have non-empty `scrambledWords` and `correctOrder` arrays.

---

## 3. VERIFICATION COMMANDS
```bash
# 1. Run Vitest Unit Tests
npx vitest run src/lib/validation/__tests__/grammar-module.test.ts

# 2. Run All Unit Test Suites
npx vitest run src/lib/validation/__tests__/

# 3. Voice Quality Audit Script
npx tsx scripts/audit-pronunciation-voices.ts

# 4. TypeScript Compilation Check
npx tsc --noEmit
```
