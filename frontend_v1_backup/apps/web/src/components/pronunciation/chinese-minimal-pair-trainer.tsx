'use client';

import React, { useState, useMemo } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Factory,
} from 'lucide-react';
import { MINIMAL_PAIR_DATASET, FactoryTopic, MinimalPairRecord } from '@/lib/data/minimal-pair-dataset';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

interface MinimalPairTrainerProps {
  langCode?: 'zh-CN' | 'en-US' | 'en-GB';
}

export function ChineseMinimalPairTrainer({ langCode = 'zh-CN' }: MinimalPairTrainerProps) {
  const [selectedTopic, setSelectedTopic] = useState<FactoryTopic | 'all'>('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [activeStep, setActiveStep] = useState<'A' | 'B' | 'DONE' | null>(null);

  // Filter dataset by language code & topic
  const filteredDataset = useMemo(() => {
    return MINIMAL_PAIR_DATASET.filter((item) => {
      const matchLang = langCode.startsWith('zh') ? item.langCode.startsWith('zh') : item.langCode === langCode;
      const matchTopic = selectedTopic === 'all' || item.topic === selectedTopic;
      return matchLang && matchTopic;
    });
  }, [langCode, selectedTopic]);

  const activeRecord: MinimalPairRecord | undefined = filteredDataset[currentIdx] || filteredDataset[0];

  const handleNext = () => {
    if (currentIdx < filteredDataset.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setActiveStep(null);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setSelectedAnswer(null);
      setActiveStep(null);
    }
  };

  const handlePlayAB = () => {
    if (!activeRecord) return;
    pronunciationAudioService.compareMinimalPair(
      activeRecord.phoneticA,
      activeRecord.phoneticB,
      activeRecord.langCode,
      1.0,
      (step) => setActiveStep(step)
    );
  };

  const handleSelect = (choice: 'A' | 'B') => {
    setSelectedAnswer(choice);
  };

  return (
    <div className="bg-pure-surface border border-whisper-border p-5 sm:p-7 rounded-[4px] space-y-6 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-whisper-border pb-4">
        <div>
          <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-safety-orange" /> 3. MINIMAL-PAIR LISTENING TRAINER (LUYỆN PHÂN BIỆT ÂM DỄ NHẦM)
          </h3>
          <p className="text-xs font-sans text-muted-steel mt-1">
            Nghe và luyện tập phân biệt các cặp âm dễ phát âm sai của người Việt trong môi trường công xưởng.
          </p>
        </div>

        {/* Topic Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Filter className="w-4 h-4 text-safety-orange" />
          <select
            value={selectedTopic}
            aria-label="Chọn chủ đề công xưởng"
            onChange={(e) => {
              setSelectedTopic(e.target.value as any);
              setCurrentIdx(0);
              setSelectedAnswer(null);
            }}
            className="bg-canvas-ink border border-whisper-border text-titanium-white rounded px-2 py-1 text-xs font-mono font-bold"
          >
            <option value="all">🌐 Tất cả chủ đề ({filteredDataset.length})</option>
            <option value="safety">🛡️ An toàn (Safety)</option>
            <option value="maintenance">🔧 Bảo trì (Maintenance)</option>
            <option value="quality">🔍 Chất lượng (Quality)</option>
            <option value="production">🏭 Sản xuất (Production)</option>
            <option value="warehouse">📦 Kho hàng (Warehouse)</option>
            <option value="machinery">⚙️ Máy móc (Machinery)</option>
          </select>
        </div>
      </div>

      {!activeRecord ? (
        <div className="p-8 text-center text-xs font-mono text-muted-steel bg-canvas-ink border border-whisper-border rounded">
          Chưa có bài luyện tập cho chủ đề này. Xin vui lòng chọn chủ đề khác.
        </div>
      ) : (
        <div className="bg-canvas-ink p-6 border border-whisper-border rounded space-y-5 text-center shadow-inner">
          {/* Top Pagination & Badges */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="px-2.5 py-1 bg-safety-orange/20 border border-safety-orange/40 text-safety-orange font-bold rounded">
              BÀI {currentIdx + 1} / {filteredDataset.length}
            </span>
            <span className="text-muted-steel flex items-center gap-1">
              <Factory className="w-3.5 h-3.5 text-emerald-400" /> Bối cảnh: <strong className="text-titanium-white">{activeRecord.factoryContext}</strong>
            </span>
          </div>

          {/* Title */}
          <div className="text-sm font-mono text-safety-orange font-bold uppercase">{activeRecord.title}</div>

          {/* Play Comparison Audio Button */}
          <button
            type="button"
            onClick={handlePlayAB}
            className="px-6 py-3 bg-safety-orange hover:bg-orange-600 active:translate-y-[1px] text-canvas-ink text-xs font-mono font-bold rounded inline-flex items-center gap-2 shadow-lg transition-all"
          >
            <Volume2 className="w-4 h-4" /> NGHE PHÁT ĐỐI CHIẾU A ➔ B (AUDIO CHUẨN)
          </button>

          {activeStep && activeStep !== 'DONE' && (
            <div className="text-xs font-mono text-emerald-400 font-bold animate-pulse">
              Đang phát âm: {activeStep === 'A' ? `ĐÁP ÁN A [${activeRecord.wordA}]` : `ĐÁP ÁN B [${activeRecord.wordB}]`}
            </div>
          )}

          {/* Choice Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Option A */}
            <button
              type="button"
              onClick={() => handleSelect('A')}
              className={`p-4 rounded border text-center transition-all ${
                selectedAnswer === 'A'
                  ? activeRecord.correctAnswer === 'A'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold shadow-md'
                    : 'bg-rose-950/40 border-rose-500 text-rose-400 font-bold shadow-md'
                  : 'bg-pure-surface border-whisper-border text-titanium-white hover:border-safety-orange'
              }`}
            >
              <div className="text-[10px] font-mono text-muted-steel uppercase tracking-widest">LỰA CHỌN A</div>
              <div className="text-3xl font-bold mt-1 text-safety-orange">{activeRecord.wordA}</div>
              <div className="text-xs font-mono text-muted-steel mt-1">{activeRecord.meaningViA}</div>
            </button>

            {/* Option B */}
            <button
              type="button"
              onClick={() => handleSelect('B')}
              className={`p-4 rounded border text-center transition-all ${
                selectedAnswer === 'B'
                  ? activeRecord.correctAnswer === 'B'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold shadow-md'
                    : 'bg-rose-950/40 border-rose-500 text-rose-400 font-bold shadow-md'
                  : 'bg-pure-surface border-whisper-border text-titanium-white hover:border-safety-orange'
              }`}
            >
              <div className="text-[10px] font-mono text-muted-steel uppercase tracking-widest">LỰA CHỌN B</div>
              <div className="text-3xl font-bold mt-1 text-emerald-400">{activeRecord.wordB}</div>
              <div className="text-xs font-mono text-muted-steel mt-1">{activeRecord.meaningViB}</div>
            </button>
          </div>

          {/* Answer Feedback & Phonetic Tip */}
          {selectedAnswer && (
            <div className="p-4 bg-pure-surface border border-whisper-border rounded text-xs font-mono text-left space-y-1.5 animate-in fade-in">
              <div className="font-bold text-titanium-white flex items-center gap-1.5 text-sm">
                {selectedAnswer === activeRecord.correctAnswer ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                {selectedAnswer === activeRecord.correctAnswer ? 'CHÍNH XÁC!' : 'CHƯA ĐÚNG!'}
              </div>
              <p className="text-muted-steel leading-relaxed">{activeRecord.distinctionNote}</p>
            </div>
          )}

          {/* Footer Controls: Previous / Next */}
          <div className="flex items-center justify-between pt-4 border-t border-whisper-border">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-3.5 py-1.5 bg-pure-surface border border-whisper-border disabled:opacity-30 text-xs font-mono text-titanium-white rounded flex items-center gap-1 font-bold"
            >
              <ChevronLeft className="w-4 h-4" /> BÀI TRƯỚC
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIdx === filteredDataset.length - 1}
              className="px-3.5 py-1.5 bg-safety-orange hover:bg-orange-600 disabled:opacity-30 text-xs font-mono text-canvas-ink rounded flex items-center gap-1 font-bold shadow"
            >
              BÀI TIẾP theo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
