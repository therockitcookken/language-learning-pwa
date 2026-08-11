'use client';

import React from 'react';
import { Volume2, Bookmark, Share2, Check, ExternalLink, Sparkles } from 'lucide-react';
import { VocabularyItem } from './dictionary-types';
import { WordCard3DIcon } from './word-card-3d-icon';

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

  const synonymsList = (notes.synonyms && notes.synonyms.length > 0) ? notes.synonyms : (item.synonyms || []);
  const antonymsList = (notes.antonyms && notes.antonyms.length > 0) ? notes.antonyms : (item.antonyms || []);

  return (
    <div
      className={`animate-in rounded-3xl p-6 transition-all duration-300 relative flex flex-col justify-between backdrop-blur-xl border ${
        isSelected
          ? 'bg-slate-900/90 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/30'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-blue-500/30 hover:bg-slate-900/80 hover:-translate-y-1 shadow-lg'
      }`}
    >
      <WordCard3DIcon word={item.word} color="#0ea5e9" isChinese={false} />

      <div className="relative z-10">
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
                    TOEIC / CEFR {item.cefrLevel}
                  </span>
                )}

                {item.partOfSpeech && (
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full uppercase bg-slate-950/60">
                    {item.partOfSpeech}
                  </span>
                )}
              </div>

              <p className="text-sm font-bold text-blue-400">
                {item.ipa || `/${item.word}/`}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 self-start shrink-0">
            <button
              type="button"
              onClick={() => onSpeak(item.word, 'en-US')}
              className="p-2 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Phát âm Anh-Mỹ (US Accent)"
            >
              <Volume2 className="w-4 h-4" /> 🇺🇸 US
            </button>

            <button
              type="button"
              onClick={() => onSpeak(item.word, 'en-GB')}
              className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Phát âm Anh-Anh (UK Accent)"
            >
              <Volume2 className="w-4 h-4" /> 🇬🇧 UK
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(item)}
              className={`p-2 rounded-2xl border transition-all shadow-md cursor-pointer ${
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
              className="p-2 rounded-2xl bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-white hover:border-slate-700/60 transition-all shadow-md cursor-pointer"
              title="Chia sẻ"
            >
              {isCopied ? <Check className="w-4 h-4 text-blue-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => onOpenPreview(item)}
              className="p-2 rounded-2xl bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-white hover:border-slate-700/60 transition-all shadow-md cursor-pointer"
              title="Xem chi tiết"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meanings */}
        <div className="space-y-2 pt-4 mt-4 border-t border-slate-800/60">
          <div className="flex items-start gap-2.5">
            <span className="text-[10px] text-amber-400 font-black border border-amber-500/30 px-2 py-0.5 bg-amber-500/10 rounded-md shadow-sm">VN</span>
            <p className="text-sm font-extrabold text-white leading-relaxed">{item.meaningVi}</p>
          </div>

          {item.meaningEn && (
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] text-sky-400 font-black border border-sky-500/30 px-2 py-0.5 bg-sky-500/10 rounded-md shadow-sm">EN</span>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">{item.meaningEn}</p>
            </div>
          )}
        </div>

        {/* Synonyms & Antonyms for English */}
        <div className="space-y-2 mt-3.5">
          {synonymsList && synonymsList.length > 0 && (
            <div className="text-[11px] bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-2xl shadow-inner">
              <div className="text-emerald-400 font-black flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3 h-3 text-emerald-400" /> TỪ ĐỒNG NGHĨA (SYNONYM)
              </div>
              {synonymsList.map((s: any, idx: number) => (
                <div key={`${item.id}-syn-${s.word}-${idx}`} className="flex flex-wrap items-center justify-between gap-1.5 text-white py-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-extrabold text-emerald-300">{s.word}</span>
                    <span className="text-slate-400 text-[10px]">({s.ipa || `/${s.word}/`})</span>
                    <span className="text-slate-500">-</span>
                    <span className="text-slate-300 font-medium">{s.meaningVi}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(s.word, 'en-US')}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {antonymsList && antonymsList.length > 0 && (
            <div className="text-[11px] bg-rose-950/30 border border-rose-500/40 p-3 rounded-2xl shadow-inner">
              <div className="text-rose-400 font-black flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3 h-3 text-rose-400" /> TỪ TRÁI NGHĨA (ANTONYM)
              </div>
              {antonymsList.map((a: any, idx: number) => (
                <div key={`${item.id}-ant-${a.word}-${idx}`} className="flex flex-wrap items-center justify-between gap-1.5 text-white py-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-extrabold text-rose-300">{a.word}</span>
                    <span className="text-slate-400 text-[10px]">({a.ipa || `/${a.word}/`})</span>
                    <span className="text-slate-500">-</span>
                    <span className="text-slate-300 font-medium">{a.meaningVi}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(a.word, 'en-US')}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Domain tag */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 font-bold">TECHNICAL EN VOCAB</span>
        <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 border border-slate-800 text-blue-300 bg-slate-950 rounded-xl shadow-sm font-black">
          {item.factoryDomain || item.topic || 'General'}
        </span>
      </div>
    </div>
  );
}
