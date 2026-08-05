# GRAMMAR_SKILLS_ORCHESTRATION.md - Skill Allocation & Pipeline Orchestration

This document details the multi-skill orchestration plan for overhauling the **"NGỮ PHÁP NHÀ MÁY – TIẾNG TRUNG VÀ TIẾNG ANH"** (Factory Grammar) module across Phase A (Data Pipeline) and Phase B (Frontend/Backend System Integration).

---

## 1. REGISTERED SKILLS & TASK ALLOCATION

| Skill Name | Nguồn Skill | Phân Công Chuyên Môn | Modules / Files Tác Động | Input & Output Mong Đợi |
|---|---|---|---|---|
| `chinese-content-importer` | Antigravity Config | **Chinese Grammar Data Skill**: Xây dựng bộ dữ liệu ngữ pháp HSK1-HSK6 công nghiệp chuẩn tiếng Trung. | `src/lib/data/grammar-dataset.ts`, `prisma/schema.prisma` | Input: Quy tắc HSK & bối cảnh nhà máy.<br/>Output: Schema-compliant `GrammarLessonRecord[]` với Pinyin, Hán tự, công thức, ví dụ đúng/sai, lỗi thường gặp. |
| `english-cefr-importer` | Antigravity Config | **English Grammar Data Skill**: Xây dựng bộ dữ liệu ngữ pháp CEFR A1-C2 công nghiệp chuẩn tiếng Anh. | `src/lib/data/grammar-dataset.ts`, `prisma/schema.prisma` | Input: Quy tắc CEFR & SOP công xưởng.<br/>Output: Schema-compliant `GrammarLessonRecord[]` với IPA, công thức, ví dụ đúng/sai. |
| `frontend-design` | Antigravity Config | **Frontend UI/UX & Component Architecture Skill**: Thiết kế lại giao diện Ngữ pháp Nhà máy chuẩn Dark Industrial. | `src/components/grammar/grammar-view.tsx`, `grammar-lesson-detail.tsx`, `grammar-filter-bar.tsx` | Input: Design Tokens & Layout Grid.<br/>Output: Giao diện mượt mà, hỗ trợ lọc đa chiều, chuyển Tab `zh` / `en` / `exercises` instant. |
| `high-end-visual-design` | Antigravity Config | **Responsive & Accessibility Skill**: Tối ưu hiển thị mobile/desktop, tương phản chữ, không bị tràn dòng hay vỡ khung. | `src/components/grammar/` | Input: Breakpoints & Contrast ratios.<br/>Output: Zero layout overflow, hỗ trợ phím tắt Esc/Tab, contrast ratio > 4.5:1. |
| `audio-pack-builder` | Antigravity Config | **Audio & TTS Engine Skill**: Tích hợp nút phát âm ví dụ ngữ pháp tiếng Trung/Anh chuẩn giọng. | `src/lib/services/pronunciation-audio-service.ts` | Input: Text & Lang code (`zh-CN`, `en-US`).<br/>Output: Âm thanh chuẩn phổ thông không delay. |
| `superpowers` | Antigravity Config | **Test & QA Skill**: Tự động hóa kiểm thử Vitest, audit dữ liệu, TypeScript typecheck (`0 errors`). | `src/lib/validation/__tests__/grammar-module.test.ts` | Input: Validation rules.<br/>Output: `100% Passed` unit test suite. |

---

## 2. QUY TRÌNH PHỐI HỢP VÀ GIAO NHIỆM VỤ

1. **Grammar Data Architecture Task**:
   - Định nghĩa `GrammarLessonRecord` schema mở rộng trong `src/lib/data/grammar-dataset.ts` hỗ trợ 23 chủ đề công xưởng, HSK1-HSK6, CEFR A1-C2, bối cảnh nhà máy, và công thức cấu trúc.

2. **Chinese & English Data Population Task**:
   - Loại bỏ hoàn toàn hàm sinh dữ liệu giả `generateFullGrammarLessons()` với các bài học rác kiểu "Bài 248".
   - Nạp 40+ bài học ngữ pháp thực tế HSK1-HSK6 & CEFR A1-C2 về An toàn, Sản xuất, QC, Bảo trì, Giao ca, ISO, 5S-Kaizen.

3. **Database & API Integration Task**:
   - Cập nhật API route `/api/v1/grammar/lessons` hỗ trợ lọc theo `lang`, `level`, `topic`, `factoryDomain`, `searchQuery`.

4. **Interactive Exercise & Comparison Engine Task**:
   - Nâng cấp bộ bài tập xếp câu (Sentence Scrambler) với ngân hàng câu hỏi động từ dữ liệu thực.
   - Nâng cấp công cụ so sánh cấu trúc ngữ pháp (`必须 vs 应该`, `Passive vs Active`, `把 vs 被`).

5. **QA & Testing Task**:
   - Chạy Vitest test suite `grammar-module.test.ts`, kiểm tra `npx tsc --noEmit` và audit không còn dữ liệu giả.
