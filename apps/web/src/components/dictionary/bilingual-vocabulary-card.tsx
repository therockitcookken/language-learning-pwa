'use client';

import React from 'react';
import { Volume2, Bookmark, Share2, Check, ExternalLink, ArrowRightLeft } from 'lucide-react';
import { VocabularyItem } from './dictionary-types';

interface BilingualVocabularyCardProps {
  item: VocabularyItem;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  isSaved?: boolean;
  onToggleFavorite: (item: VocabularyItem) => void;
  onSpeak: (text: string, lang: 'zh-CN' | 'en-US') => void;
  onShare: (item: VocabularyItem) => void;
  onOpenPreview: (item: VocabularyItem) => void;
  isCopied?: boolean;
}

export function BilingualVocabularyCard({
  item,
  isSelected,
  onToggleSelect,
  isSaved,
  onToggleFavorite,
  onSpeak,
  onShare,
  onOpenPreview,
  isCopied,
}: BilingualVocabularyCardProps) {
  const isZh = item.language === 'zh';

  return (
    <div
      className={`animate-in rounded-3xl p-6 transition-all duration-300 relative flex flex-col justify-between backdrop-blur-xl border ${
        isSelected
          ? 'bg-slate-900/90 border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-purple-500/30 hover:bg-slate-900/80 hover:-translate-y-1 shadow-lg'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
            )}
            <span className="text-[10px] font-black tracking-wider px-3 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase shadow-sm">
              CẶP THUẬT NGỮ SONG NGỮ
            </span>
            {item.partOfSpeech && (
              <span className="text-[10px] font-bold tracking-widest text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full uppercase bg-slate-950/60">
                {item.partOfSpeech}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onShare(item)}
              className="p-2 rounded-2xl bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition-all shadow-md cursor-pointer"
              title="Sao chép"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(item)}
              className={`p-2 rounded-2xl border transition-all shadow-md cursor-pointer ${
                isSaved
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
              title="Lưu từ"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onOpenPreview(item)}
              className="p-2 rounded-2xl bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition-all shadow-md cursor-pointer"
              title="Xem chi tiết"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Image (if available) */}
        {item.imageUrl && (
          <div className="w-full h-28 mb-4 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.meaningVi} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        {/* Central Vietnamese Term */}
        <div className="mb-4 bg-slate-950/60 border border-slate-800/60 p-3.5 rounded-2xl text-center shadow-inner">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">NGHĨA THUẬT NGỮ TIẾNG VIỆT</div>
          <div className="text-base font-sans font-black text-orange-400">{item.meaningVi}</div>
        </div>

        {/* Comparative 2 Columns: Chinese vs English */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Chinese Column */}
          <div className="bg-slate-950/60 p-3.5 border border-emerald-500/30 rounded-2xl space-y-1 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">🇨🇳 TIẾNG TRUNG</span>
              <button
                type="button"
                onClick={() => onSpeak(isZh ? item.simplified || item.word : item.meaningVi, 'zh-CN')}
                className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:text-white border border-emerald-500/20 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-2xl font-sans font-black text-white">{isZh ? item.simplified || item.word : '---'}</div>
            <div className="text-xs font-bold text-emerald-300">{isZh ? item.pinyin : '---'}</div>
          </div>

          {/* English Column */}
          <div className="bg-slate-950/60 p-3.5 border border-sky-500/30 rounded-2xl space-y-1 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider">🇬🇧 TIẾNG ANH</span>
              <button
                type="button"
                onClick={() => onSpeak(!isZh ? item.word : item.meaningEn || item.word, 'en-US')}
                className="p-1.5 rounded-xl bg-sky-500/10 text-sky-400 hover:text-white border border-sky-500/20 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xl font-mono font-bold text-white">{!isZh ? item.word : item.meaningEn || '---'}</div>
            <div className="text-xs font-bold text-sky-300">{!isZh ? item.ipa || '/IPA/' : '---'}</div>
          </div>
        </div>
      </div>

      {/* Footer Tag */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400">
        <span className="flex items-center gap-1.5 font-bold">
          <ArrowRightLeft className="w-3.5 h-3.5 text-purple-400" /> BILINGUAL ALIGNMENT
        </span>
        <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 border border-slate-800 text-slate-300 bg-slate-950/60 rounded-xl shadow-sm">
          {item.factoryDomain || item.topic || 'Industrial'}
        </span>
      </div>
    </div>
  );
}
