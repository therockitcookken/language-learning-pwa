# GENERAL_GRAMMAR_FRONTEND_PLAN.md - Frontend UI/UX Upgrade Plan

Frontend user interface layout, tabs, filter drawers, search normalization, and interactive practice components for the General Communication Grammar Module.

---

## 1. UI Components & Layout Architecture

- **Main Page**: `src/app/grammar/page.tsx`
- **Header Stats & Progress**:
  - Catalog totals (Chinese HSK 1-6 & English CEFR A1-C2).
  - Learned & Review status indicators.
  - Simplified / Traditional Hanzi toggle.
  - Pinyin / IPA pronunciation guide toggle.

- **Workspace Tabs**:
  1. 🇨🇳 Ngữ pháp Tiếng Trung (Chinese HSK 1-6)
  2. 🇬🇧 Ngữ pháp Tiếng Anh (English CEFR A1-C2)
  3. 📝 Bộ bài tập (Interactive Exercise Suite)
  4. ⚖️ Comparison Studio (70 Structure Comparison Sets)
  5. 💬 Dialogue Lab (General Daily Conversations)
  6. 🔬 Error Lab (Vietnamese Learner Error Corpus)
  7. 📇 Flashcards (Spaced Repetition SM-2 Flashcards)
  8. 🔖 Bookmark & Ghi chú (Saved Notebook & Notes)

- **Search & Filter Command Bar**:
  - Real-time search across Hanzi, Pinyin with/without tones, Vietnamese, English, formulas, and keywords.
  - Multi-select filters: Language, Level (`HSK1-6`, `A1-C2`), Topic (`daily-life`, `travel`, `dining`, `shopping`, `hobbies`...), Register (`spoken`, `written`, `polite`), and Status.

---

## 2. Interactive Feature Components

1. **Grammar Detail Drawer / Modal**:
   - Displays all 47 attributes: Formula, Breakdown Analysis, Explanation, Usage, Forbidden Cases, Exceptions, 5+ Correct Examples, 2+ Dialogue Examples, 2+ Wrong Examples with Fix, 3+ Vietnamese Error Patterns, Comparison Matrix, Daily Dialogue, and Core Vocabulary.
2. **Native Web Speech TTS Player**:
   - Audio button calling Web Speech API (`zh-CN` voice for Chinese Hanzi input, `en-US` voice for English).
3. **Interactive Exercise Engine**:
   - Sentence Scrambler (drag/drop token ordering), Quick Check diagnostic, Multiple Choice, and Final Quiz with scoring.
