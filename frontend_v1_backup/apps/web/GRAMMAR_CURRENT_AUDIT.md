# GRAMMAR_CURRENT_AUDIT.md - Thorough Audit of Current Grammar Module

This audit identifies all architectural, data, UI, and business logic shortcomings in the existing **"Ngữ pháp Nhà máy"** module.

---

## 1. MODULE ARCHITECTURE & MAPPING
- **Main View Component**: [`src/components/grammar/grammar-view.tsx`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/apps/web/src/components/grammar/grammar-view.tsx)
- **Data Generator / Seed**: [`src/lib/data/grammar-lessons.ts`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/apps/web/src/lib/data/grammar-lessons.ts)
- **Production Dataset**: [`src/lib/data/grammar-dataset.ts`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/apps/web/src/lib/data/grammar-dataset.ts)
- **API Endpoint**: [`src/app/api/v1/grammar/lessons/route.ts`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/apps/web/src/app/api/v1/grammar/lessons/route.ts)
- **Prisma Schema**: `GrammarLesson` table in [`prisma/schema.prisma`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/prisma/schema.prisma)

---

## 2. AUDIT FINDINGS & RECTIFICATIONS

### A. Dummy Data & Synthetic Loops:
- **Prior Issue**: `grammar-lessons.ts` had a synthetic loop `generateFullGrammarLessons()` generating 200+ dummy placeholder titles like "Cấu trúc tiếng Trung giao tiếp nhà máy Bài 248".
- **Rectification**: Purged loop entirely. Pointed exports to verified production dataset [`grammar-dataset.ts`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/apps/web/src/lib/data/grammar-dataset.ts).

### B. Filter Bar Multi-dimensionality:
- **Prior Issue**: UI only supported simple sub-tabs.
- **Rectification**: Added Multi-dimensional Filter Bar with Level Filter (`HSK1-6`, `A1-C2`), Topic Filter (`Safety`, `QC`, `Maintenance`, `Assembly Line`, `Production`, `Emergency`), and Search Query input.

### C. Sentence Scrambler & Interactive Exercises:
- **Prior Issue**: Sentence scrambler was hardcoded to 1 static sentence.
- **Rectification**: Dynamically pulls scrambled words and correct order from the currently selected grammar lesson in both Chinese and English.

### D. Audio & Voice Service:
- **Prior Issue**: Lack of sound buttons for example sentences.
- **Rectification**: Integrated `pronunciationAudioService` sound playback with `zh-CN` / `en-US` language routing.

### E. Simplified & Traditional Chinese Support:
- **Prior Issue**: Chinese grammar only supported simplified characters.
- **Rectification**: Added toggle between 简体 (Simplified) and 繁體 (Traditional) Chinese views.
