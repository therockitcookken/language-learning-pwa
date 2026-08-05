'use client';

import React from 'react';
import { SearchX, RotateCcw, Sparkles } from 'lucide-react';

interface DictionaryEmptyStateProps {
  query?: string;
  onResetFilters: () => void;
}

export function DictionaryEmptyState({ query, onResetFilters }: DictionaryEmptyStateProps) {
  return (
    <div className="bg-pure-surface border border-whisper-border p-12 rounded-[4px] text-center space-y-4 my-6">
      <div className="w-16 h-16 bg-canvas-ink border border-whisper-border text-safety-orange rounded-full flex items-center justify-center mx-auto shadow-inner">
        <SearchX className="w-8 h-8" />
      </div>

      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-lg font-mono font-bold text-titanium-white uppercase">
          KHÔNG TÌM THẤY KẾT QUẢ PHÙ HỢP
        </h3>
        <p className="text-xs font-sans text-muted-steel">
          {query ? (
            <>Không tìm thấy từ vựng nào khớp với từ khóa "<strong className="text-safety-orange">{query}</strong>".</>
          ) : (
            <>Không tìm thấy từ vựng nào phù hợp với bộ lọc hiện tại trong kho từ điển chuẩn.</>
          )}
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="px-6 py-2.5 bg-safety-orange hover:bg-orange-600 text-canvas-ink text-xs font-mono font-bold rounded-[4px] transition-transform active:translate-y-[1px] inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> BỎ BỘ LỌC VỀ MẶC ĐỊNH
        </button>
      </div>
    </div>
  );
}
