'use client';

import React, { useEffect } from 'react';
import { X, Volume2, Bookmark, ChevronLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col justify-between p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right relative">
        {/* Drawer Top Controls */}
        <div className="space-y-4 border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-orange-400">
              <BookOpen className="w-4 h-4 text-orange-500" />
              <span>CHI TIẾT TỪ VỰNG DRAWER</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-orange-400 transition-colors"
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
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 text-xs font-mono text-white rounded-xl flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> TRƯỚC
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={onNext}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 text-xs font-mono text-white rounded-xl flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                SAU <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSpeak(item.simplified || item.word, isZh ? 'zh-CN' : 'en-US')}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> PHÁT ÂM
              </button>
              <button
                type="button"
                onClick={() => onToggleFavorite(item)}
                className={`p-2 border rounded-xl transition-all cursor-pointer ${
                  isSaved ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
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
          <div className="space-y-2 bg-slate-950 p-5 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2">
              <h2 className="text-4xl font-black text-white">{item.simplified || item.word}</h2>
              {item.hskLevel && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold uppercase">
                  {item.hskLevel}
                </span>
              )}
              {item.cefrLevel && (
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold uppercase">
                  {item.cefrLevel}
                </span>
              )}
            </div>

            <p className="text-sm font-extrabold text-orange-400 font-mono">
              {isZh ? item.pinyin : item.ipa || `/${item.word}/`}
            </p>

            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-[10px] font-mono text-amber-400 font-black uppercase tracking-wider mb-1">NGHĨA TIẾNG VIỆT</div>
              <p className="text-base font-extrabold text-white leading-relaxed">{item.meaningVi}</p>
            </div>

            {item.meaningEn && !item.meaningEn.includes('Practical Chinese (') && (
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-mono text-sky-400 font-black uppercase tracking-wider mb-1">ENGLISH MEANING</div>
                <p className="text-sm font-medium text-slate-300">{item.meaningEn}</p>
              </div>
            )}
          </div>

          {/* Synonyms & Antonyms */}
          <div className="space-y-3">
            {notes.synonyms && notes.synonyms.length > 0 && (
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> TỪ ĐỒNG NGHĨA (SYNONYMS)
                </div>
                {notes.synonyms.map((s: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-white bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="font-extrabold text-emerald-300 mr-2">{s.word}</span>
                      <span className="text-slate-400 text-[11px] mr-2">({s.pinyin || s.ipa})</span>
                      <span className="text-slate-300 font-medium">{s.meaningVi}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSpeak(s.word, isZh ? 'zh-CN' : 'en-US')}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {notes.antonyms && notes.antonyms.length > 0 && (
              <div className="bg-rose-950/30 border border-rose-500/40 p-4 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> TỪ TRÁI NGHĨA (ANTONYMS)
                </div>
                {notes.antonyms.map((a: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-white bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="font-extrabold text-rose-300 mr-2">{a.word}</span>
                      <span className="text-slate-400 text-[11px] mr-2">({a.pinyin || a.ipa})</span>
                      <span className="text-slate-300 font-medium">{a.meaningVi}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSpeak(a.word, isZh ? 'zh-CN' : 'en-US')}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collocations */}
          {validCollocations.length > 0 && (
            <div className="bg-slate-950 p-4 border-l-4 border-orange-500 text-xs rounded-r-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-black uppercase">COLLOCATIONS THƯỜNG GẶP</div>
              <div className="font-bold text-white mt-1">{validCollocations.join(', ')}</div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-800 pt-4 text-center text-xs font-mono text-slate-400">
          Dùng phím mũi tên ← → trên bàn phím để chuyển từ vựng kế tiếp
        </div>
      </div>
    </div>
  );
}
