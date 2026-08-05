# PRONUNCIATION_DATA_PLAN.md - Data Architecture & Pipeline Spec

This document specifies the Data Schema, Pipeline, and Topic Architecture for **Minimal Pair Trainer** and **Shadowing Recorder** across Chinese (`zh-CN`) and English (`en-US` / `en-GB`).

---

## 1. DATA SCHEMA ARCHITECTURE

### Types & Enums:
- `LanguageCode`: `'zh-CN' | 'en-US' | 'en-GB'`
- `DifficultyLevel`: `'beginner' | 'elementary' | 'intermediate' | 'advanced'`
- `FactoryTopic`:
  `'general' | 'safety' | 'production' | 'warehouse' | 'quality' | 'maintenance' | 'machinery' | 'shift' | 'attendance' | 'packaging' | 'logistics' | 'electrical' | 'mechanical' | 'emergency' | 'management'`
- `TargetRole`: `'worker' | 'technician' | 'qa_inspector' | 'safety_officer' | 'shift_leader'`

### Minimal Pair Schema (`MinimalPairRecord`):
```ts
export interface MinimalPairRecord {
  id: string;
  langCode: LanguageCode;
  topic: FactoryTopic;
  difficulty: DifficultyLevel;
  targetRole: TargetRole;
  title: string;
  symbolA: string; // e.g. "b"
  symbolB: string; // e.g. "p"
  wordA: string; // e.g. "bā (八)"
  wordB: string; // e.g. "pā (趴)"
  phoneticA: string; // e.g. "bā"
  phoneticB: string; // e.g. "pā"
  hanziA?: string; // e.g. "八"
  hanziB?: string; // e.g. "趴"
  meaningViA: string; // e.g. "Số 8 / Kíp 8 tiếng"
  meaningViB: string; // e.g. "Nằm sấp / Tạm dừng"
  meaningEnA?: string;
  meaningEnB?: string;
  correctAnswer: 'A' | 'B';
  distinctionNote: string; // Detailed phonetic mouth shape tip in Vietnamese
  factoryContext: string; // e.g. "八小时工作制 vs 趴下休息"
  audioUrlA?: string;
  audioUrlB?: string;
}
```

### Shadowing Record Schema (`ShadowingRecord`):
```ts
export interface ShadowingRecord {
  id: string;
  langCode: LanguageCode;
  topic: FactoryTopic;
  difficulty: DifficultyLevel;
  targetRole: TargetRole;
  title: string;
  targetText: string; // e.g. "请定期检查机器配电箱。" / "Please inspect the power distribution box regularly."
  phonetic: string; // Pinyin / IPA
  meaningVi: string;
  meaningEn?: string;
  factoryContext: string;
  referenceAudioUrl?: string;
  slowSpeed: number; // e.g. 0.75
  normalSpeed: number; // e.g. 1.0
  keyVocabulary: { word: string; phonetic: string; meaningVi: string }[];
  audioWaveformSample?: number[];
}
```

---

## 2. DATASETS TO BE CREATED & POPULATED

1. **`src/lib/data/minimal-pair-dataset.ts`**:
   - 20+ verified factory Minimal Pair records for Chinese (`[b] vs [p]`, `[zh] vs [z]`, `[ch] vs [c]`, `[sh] vs [s]`, `[j] vs [z]`, `[q] vs [c]`, `[x] vs [s]`, `[n] vs [l]`, `[g] vs [k]`, `[h] vs [f]`).
   - 20+ verified factory Minimal Pair records for English (`/θ/ vs /s/`, `/v/ vs /b/`, `/i:/ vs /ɪ/`, `/æ/ vs /e/`, `/p/ vs /b/`, `/t/ vs /d/`, `/k/ vs /g/`, `/l/ vs /r/`).

2. **`src/lib/data/shadowing-dataset.ts`**:
   - 20+ verified factory Shadowing sentences for Chinese covering Safety, Production, Quality, Maintenance, Electrical, Emergency, Shift Change.
   - 20+ verified factory Shadowing sentences for English (US & UK accents) covering Assembly Line, Quality Control Inspection, Warehouse Logistics, Safety Warnings.

---

## 3. AUDIENCE & FACTORY CONTEXT COVERAGE
- **Assembly Workers**: Operational commands, safety warnings, shift handover.
- **Technicians & Electricians**: Machine maintenance, circuit breaker inspection, emergency shutdown.
- **QA Inspectors**: Tolerance checks, defect reports, calibration procedures.
- **Safety Officers**: PPE requirements, hazardous material handling, fire exit protocols.
