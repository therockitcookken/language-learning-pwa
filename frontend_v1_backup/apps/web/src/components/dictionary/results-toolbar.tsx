'use client';

import React from 'react';
import { ViewMode, SortOption } from './dictionary-types';
import { LayoutGrid, Grid, List, Table, GraduationCap, ArrowUpDown, CheckSquare, Sparkles } from 'lucide-react';

interface ResultsToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  isMultiSelect: boolean;
  onToggleMultiSelect: () => void;
  onOpenQuickStudy: () => void;
}

export function ResultsToolbar({
  viewMode,
  onViewModeChange,
  sortOption,
  onSortOptionChange,
  isMultiSelect,
  onToggleMultiSelect,
  onOpenQuickStudy,
}: ResultsToolbarProps) {
  const viewModes = [
    { id: 'grid_spacious' as ViewMode, icon: LayoutGrid, label: 'Grid Thoáng' },
    { id: 'grid_compact' as ViewMode, icon: Grid, label: 'Grid Gọn' },
    { id: 'list' as ViewMode, icon: List, label: 'Danh Sách' },
    { id: 'table' as ViewMode, icon: Table, label: 'Bảng Dữ Liệu' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 bg-slate-900/70 border border-slate-800/60 p-4 rounded-3xl shadow-xl backdrop-blur-2xl">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Quick Study Button */}
        <button
          type="button"
          onClick={onOpenQuickStudy}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
        >
          <GraduationCap className="w-4 h-4 text-amber-200" /> HỌC NHANH (QUICK STUDY)
        </button>

        {/* Multi Select Toggle */}
        <button
          type="button"
          onClick={onToggleMultiSelect}
          className={`px-4 py-2.5 border rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
            isMultiSelect
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/15 scale-105'
              : 'bg-slate-950/60 border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700/60'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-orange-400" /> {isMultiSelect ? 'ĐANG CHỌN NHIỀU' : 'CHỌN NHIỀU'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-300 bg-slate-950/70 px-3.5 py-2 border border-slate-800/60 rounded-2xl shadow-sm">
          <ArrowUpDown className="w-4 h-4 text-orange-400" />
          <span className="text-slate-400">SẮP XẾP:</span>
          <select
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
            className="bg-slate-950 text-slate-200 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
          >
            <option value="default">Mặc định</option>
            <option value="az">Tên A → Z</option>
            <option value="za">Tên Z → A</option>
            <option value="level_low_high">Cấp độ Thấp → Cao</option>
            <option value="level_high_low">Cấp độ Cao → Thấp</option>
            <option value="newest">Mới cập nhật</option>
            <option value="learning_status">Trạng thái học tập</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/70 border border-slate-800/60 p-1.5 rounded-2xl shadow-inner">
          {viewModes.map((vm) => {
            const Icon = vm.icon;
            const isActive = viewMode === vm.id;
            return (
              <button
                key={vm.id}
                type="button"
                onClick={() => onViewModeChange(vm.id)}
                className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title={vm.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

