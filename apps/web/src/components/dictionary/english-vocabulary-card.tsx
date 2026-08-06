'use client';

import React from 'react';
import { Volume2, Bookmark, Share2, Check, ExternalLink } from 'lucide-react';
import { VocabularyItem } from './dictionary-types';

interface EnglishVocabularyCardProps {
  item: VocabularyItem;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  isSaved?: boolean;
  onToggleFavorite: (item: VocabularyItem) => void;
  onSpeak: (text: string, lang: 'en-US' | 'en-GB') => void;
  onShare: (item: VocabularyItem) => void;
  onOpenPreview: (item: VocabularyItem) => void;
  isCopied?: boolean;
}

export function EnglishVocabularyCard({
  item,
  isSelected,
  onToggleSelect,
  isSaved,
  onToggleFavorite,
  onSpeak,
  onShare,
  onOpenPreview,
  isCopied,
}: EnglishVocabularyCardProps) {
  let notes: any = {};
  try {
    if (item.usageNotes) notes = JSON.parse(item.usageNotes);
  } catch (e) {}

  return (
    <div
      className={`animate-in rounded-3xl p-6 transition-all duration-300 relative flex flex-col justify-between backdrop-blur-xl border ${
        isSelected
          ? 'bg-slate-900/90 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/30'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-blue-500/30 hover:bg-slate-900/80 hover:-translate-y-1 shadow-lg'
      }`}
    >
      <div>
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                className="mt-2 w-4 h-4 accent-blue-500 rounded cursor-pointer shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              {item.imageUrl && (
                <div className="w-full h-28 mb-3 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.word} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h3
                  onClick={() => onOpenPreview(item)}
                  className="text-3xl font-black text-white cursor-pointer hover:text-blue-400 transition-colors tracking-tight truncate break-words"
                >
                  {item.word}
                </h3>

                {item.cefrLevel && (
                  <span className="text-[10px] font-black tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30 px-3 py-0.5 rounded-full uppercase shadow-sm">
                    TOEIC {item.cefrLevel}
                  </span>
                )}

                {item.partOfSpeech && (
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full uppercase bg-slate-950/60">
                    {item.partOfSpeech}
                  </span>
                )}
              </div>

              <p className="text-sm font-bold text-blue-400">
                {item.ipa || '/IPA/'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 self-start shrink-0">
            <button
              type="button"
              onClick={() => onSpeak(item.word, 'en-US')}
              className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Phát âm Anh-Mỹ (US Accent)"
            >
              <Volume2 className="w-4 h-4" /> 🇺🇸 US
            </button>

            <button
              type="button"
              onClick={() => onSpeak(item.word, 'en-GB')}
              className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Phát âm Anh-Anh (UK Accent)"
            >
              <Volume2 className="w-4 h-4" /> 🇬🇧 UK
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(item)}
              className={`p-2.5 rounded-2xl border transition-all shadow-md cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800/60 hover:text-white hover:border-slate-700/60'
              }`}
              title="Lưu từ vựng"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onShare(item)}
              className="p-2.5 rounded-2xl bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-white hover:border-slate-700/60 transition-all shadow-md cursor-pointer"
              title="Chia sẻ"
            >
              {isCopied ? <Check className="w-4 h-4 text-blue-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => onOpenPreview(item)}
              className="p-2.5 rounded-2xl bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-white hover:border-slate-700/60 transition-all shadow-md cursor-pointer"
              title="Xem chi tiết"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meanings */}
        <div className="space-y-2 pt-4 mt-4 border-t border-whisper-border">
          <div className="flex items-start gap-2">
            <span className="text-[10px] text-muted-steel font-mono border border-whisper-border px-1.5 bg-canvas-ink mt-0.5 font-bold">VN</span>
            <p className="text-sm font-sans font-bold text-titanium-white">{item.meaningVi}</p>
          </div>

          {item.meaningEn && (
            <div className="flex items-start gap-2">
              <span className="text-[10px] text-muted-steel font-mono border border-whisper-border px-1.5 bg-canvas-ink mt-0.5">EN</span>
              <p className="text-sm font-sans text-muted-steel">{item.meaningEn}</p>
            </div>
          )}
        </div>
      </div>

      {/* Domain tag */}
      <div className="mt-4 pt-3 border-t border-whisper-border/60 flex items-center justify-between text-xs font-mono">
        <span className="text-muted-steel">INDUSTRIAL EN VOCAB</span>
        <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-whisper-border text-muted-steel bg-canvas-ink rounded">
          {item.factoryDomain || item.topic || 'Logistics'}
        </span>
      </div>
    </div>
  );
}
