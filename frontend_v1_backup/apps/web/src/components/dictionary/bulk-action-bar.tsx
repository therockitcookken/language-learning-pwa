'use client';

import React from 'react';
import { Bookmark, Download, Volume2, CheckSquare, X } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  totalOnPage: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkSave: () => void;
  onBulkExport: () => void;
  onBulkPlayAudio: () => void;
  onClose: () => void;
}

export function BulkActionBar({
  selectedCount,
  totalOnPage,
  onSelectAll,
  onDeselectAll,
  onBulkSave,
  onBulkExport,
  onBulkPlayAudio,
  onClose,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-pure-surface border border-safety-orange p-3 rounded-[4px] shadow-2xl flex flex-wrap items-center gap-3 animate-in slide-in-from-bottom max-w-xl w-full">
      <div className="flex items-center gap-2 font-mono text-xs text-titanium-white font-bold pr-3 border-r border-whisper-border">
        <CheckSquare className="w-4 h-4 text-safety-orange" />
        <span>ĐÃ CHỌN: <strong className="text-safety-orange">{selectedCount}</strong> TỪ</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        <button
          type="button"
          onClick={selectedCount === totalOnPage ? onDeselectAll : onSelectAll}
          className="px-2.5 py-1.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel text-xs font-mono text-titanium-white rounded"
        >
          {selectedCount === totalOnPage ? 'Bỏ chọn trang' : 'Chọn toàn trang'}
        </button>

        <button
          type="button"
          onClick={onBulkSave}
          className="px-3 py-1.5 bg-canvas-ink border border-whisper-border hover:border-titanium-white text-xs font-mono text-titanium-white rounded flex items-center gap-1"
        >
          <Bookmark className="w-3.5 h-3.5 text-safety-orange" /> Lưu Flashcard
        </button>

        <button
          type="button"
          onClick={onBulkPlayAudio}
          className="px-3 py-1.5 bg-canvas-ink border border-whisper-border hover:border-titanium-white text-xs font-mono text-titanium-white rounded flex items-center gap-1"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Nghe tuần tự
        </button>

        <button
          type="button"
          onClick={onBulkExport}
          className="px-3 py-1.5 bg-canvas-ink border border-whisper-border hover:border-titanium-white text-xs font-mono text-titanium-white rounded flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" /> Xuất CSV
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1.5 text-muted-steel hover:text-safety-orange transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
