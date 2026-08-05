'use client';

import React from 'react';
import { Volume2, Bookmark, Share2, Check, ExternalLink } from 'lucide-react';
import { VocabularyItem } from './dictionary-types';

interface VocabularyListRowProps {
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

export function VocabularyListRow({
  item,
  isSelected,
  onToggleSelect,
  isSaved,
  onToggleFavorite,
  onSpeak,
  onShare,
  onOpenPreview,
  isCopied,
}: VocabularyListRowProps) {
  const isZh = item.language === 'zh';

  return (
    <div
      className={`animate-in bg-pure-surface border rounded-[4px] p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isSelected ? 'border-safety-orange bg-safety-orange/5' : 'border-whisper-border hover:border-muted-steel'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 accent-safety-orange cursor-pointer"
          />
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              onClick={() => onOpenPreview(item)}
              className="text-xl font-sans font-bold text-titanium-white truncate cursor-pointer hover:text-safety-orange transition-colors"
            >
              {item.simplified || item.word}
            </h4>

            {item.hskLevel && (
              <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded uppercase">
                {item.hskLevel}
              </span>
            )}

            {item.cefrLevel && (
              <span className="text-[9px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 px-1.5 py-0.5 rounded uppercase">
                TOEIC {item.cefrLevel}
              </span>
            )}
          </div>

          <p className="text-xs font-mono text-safety-orange font-bold">
            {item.pinyin || item.ipa}
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-sans font-bold text-titanium-white truncate">{item.meaningVi}</p>
        {item.meaningEn && !item.meaningEn.includes('Practical Chinese (') && (
          <p className="text-xs font-sans text-muted-steel truncate">{item.meaningEn}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onSpeak(item.simplified || item.word, isZh ? 'zh-CN' : 'en-US')}
          className="p-2 bg-canvas-ink border border-whisper-border hover:bg-safety-orange hover:text-canvas-ink text-muted-steel rounded transition-all"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onToggleFavorite(item)}
          className={`p-2 border rounded transition-all ${
            isSaved ? 'bg-titanium-white border-titanium-white text-canvas-ink' : 'bg-canvas-ink border-whisper-border text-muted-steel'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onOpenPreview(item)}
          className="p-2 bg-canvas-ink border border-whisper-border hover:border-muted-steel text-muted-steel hover:text-titanium-white rounded transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
