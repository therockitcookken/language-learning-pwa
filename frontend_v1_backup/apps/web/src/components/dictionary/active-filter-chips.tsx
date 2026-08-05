'use client';

import React from 'react';
import { X, Trash2, Filter } from 'lucide-react';
import { AdvancedFilterState, LanguageWorkspace } from './dictionary-types';

interface ActiveFilterChipsProps {
  query: string;
  onClearQuery: () => void;
  activeWorkspace: LanguageWorkspace;
  hsk: string;
  onClearHsk: () => void;
  cefr: string;
  onClearCefr: () => void;
  domain: string;
  onClearDomain: () => void;
  advancedFilters: AdvancedFilterState;
  onRemoveAdvancedFilter: (field: keyof AdvancedFilterState, val?: string) => void;
  onResetAll: () => void;
  totalResults: number;
}

export function ActiveFilterChips({
  query,
  onClearQuery,
  activeWorkspace,
  hsk,
  onClearHsk,
  cefr,
  onClearCefr,
  domain,
  onClearDomain,
  advancedFilters,
  onRemoveAdvancedFilter,
  onResetAll,
  totalResults,
}: ActiveFilterChipsProps) {
  const hasActiveFilters =
    Boolean(query) ||
    Boolean(hsk) ||
    Boolean(cefr) ||
    Boolean(domain) ||
    advancedFilters.hskLevels.length > 0 ||
    advancedFilters.toeicLevels.length > 0 ||
    advancedFilters.factoryDomains.length > 0 ||
    advancedFilters.partOfSpeech.length > 0 ||
    advancedFilters.learningStatus !== 'all' ||
    advancedFilters.isSavedOnly ||
    advancedFilters.hasAudioOnly ||
    advancedFilters.isVerifiedOnly;

  if (!hasActiveFilters) {
    return (
      <div className="flex items-center justify-between text-xs font-mono text-muted-steel bg-canvas-ink/40 px-3 py-2 border border-whisper-border/60 rounded-[4px]">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-safety-orange" />
          <span>TẤT CẢ TỪ VỰNG DỰ ÁN ({totalResults.toLocaleString()} ENTRIES)</span>
        </div>
        <span className="text-[10px] text-muted-steel">Bật bộ lọc để thu hẹp phạm vi học tập</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-canvas-ink p-3 border border-whisper-border rounded-[4px] animate-in fade-in">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono text-muted-steel uppercase tracking-widest font-bold mr-1">
          BỘ LỌC ĐANG BẬT:
        </span>

        {query && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-pure-surface border border-whisper-border text-titanium-white text-xs font-mono">
            Từ khóa: <strong className="text-safety-orange">"{query}"</strong>
            <button type="button" onClick={onClearQuery} className="hover:text-rose-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {hsk && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold">
            {hsk}
            <button type="button" onClick={onClearHsk} className="hover:text-rose-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {cefr && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/40 text-blue-400 text-xs font-mono font-bold">
            TOEIC {cefr}
            <button type="button" onClick={onClearCefr} className="hover:text-rose-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {domain && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-safety-orange/20 border border-safety-orange/40 text-safety-orange text-xs font-mono uppercase">
            Ngành: {domain}
            <button type="button" onClick={onClearDomain} className="hover:text-rose-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {advancedFilters.learningStatus !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/40 border border-purple-500/40 text-purple-400 text-xs font-mono uppercase">
            Trạng thái: {advancedFilters.learningStatus}
            <button type="button" onClick={() => onRemoveAdvancedFilter('learningStatus')} className="hover:text-rose-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}

        {advancedFilters.isSavedOnly && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-pink-950/40 border border-pink-500/40 text-pink-400 text-xs font-mono">
            Đã lưu
            <button type="button" onClick={() => onRemoveAdvancedFilter('isSavedOnly')} className="hover:text-rose-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-titanium-white font-bold">
          {totalResults.toLocaleString()} KẾT QUẢ
        </span>
        <button
          type="button"
          onClick={onResetAll}
          className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1 font-bold"
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
        </button>
      </div>
    </div>
  );
}
