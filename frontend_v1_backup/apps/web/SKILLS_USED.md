# SKILLS_USED.md - Registered Skills & Application Allocation

The following skills available in the environment are activated and applied to the Pronunciation Module (Minimal Pair Trainer & Shadowing Recorder):

| Skill Name | Allocation Area | Specific Purpose / Application |
|---|---|---|
| `pronunciation-validator` | Data & Audio Validation | Phonetic matching algorithms, Mandarin Pinyin tone verification, IPA phoneme mapping, zero-synthetic score policy. |
| `audio-pack-builder` | Audio Engine | HTML5 Web Audio API synthesis, online TTS provider failover chain (`zh-CN`, `en-US`, `en-GB`), recording buffer handling. |
| `chinese-content-importer` | Data Engineering (Chinese) | Mandatory Mandarin Pinyin dataset formatting, factory technical terms (safety, production, quality control, maintenance). |
| `english-cefr-importer` | Data Engineering (English) | CEFR-graded factory English terms, US vs UK IPA distinction (`/θ/`, `/i:/`, `/æ/`), factory conversation topics. |
| `frontend-design` | Frontend UI/UX | High-end dark industrial UI components, responsive layout, glassmorphic card borders, smooth 150-200ms transitions. |
| `high-end-visual-design` | Frontend Aesthetics | Titanium white typography, safety orange accents, emerald green verification badges, active sound wave visualizers. |
| `superpowers` | QA & Testing | Automated Vitest unit test suites, TypeScript strict type checking (`0 errors`), voice quality audit verification. |

### Subagent / Task Division:
1. **Audio and Recorder Task**: MediaRecorder Web Audio API capture, mic permission handler, blob playback, audio wave analyzer.
2. **Minimal Pair Data Task**: Expansion of `MINIMAL_PAIR_DATASET` covering Mandarin & English factory topics (safety, maintenance, quality, machinery).
3. **Shadowing Data Task**: Expansion of `SHADOWING_DATASET` covering complete factory sentences, Pinyin, IPA, Vietnamese translations, and topic filtering.
4. **Frontend UI Task**: High-end modular components (`ChineseMinimalPairTrainer`, `EnglishMinimalPairTrainer`, `ChineseShadowingRecorder`).
5. **Backend & Data Pipeline Task**: Zod schema definitions in `pronunciation-schema.ts` and dataset exports in `minimal-pair-dataset.ts` and `shadowing-dataset.ts`.
6. **Testing and QA Task**: Vitest unit test scenarios in `pronunciation-studio.test.ts` and audit scripts.
