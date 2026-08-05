# GRAMMAR_FRONTEND_PLAN.md - UI/UX Architecture & Interactive Feature Specifications

This document outlines the Frontend UI/UX design, Responsive Layouts, Interactive Components, and Feature Modules for the **Factory Grammar System**.

---

## 1. FRONTEND SYSTEM ARCHITECTURE

```
src/components/grammar/
├── grammar-view.tsx                 # Main Container & State Manager
├── grammar-filter-bar.tsx             # Multi-dimensional Filter Bar (Level, Topic, Search)
├── grammar-lesson-detail.tsx          # Lesson Detail Display with Formula, Examples, Scenarios
├── grammar-comparison-modal.tsx       # Interactive Comparison Studio (必须 vs 应该, 把 vs 被)
├── sentence-scrambler-engine.tsx      # Dynamic Word Scrambler & Order Checker
└── grammar-audio-player.tsx           # Voice Engine Audio Playback Component
```

---

## 2. KEY UI/UX FEATURES & RESPONSIVE GUARANTEES

1. **Dark Industrial Aesthetic**:
   - Palette: Charcoal/Slate base (`#090d16`), Titanium White typography (`#f8fafc`), Safety Orange accents (`#f97316`), Emerald Green verification (`#10b981`), Rose Red error warnings (`#f43f5e`).
2. **Multi-dimensional Filter Bar**:
   - Filter by Level (`All`, `HSK1-6`, `A1-C2`).
   - Filter by Topic (`All`, `Safety`, `QC`, `Maintenance`, `Assembly Line`, `Production`, `Emergency`).
   - Search Query Input with instant live filtering across titles, formulas, and explanations.
3. **Simplified & Traditional Chinese Toggle**:
   - Instant toggle between 简体 (Simplified) and 繁體 (Traditional) Chinese views for all Chinese grammar lessons.
4. **Native TTS Sound Buttons**:
   - Integrated `pronunciationAudioService` sound playback (`zh-CN` / `en-US`) with single source of truth active voice selection.
5. **Interactive Comparison Studio**:
   - Modal comparing structure pairs: `必须 (bìxū) vs 应该 (yīnggāi) vs 禁止 (jìnzhǐ)`, `把 (bǎ) vs 被 (bèi)`, `Must vs Should`.
6. **Dynamic Sentence Scrambler Engine**:
   - Dynamically loads word tokens from the active lesson in Chinese or English.
   - Interactive word-click assembly, reset button, and correctness evaluation.
7. **CSV Export**:
   - Generates and downloads clean CSV cheat sheets with UTF-8 BOM encoding for Excel compatibility.
