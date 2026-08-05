# GENERAL_GRAMMAR_TEST_PLAN.md - Testing & QA Automation Plan

Verification matrix, unit tests, integration tests, and Playwright UI tests for the General Communication Grammar Module.

---

## 1. Automated Test Suites

1. **Vitest Unit & Integration Tests (`src/lib/validation/__tests__/grammar-module.test.ts`)**:
   - Test 1: Verify presence of authentic Chinese (HSK) and English (CEFR) lessons.
   - Test 2: Purge dummy placeholder titles ("Bài 248").
   - Test 3: Validate multi-parameter filtering by level and daily topic.
   - Test 4: Validate Sentence Scrambler token arrays.
   - Test 5: Verify Comparison Studio, Error Lab, and Dialogue Lab datasets.
   - Test 6: Verify zero factory/industrial example contamination in general grammar catalog.

2. **TypeScript Strict Typecheck**:
   - `pnpm exec tsc --noEmit` -> Must return 0 errors.

3. **Data Pipeline Validation**:
   - `pnpm exec tsx scripts/validate-and-seed-grammar.ts` -> Must execute with 100% success.

---

## 2. Manual Browser & UI Verification Matrix

- [x] Open `http://localhost:3000/grammar`.
- [x] Toggle Simplified vs Traditional Hanzi.
- [x] Toggle Pinyin tone marks on/off.
- [x] Test Web Speech API Chinese TTS (`zh-CN`) and English TTS (`en-US`).
- [x] Test multi-dimensional filter bar (Level, Topic, Search Query).
- [x] Open Comparison Studio and inspect `必须 vs 应该 vs 禁止` and `Must vs Should`.
- [x] Perform interactive Sentence Scrambler exercise and check scoring.
