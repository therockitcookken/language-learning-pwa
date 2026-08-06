'use client';

import React from 'react';
import { Volume2, Bookmark, Share2, Sparkles } from 'lucide-react';
import { VocabularyItem } from './dictionary-types';

interface ChineseVocabularyCardProps {
  item: VocabularyItem;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  isSaved?: boolean;
  onToggleFavorite: (item: VocabularyItem) => void;
  onSpeak: (text: string, lang: 'zh-CN' | 'zh-TW') => void;
  onShare: (item: VocabularyItem) => void;
  onOpenPreview: (item: VocabularyItem) => void;
  isCopied?: boolean;
}

export function ChineseVocabularyCard({
  item,
  isSelected,
  onToggleSelect,
  isSaved,
  onToggleFavorite,
  onSpeak,
  onShare,
  onOpenPreview,
}: ChineseVocabularyCardProps) {
  let notes: any = {};
  try {
    if (item.usageNotes) notes = JSON.parse(item.usageNotes);
  } catch (e) {}

  const validCollocations = (notes.collocations || []).filter((c: string) => !c.includes('+ 第一') && !c.endsWith('第一'));

  const getHskBadge = (level?: string) => {
    switch (level) {
      case 'HSK1': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10';
      case 'HSK2': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10';
      case 'HSK3': return 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sky-500/10';
      case 'HSK4': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/10';
      case 'HSK5': return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10';
      case 'HSK6': return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10';
      default: return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    }
  };

  return (
    <div
      className={`rounded-3xl p-6 transition-all duration-300 relative flex flex-col justify-between backdrop-blur-2xl border ${
        isSelected
          ? 'bg-slate-900/90 border-orange-500/80 shadow-2xl shadow-orange-500/20 ring-2 ring-orange-500/30'
          : 'bg-slate-900/50 border-slate-800/60 hover:border-orange-500/40 hover:bg-slate-900/80 hover:-translate-y-1 shadow-lg'
      }`}
    >
      <div>
        {/* Top bar: Selection Checkbox & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                className="mt-2 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
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
                  className="text-3xl font-black text-white cursor-pointer hover:text-orange-400 transition-colors tracking-wide font-sans truncate break-words"
                >
                  {item.simplified || item.word}
                </h3>

                {item.traditional && item.traditional !== (item.simplified || item.word) && (
                  <span className="text-xs font-bold text-slate-400 bg-slate-950/60 px-2.5 py-0.5 border border-slate-800/60 rounded-full shadow-inner">
                    {item.traditional}
                  </span>
                )}

                {item.hskLevel && (
                  <span className={`text-[10px] font-black tracking-wider border px-3 py-0.5 rounded-full uppercase shadow-sm ${getHskBadge(item.hskLevel)}`}>
                    {item.hskLevel}
                  </span>
                )}

                {!item.hskLevel && item.factoryDomain && (
                  <span className="text-[10px] font-black tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full uppercase shadow-sm">
                    CÔNG XƯỞNG
                  </span>
                )}

                {item.partOfSpeech && (
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 border border-slate-800/60 px-2.5 py-0.5 rounded-full uppercase bg-slate-950/60">
                    {item.partOfSpeech}
                  </span>
                )}
              </div>

              <p className="text-sm font-black text-orange-400 flex items-center gap-2 tracking-wide">
                <span>{item.pinyin}</span>
                {item.pinyinNumeric && item.pinyinNumeric !== 'pinyin_std' && (
                  <span className="text-xs text-slate-400 font-normal">({item.pinyinNumeric})</span>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 self-start shrink-0">
            <button
              onClick={() => onSpeak(item.simplified || item.word, 'zh-CN')}
              className="p-2.5 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-white transition-all shadow-md cursor-pointer group"
              title="Nghe phát âm Hán ngữ"
            >
              <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => onToggleFavorite(item)}
              className={`p-2.5 rounded-2xl border transition-all shadow-md cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/15'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800/60 hover:text-white hover:border-slate-700/60'
              }`}
              title="Lưu từ vựng"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onShare(item)}
              className="p-2.5 rounded-2xl bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-white hover:border-slate-700/60 transition-all shadow-md cursor-pointer"
              title="Chia sẻ"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vietnamese & English meanings */}
        <div className="space-y-2 pt-4 mt-4 border-t border-slate-800/60">
          <div className="flex items-start gap-2.5">
            <span className="text-[10px] text-amber-400 font-black border border-amber-500/30 px-2 py-0.5 bg-amber-500/10 rounded-md shadow-sm">VN</span>
            <p className="text-sm font-extrabold text-white leading-relaxed">{item.meaningVi}</p>
          </div>

          {item.meaningEn && !item.meaningEn.includes('Practical Chinese (') && (
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] text-sky-400 font-black border border-sky-500/30 px-2 py-0.5 bg-sky-500/10 rounded-md shadow-sm">EN</span>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">{item.meaningEn}</p>
            </div>
          )}
        </div>

        {/* Synonyms & Antonyms */}
        <div className="space-y-2 mt-3.5">
          {notes.synonyms && notes.synonyms.length > 0 && (
            <div className="text-[11px] bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-2xl shadow-inner">
              <div className="text-emerald-400 font-black flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3 h-3 text-emerald-400" /> TỪ ĐỒNG NGHĨA (SYNONYM)
              </div>
              {notes.synonyms.map((s: any, idx: number) => (
                <div key={`${item.id}-syn-${s.word}-${idx}`} className="flex flex-wrap items-center justify-between gap-1.5 text-white py-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-extrabold text-emerald-300">{s.word}</span>
                    <span className="text-slate-400 text-[10px]">({s.pinyin || s.ipa})</span>
                    <span className="text-slate-500">-</span>
                    <span className="text-slate-300 font-medium">{s.meaningVi}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(s.word, 'zh-CN')}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 hover:text-white transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {notes.antonyms && notes.antonyms.length > 0 && (
            <div className="text-[11px] bg-rose-950/30 border border-rose-500/40 p-3 rounded-2xl shadow-inner">
              <div className="text-rose-400 font-black flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3 h-3 text-rose-400" /> TỪ TRÁI NGHĨA (ANTONYM)
              </div>
              {notes.antonyms.map((a: any, idx: number) => (
                <div key={`${item.id}-ant-${a.word}-${idx}`} className="flex flex-wrap items-center justify-between gap-1.5 text-white py-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-extrabold text-rose-300">{a.word}</span>
                    <span className="text-slate-400 text-[10px]">({a.pinyin || a.ipa})</span>
                    <span className="text-slate-500">-</span>
                    <span className="text-slate-300 font-medium">{a.meaningVi}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(a.word, 'zh-CN')}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 hover:text-white transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Collocation & Domain Tag */}
      {validCollocations.length > 0 && (
        <div className="mt-4 text-xs text-slate-300 bg-slate-950/80 p-3.5 border-l-4 border-orange-500 flex items-center justify-between rounded-r-2xl shadow-inner">
          <div>
            <span className="opacity-70 font-black text-slate-400">COLLOCATION: </span>
            <span className="font-bold text-white">{validCollocations.join(', ')}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border border-slate-800 text-amber-300 bg-slate-900 rounded-xl shadow-sm">
            {item.factoryDomain || item.topic || 'General'}
          </span>
        </div>
      )}
    </div>
  );
}

