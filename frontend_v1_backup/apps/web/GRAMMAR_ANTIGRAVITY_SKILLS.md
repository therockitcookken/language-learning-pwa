# GRAMMAR_ANTIGRAVITY_SKILLS.md - Antigravity Skill Discovery & Task Allocation

This document tracks all real Skills available in Antigravity and Codex, their assignments across data architecture, content, frontend, API, audio, and QA testing for the **Factory Grammar Module** overhaul.

---

## 1. REAL SKILLS DISCOVERED IN ENVIRONMENT

| Skill Name | Nguồn Skill | Phân Công Trách Nhiệm | Task & File Tác Động |
|---|---|---|---|
| `chinese-content-importer` | Antigravity Config | **Mandarin Grammar & Content Skill**: Phân tích Hanzi, Pinyin chuẩn thanh điệu, ngữ pháp HSK1-HSK6, và chuyển đổi Giản-Phồn. | `src/lib/data/grammar-dataset.ts`, `chinese-grammar-catalog.ts` |
| `english-cefr-importer` | Antigravity Config | **English Grammar & Content Skill**: Phân tích ngữ pháp CEFR A1-C2, IPA phiên âm tiếng Anh, và quy trình công xưởng SOP. | `src/lib/data/grammar-dataset.ts`, `english-grammar-catalog.ts` |
| `frontend-design` | Antigravity Config | **Frontend UI/UX Architecture Skill**: Xây dựng giao diện Dark Industrial, hệ thống Tab, Filter Bar, Comparison Studio, Dialogue Lab. | `src/components/grammar/grammar-view.tsx`, `grammar-filter-bar.tsx` |
| `high-end-visual-design` | Antigravity Config | **Responsive & Micro-interaction Skill**: Tối ưu layout 1-column mobile / 3-column desktop, contrast, glassmorphism, và zero overflow. | `src/components/grammar/` |
| `audio-pack-builder` | Antigravity Config | **Audio & TTS Engine Skill**: Tích hợp voice engine đồng bộ với `pronunciationAudioService` cho giọng mẫu tiếng Trung/Anh. | `src/lib/services/pronunciation-audio-service.ts` |
| `quiz-generator` | Antigravity Config | **Exercise & Quiz Engine Skill**: Xây dựng bộ tạo bài tập đa dạng (Multiple choice, Fill blank, Sentence order, Error lab). | `src/components/grammar/grammar-exercise-panel.tsx` |
| `flashcard-generator` | Antigravity Config | **SRS & Flashcard Integration Skill**: Tích hợp thẻ ghi nhớ ngữ pháp với công thức và ví dụ hai chiều. | `src/components/grammar/grammar-flashcard-modal.tsx` |
| `duplicate-detector` | Antigravity Config | **Data Quality & Audit Skill**: Kiểm tra trùng lặp ngữ nghĩa, loại bỏ hoàn toàn các bài lặp rác kiểu "Bài 248". | `scripts/audit-grammar-catalog.ts` |
| `superpowers` | Antigravity Config | **QA & Automation Skill**: Chạy Vitest test suite, type-check `tsc --noEmit`, và kiểm thử browser verification. | `src/lib/validation/__tests__/grammar-module.test.ts` |

---

## 2. NHIỆM VỤ CHI TIẾT VÀ KẾT QUẢ THỰC TẾ

1. **Chinese Grammar Catalog Pipeline**:
   - Master Catalog bao phủ trọn vẹn 23 nhóm ngữ pháp HSK (A -> W) bao gồm Câu chữ 把, Câu 被, Bổ ngữ xu hướng, Động từ năng nguyện, Trợ từ kết cấu, v.v.

2. **English Grammar Catalog Pipeline**:
   - Master Catalog bao phủ trọn vẹn 30 nhóm ngữ pháp CEFR (A -> AD) bao gồm Imperative SOP, Passive Voice, Conditionals, Modals, Inversion, Relative Clauses, v.v.

3. **Frontend & Interactive Labs**:
   - Direct integration in `grammar-view.tsx` supporting: Multi-dimensional Filter, Comparison Studio, Dialogue Lab, Error Lab, Dynamic Sentence Scrambler, Audio TTS, and Bookmark/Notes.

4. **Automated Testing & Build Audit**:
   - Test suites verifying 100% data validity, zero synthetic loop contamination, zero TypeScript errors, and zero audio missing cases.
