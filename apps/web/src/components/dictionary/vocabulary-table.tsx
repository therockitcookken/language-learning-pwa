'use client';

import React from 'react';
import { Volume2, Bookmark, ExternalLink } from 'lucide-react';
import { VocabularyItem } from './dictionary-types';

interface VocabularyTableProps {
  items: VocabularyItem[];
  selectedIds: Record<string, boolean>;
  onToggleSelect: (id: string) => void;
  savedIds: Record<string, boolean>;
  onToggleFavorite: (item: VocabularyItem) => void;
  onSpeak: (text: string, lang: 'zh-CN' | 'en-US') => void;
  onOpenPreview: (item: VocabularyItem) => void;
}

export function VocabularyTable({
  items,
  selectedIds,
  onToggleSelect,
  savedIds,
  onToggleFavorite,
  onSpeak,
  onOpenPreview,
}: VocabularyTableProps) {
  return (
    <div className="overflow-x-auto border border-whisper-border rounded-[4px]">
      <table className="w-full text-left font-mono text-xs text-titanium-white bg-pure-surface">
        <thead className="bg-canvas-ink border-b border-whisper-border text-muted-steel uppercase text-[10px] tracking-wider">
          <tr>
            <th className="p-3 w-10">#</th>
            <th className="p-3">TỪ VỰNG</th>
            <th className="p-3">PINYIN / IPA</th>
            <th className="p-3">NGHĨA TIẾNG VIỆT</th>
            <th className="p-3">NGHĨA TIẾNG ANH</th>
            <th className="p-3">CẤP ĐỘ</th>
            <th className="p-3">CHỦ ĐỀ</th>
            <th className="p-3 text-right">THAO TÁC</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-whisper-border/50">
          {items.map((item, idx) => {
            const isZh = item.language === 'zh';
            const isSaved = Boolean(savedIds[item.id]);
            const isSelected = Boolean(selectedIds[item.id]);

            return (
              <tr
                key={item.id}
                className={`hover:bg-canvas-ink/60 transition-colors ${
                  isSelected ? 'bg-safety-orange/10' : ''
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(item.id)}
                    className="w-4 h-4 accent-safety-orange cursor-pointer"
                  />
                </td>
                <td className="p-3 font-sans font-bold text-sm text-titanium-white">
                  <button
                    type="button"
                    onClick={() => onOpenPreview(item)}
                    className="hover:text-safety-orange transition-colors text-left"
                  >
                    {item.simplified || item.word}
                  </button>
                </td>
                <td className="p-3 font-bold text-safety-orange">{item.pinyin || item.ipa}</td>
                <td className="p-3 font-sans font-bold">{item.meaningVi}</td>
                <td className="p-3 font-sans text-muted-steel">
                  {item.meaningEn && !item.meaningEn.includes('Practical Chinese (') ? item.meaningEn : '---'}
                </td>
                <td className="p-3">
                  {item.hskLevel ? (
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold">
                      {item.hskLevel}
                    </span>
                  ) : item.cefrLevel ? (
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-1.5 py-0.5 rounded text-[9px] font-bold">
                      TOEIC {item.cefrLevel}
                    </span>
                  ) : (
                    <span className="text-muted-steel">---</span>
                  )}
                </td>
                <td className="p-3 uppercase text-[10px] text-muted-steel">
                  {item.factoryDomain || item.topic || 'General'}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onSpeak(item.simplified || item.word, isZh ? 'zh-CN' : 'en-US')}
                      className="p-1.5 bg-canvas-ink border border-whisper-border hover:bg-safety-orange hover:text-canvas-ink text-muted-steel rounded"
                      title="Phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item)}
                      className={`p-1.5 border rounded ${
                        isSaved ? 'bg-titanium-white border-titanium-white text-canvas-ink' : 'bg-canvas-ink border-whisper-border text-muted-steel'
                      }`}
                      title="Lưu"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPreview(item)}
                      className="p-1.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel text-muted-steel hover:text-titanium-white rounded"
                      title="Chi tiết"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
