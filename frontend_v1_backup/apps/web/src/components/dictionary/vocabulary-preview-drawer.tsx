'use client';

import React, { useEffect } from 'react';
import { X, Volume2, Bookmark, Share2, ChevronLeft, ChevronRight, Check, Sparkles, BookOpen, Layers } from 'lucide-react';
import { VocabularyItem } from './dictionary-types';

interface VocabularyPreviewDrawerProps {
  item: VocabularyItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isSaved?: boolean;
  onToggleFavorite: (item: VocabularyItem) => void;
  onSpeak: (text: string, lang: 'zh-CN' | 'en-US') => void;
}

export function VocabularyPreviewDrawer({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  isSaved,
  onToggleFavorite,
  onSpeak,
}: VocabularyPreviewDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, hasPrev, hasNext, onClose, onPrev, onNext]);

  if (!item) return null;

  const isZh = item.language === 'zh';
  let notes: any = {};
  try {
    if (item.usageNotes) notes = JSON.parse(item.usageNotes);
  } catch (e) {}

  const validCollocations = (notes.collocations || []).filter((c: string) => !c.includes('+ 第一') && !c.endsWith('第一'));

  return (
    <div className="fixed inset-0 z-50 bg-canvas-ink/80 backdrop-blur-sm flex justify-end">
      <div className="bg-pure-surface border-l border-whisper-border w-full max-w-lg h-full flex flex-col justify-between p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right relative">
        {/* Drawer Top Controls */}
        <div className="space-y-4 border-b border-whisper-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-steel">
              <BookOpen className="w-4 h-4 text-safety-orange" />
              <span>DETAILED VOCABULARY DRAWER</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-muted-steel hover:text-safety-orange transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={onPrev}
                className="px-3 py-1.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel disabled:opacity-40 text-xs font-mono text-titanium-white rounded flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> TRƯỚC
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={onNext}
                className="px-3 py-1.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel disabled:opacity-40 text-xs font-mono text-titanium-white rounded flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                SAU <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSpeak(item.simplified || item.word, isZh ? 'zh-CN' : 'en-US')}
                className="p-2 bg-safety-orange text-canvas-ink rounded font-mono text-xs font-bold flex items-center gap-1"
              >
                <Volume2 className="w-4 h-4" /> NÓI
              </button>
              <button
                type="button"
                onClick={() => onToggleFavorite(item)}
                className={`p-2 border rounded ${
                  isSaved ? 'bg-titanium-white border-titanium-white text-canvas-ink' : 'bg-canvas-ink border-whisper-border text-muted-steel'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Body Content */}
        <div className="space-y-6 py-4 flex-1 overflow-y-auto">
          {/* Main Word Header */}
          <div className="space-y-2 bg-canvas-ink p-5 border border-whisper-border rounded-[4px]">
            <div className="flex items-center gap-2">
              <h2 className="text-4xl font-sans font-black text-titanium-white">{item.simplified || item.word}</h2>
              {item.hskLevel && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-mono text-xs font-bold uppercase">
                  {item.hskLevel}
                </span>
              )}
              {item.cefrLevel && (
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded font-mono text-xs font-bold uppercase">
                  TOEIC {item.cefrLevel}
                </span>
              )}
            </div>

            <p className="text-base font-mono font-bold text-safety-orange">{item.pinyin || item.ipa}</p>
            {item.partOfSpeech && (
              <span className="inline-block text-[10px] font-mono tracking-widest text-muted-steel border border-whisper-border px-2 py-0.5 uppercase bg-pure-surface rounded">
                LOẠI TỪ: {item.partOfSpeech}
              </span>
            )}
          </div>

          {/* Vietnamese & English Meanings */}
          <div className="space-y-3 bg-pure-surface p-4 border border-whisper-border rounded">
            <div>
              <div className="text-[10px] font-mono text-muted-steel uppercase tracking-wider mb-1">NGHĨA TIẾNG VIỆT</div>
              <p className="text-base font-sans font-bold text-titanium-white">{item.meaningVi}</p>
            </div>
            {item.meaningEn && !item.meaningEn.includes('Practical Chinese (') && (
              <div className="pt-2 border-t border-whisper-border">
                <div className="text-[10px] font-mono text-muted-steel uppercase tracking-wider mb-1">ENGLISH MEANING</div>
                <p className="text-sm font-sans text-muted-steel">{item.meaningEn}</p>
              </div>
            )}
          </div>

          {/* Chinese Radical & Stroke Analysis */}
          {isZh && (
            <div className="bg-canvas-ink p-4 border border-whisper-border rounded space-y-3">
              <div className="text-xs font-mono font-bold text-titanium-white uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-safety-orange" /> PHÂN TÍCH CHỮ HÁN & NÉT
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-muted-steel">
                <div className="bg-pure-surface p-2 border border-whisper-border rounded">
                  <span>BỘ THỦ</span>
                  <div className="text-sm font-bold text-titanium-white mt-1">宀 (Roof)</div>
                </div>
                <div className="bg-pure-surface p-2 border border-whisper-border rounded">
                  <span>CẤU TRÚC</span>
                  <div className="text-sm font-bold text-titanium-white mt-1">Trên-Dưới</div>
                </div>
                <div className="bg-pure-surface p-2 border border-whisper-border rounded">
                  <span>SỐ NÉT</span>
                  <div className="text-sm font-bold text-titanium-white mt-1">6 Nét</div>
                </div>
              </div>
            </div>
          )}

          {/* Example Sentences */}
          {item.examples && item.examples.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-titanium-white uppercase">CÂU VÍ DỤ THỰC TẾ</div>
              <div className="space-y-2">
                {item.examples.map((ex, idx) => (
                  <div key={ex.id || idx} className="bg-canvas-ink p-3 border border-whisper-border rounded space-y-1 text-xs font-mono">
                    <p className="font-bold text-titanium-white">{ex.sentenceZh || ex.sentenceEn}</p>
                    {ex.pinyin && <p className="text-safety-orange text-[11px]">{ex.pinyin}</p>}
                    <p className="text-muted-steel">{ex.sentenceVi}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collocations */}
          {validCollocations.length > 0 && (
            <div className="bg-canvas-ink p-3 border-l-2 border-safety-orange text-xs font-mono rounded-r">
              <div className="text-[10px] text-muted-steel uppercase">COLLOCATIONS THƯỜNG GẶP</div>
              <div className="font-bold text-titanium-white mt-1">{validCollocations.join(', ')}</div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-whisper-border pt-4 text-center text-xs font-mono text-muted-steel">
          Dùng phím mũi tên ← → trên bàn phím để chuyển từ vựng kế tiếp
        </div>
      </div>
    </div>
  );
}
