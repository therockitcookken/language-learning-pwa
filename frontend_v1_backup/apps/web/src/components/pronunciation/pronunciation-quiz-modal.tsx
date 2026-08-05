'use client';

import React, { useState } from 'react';
import { X, Volume2, CheckCircle2, XCircle, GraduationCap } from 'lucide-react';
import { QuizItem } from '@/lib/validation/pronunciation-schema';
import { pronunciationAudioService } from '@/lib/services/pronunciation-audio-service';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizItems: QuizItem[];
}

export function PronunciationQuizModal({ isOpen, onClose, quizItems }: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  if (!isOpen || quizItems.length === 0) return null;

  const current = quizItems[currentIndex % quizItems.length];

  const handleSelectOption = (opt: string) => {
    setSelectedOption(opt);
    if (opt === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentIndex((i) => i + 1);
  };

  const handlePlayAudio = () => {
    if (current.audioUrl) {
      pronunciationAudioService.playSound({ text: current.targetId, langCode: 'zh-CN' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-canvas-ink/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-pure-surface border border-whisper-border p-6 max-w-md w-full rounded-[4px] shadow-2xl space-y-5 animate-in zoom-in-95 relative">
        <div className="flex items-center justify-between border-b border-whisper-border pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-titanium-white">
            <GraduationCap className="w-5 h-5 text-safety-orange" />
            <span>PRONUNCIATION QUIZ ({currentIndex + 1} / {quizItems.length})</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-muted-steel hover:text-safety-orange">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Box */}
        <div className="bg-canvas-ink p-4 border border-whisper-border rounded text-center space-y-3">
          <h4 className="text-sm font-sans font-bold text-titanium-white">{current.question}</h4>
          {current.audioUrl && (
            <button
              type="button"
              onClick={handlePlayAudio}
              className="px-4 py-2 bg-safety-orange text-canvas-ink text-xs font-mono font-bold rounded inline-flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" /> NGHE CÂU HỎI
            </button>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {current.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === current.correctAnswer;

            return (
              <button
                key={`${current.id}-opt-${i}`}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={selectedOption !== null}
                className={`w-full p-3 rounded border text-left font-mono text-xs transition-all ${
                  selectedOption
                    ? isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-bold'
                      : isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-rose-400 font-bold'
                      : 'bg-canvas-ink border-whisper-border text-muted-steel opacity-50'
                    : 'bg-canvas-ink border-whisper-border text-titanium-white hover:border-safety-orange'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next */}
        {selectedOption && (
          <div className="space-y-3 pt-3 border-t border-whisper-border">
            <div className="text-xs font-mono text-muted-steel bg-canvas-ink p-3 border border-whisper-border rounded">
              <strong className="text-titanium-white">GIẢI THÍCH:</strong> {current.explanation}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 bg-safety-orange text-canvas-ink font-mono text-xs font-bold rounded"
            >
              CÂU KẾ TIẾP →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
