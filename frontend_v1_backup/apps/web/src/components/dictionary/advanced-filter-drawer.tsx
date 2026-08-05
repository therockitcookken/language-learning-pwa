'use client';

import React from 'react';
import { X, RotateCcw, Check, Bookmark, Sparkles, Filter } from 'lucide-react';
import { AdvancedFilterState, LanguageWorkspace } from './dictionary-types';

interface AdvancedFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedFilterState;
  onFilterChange: (filters: AdvancedFilterState) => void;
  activeWorkspace: LanguageWorkspace;
  onWorkspaceChange: (ws: LanguageWorkspace) => void;
  onResetAll: () => void;
}

export function AdvancedFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  activeWorkspace,
  onWorkspaceChange,
  onResetAll,
}: AdvancedFilterDrawerProps) {
  if (!isOpen) return null;

  const toggleArrayFilter = (field: 'hskLevels' | 'toeicLevels' | 'factoryDomains' | 'partOfSpeech', value: string) => {
    const current = filters[field];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange({ ...filters, [field]: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-canvas-ink/80 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="bg-pure-surface border-l border-whisper-border w-full max-w-md h-full flex flex-col justify-between p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right">
        {/* Drawer Header */}
        <div className="space-y-4 border-b border-whisper-border pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-mono font-bold text-titanium-white uppercase flex items-center gap-2">
              <Filter className="w-5 h-5 text-safety-orange" /> BỘ LỌC CHUYÊN SÂU (ADVANCED)
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-muted-steel hover:text-safety-orange transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs font-sans text-muted-steel">
            Tùy chỉnh tiêu chí tìm kiếm, cấp độ ngôn ngữ, ngành công xưởng và trạng thái học tập cá nhân.
          </p>
        </div>

        {/* Drawer Content */}
        <div className="space-y-6 py-4 flex-1 overflow-y-auto">
          {/* Section 1: Ngôn ngữ Workspace */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-titanium-white uppercase">1. Không gian Ngôn ngữ</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'zh', label: '🇨🇳 Trung' },
                { id: 'en', label: '🇬🇧 Anh' },
                { id: 'bilingual', label: '🇨🇳🇬🇧 Song ngữ' },
              ].map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => onWorkspaceChange(ws.id as LanguageWorkspace)}
                  className={`py-2 text-xs font-mono font-bold rounded-[4px] border transition-all ${
                    activeWorkspace === ws.id
                      ? 'bg-safety-orange text-canvas-ink border-safety-orange'
                      : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
                  }`}
                >
                  {ws.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: HSK / TOEIC Levels */}
          {(activeWorkspace === 'zh' || activeWorkspace === 'bilingual') && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-titanium-white uppercase">2. Cấp độ HSK</div>
              <div className="flex flex-wrap gap-2">
                {['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => toggleArrayFilter('hskLevels', lvl)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold border transition-all ${
                      filters.hskLevels.includes(lvl)
                        ? 'bg-amber-500 text-canvas-ink border-amber-500'
                        : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(activeWorkspace === 'en' || activeWorkspace === 'bilingual') && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-titanium-white uppercase">3. Cấp độ TOEIC / CEFR</div>
              <div className="flex flex-wrap gap-2">
                {['A2', 'B1', 'B2', 'C1'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => toggleArrayFilter('toeicLevels', lvl)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold border transition-all ${
                      filters.toeicLevels.includes(lvl)
                        ? 'bg-blue-500 text-canvas-ink border-blue-500'
                        : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
                    }`}
                  >
                    TOEIC {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Ngành Công xưởng */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-titanium-white uppercase">4. Ngành Công xưởng</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bao_tri', label: 'Bảo trì & CNC' },
                { id: 'day_chuyen', label: 'Dây chuyền sản xuất' },
                { id: 'chat_luong', label: 'Kiểm định QC' },
                { id: 'an_toan', label: 'An toàn lao động' },
                { id: 'kho_hang', label: 'Kho & Vận chuyển' },
                { id: 'van_phong', label: 'Văn phòng nhà máy' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleArrayFilter('factoryDomains', d.id)}
                  className={`p-2 text-xs font-mono text-left rounded border transition-all ${
                    filters.factoryDomains.includes(d.id)
                      ? 'bg-safety-orange/20 text-safety-orange border-safety-orange'
                      : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Loại từ (Part of Speech) */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-titanium-white uppercase">5. Loại từ (Grammar)</div>
            <div className="flex flex-wrap gap-2">
              {['noun', 'verb', 'adjective', 'phrase', 'technicalTerm'].map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => toggleArrayFilter('partOfSpeech', pos)}
                  className={`px-3 py-1.5 rounded text-xs font-mono border transition-all uppercase ${
                    filters.partOfSpeech.includes(pos)
                      ? 'bg-purple-500 text-canvas-ink border-purple-500 font-bold'
                      : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Trạng thái cá nhân */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-titanium-white uppercase">6. Trạng thái học cá nhân</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Tất cả trạng thái' },
                { id: 'unlearned', label: 'Chưa học' },
                { id: 'learned', label: 'Đã thuộc' },
                { id: 'needs_review', label: 'Cần ôn tập' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, learningStatus: st.id as any })}
                  className={`p-2 text-xs font-mono text-left rounded border transition-all ${
                    filters.learningStatus === st.id
                      ? 'bg-titanium-white text-canvas-ink border-titanium-white font-bold'
                      : 'bg-canvas-ink border-whisper-border text-muted-steel hover:text-titanium-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Các cờ bật/tắt (Toggles) */}
          <div className="space-y-3 pt-2 border-t border-whisper-border">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-titanium-white">Chỉ từ đã lưu (Bookmark)</span>
              <input
                type="checkbox"
                checked={filters.isSavedOnly}
                onChange={(e) => onFilterChange({ ...filters, isSavedOnly: e.target.checked })}
                className="w-4 h-4 accent-safety-orange"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-titanium-white">Chỉ từ có âm thanh</span>
              <input
                type="checkbox"
                checked={filters.hasAudioOnly}
                onChange={(e) => onFilterChange({ ...filters, hasAudioOnly: e.target.checked })}
                className="w-4 h-4 accent-safety-orange"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-titanium-white">Chỉ từ đã xác minh chuẩn</span>
              <input
                type="checkbox"
                checked={filters.isVerifiedOnly}
                onChange={(e) => onFilterChange({ ...filters, isVerifiedOnly: e.target.checked })}
                className="w-4 h-4 accent-safety-orange"
              />
            </label>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-whisper-border pt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetAll}
            className="px-4 py-2.5 bg-canvas-ink border border-whisper-border hover:border-muted-steel text-xs font-mono font-bold text-muted-steel hover:text-titanium-white rounded-[4px] transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> DỌC LỌC (RESET)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-safety-orange hover:bg-orange-600 text-canvas-ink text-xs font-mono font-bold rounded-[4px] transition-transform active:translate-y-[1px] flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> ÁP DỤNG (APPLY)
          </button>
        </div>
      </div>
    </div>
  );
}
