'use client';

import React, { useState } from 'react';
import { X, Volume2, Check, RotateCcw, Sparkles, GraduationCap, Flame } from 'lucide-react';
import { VocabularyItem } from './dictionary-types';

interface QuickStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: VocabularyItem[];
  onSpeak: (text: string, lang: 'zh-CN' | 'en-US') => void;
}

export function QuickStudyModal({
  isOpen,
  onClose,
  items,
  onSpeak,
}: QuickStudyModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);

  if (!isOpen || items.length === 0) return null;

  const current = items[currentIndex % items.length];
  const isZh = current.language === 'zh';

  const handleNext = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setIsFlipped(false);
    setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-canvas-ink/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-pure-surface border border-whisper-border p-6 max-w-lg w-full rounded-[4px] shadow-2xl space-y-6 relative animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-whisper-border pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-titanium-white">
            <GraduationCap className="w-5 h-5 text-safety-orange" />
            <span>QUICK STUDY WORKSPACE ({currentIndex + 1} / {items.length})</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-muted-steel hover:text-safety-orange">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-canvas-ink h-1.5 rounded overflow-hidden">
          <div
            className="bg-safety-orange h-full transition-all duration-300"
            style={{ width: `${Math.min(100, ((currentIndex + 1) / items.length) * 100)}%` }}
          />
        </div>

        {/* Flashcard Component */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="bg-canvas-ink border border-whisper-border hover:border-safety-orange p-8 rounded-[4px] min-h-[220px] flex flex-col items-center justify-center text-center cursor-pointer transition-all relative select-none shadow-inner"
        >
          <span className="absolute top-3 right-3 text-[10px] font-mono text-muted-steel">
            {isFlipped ? 'MẶT SAU (NGHĨA)' : 'MẶT TRƯỚC (BẤM ĐỂ LẬT)'}
          </span>

          {!isFlipped ? (
            <div className="space-y-3">
              <h2 className="text-4xl font-sans font-black text-titanium-white">{current.simplified || current.word}</h2>
              <p className="text-sm font-mono font-bold text-safety-orange">{current.pinyin || current.ipa}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(current.simplified || current.word, isZh ? 'zh-CN' : 'en-US');
                }}
                className="mt-2 px-3 py-1.5 bg-pure-surface border border-whisper-border hover:bg-safety-orange hover:text-canvas-ink text-muted-steel text-xs font-mono rounded inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" /> PHÁT ÂM
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-muted-steel uppercase border border-whisper-border px-2 py-0.5 rounded">
                {current.partOfSpeech || 'MEANING'}
              </span>
              <h3 className="text-2xl font-sans font-bold text-safety-orange">{current.meaningVi}</h3>
              {current.meaningEn && !current.meaningEn.includes('Practical Chinese (') && (
                <p className="text-xs font-sans text-muted-steel">{current.meaningEn}</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Correct / Incorrect */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleNext(false)}
            className="py-3 bg-canvas-ink border border-rose-500/40 text-rose-400 hover:bg-rose-950/30 text-xs font-mono font-bold rounded flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> CHƯA NHỚ (AGAIN)
          </button>
          <button
            type="button"
            onClick={() => handleNext(true)}
            className="py-3 bg-emerald-500 text-canvas-ink hover:bg-emerald-600 text-xs font-mono font-bold rounded flex items-center justify-center gap-1.5 transition-all shadow"
          >
            <Check className="w-4 h-4" /> ĐÃ THUỘC (GOOD)
          </button>
        </div>

        {/* Footer Score */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-steel border-t border-whisper-border pt-3">
          <span>ĐIỂM: <strong className="text-emerald-400">{score}</strong> CHÍNH XÁC</span>
          <span className="flex items-center gap-1 text-amber-400"><Flame className="w-3.5 h-3.5" /> SRS LEARNING</span>
        </div>
      </div>
    </div>
  );
}
