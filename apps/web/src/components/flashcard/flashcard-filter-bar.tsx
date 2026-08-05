'use client';

import React from 'react';
import {
  Flame,
  Zap,
  AlertTriangle,
  Headphones,
  Edit3,
  Moon,
  Sparkles,
} from 'lucide-react';

export interface FlashcardFilters {
  lang: 'zh' | 'en';
  level: string;
  topic: string;
  pos: string;
  status: string; // 'all' | 'due' | 'new' | 'learned' | 'hard' | 'starred'
  specialMode: string; // '' | 'hard_words' | 'quick_5min' | 'high_error' | 'listen_type' | 'rewrite' | 'pre_bedtime'
}

interface FilterBarProps {
  filters: FlashcardFilters;
  onFilterChange: (newFilters: FlashcardFilters) => void;
  totalCardsCount: number;
  dueCount: number;
}

export function FlashcardFilterBar({
  filters,
  onFilterChange,
  totalCardsCount,
  dueCount,
}: FilterBarProps) {
  const isZh = filters.lang === 'zh';

  const levels = isZh
    ? ['Tất cả cấp độ', 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6']
    : ['Tất cả cấp độ', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const topics = [
    'Tất cả chủ đề',
    'Safety & Protection',
    'Assembly & Production',
    'Quality Control',
    'Maintenance & Machinery',
    'Logistics & Warehouse',
    'Daily Communication',
    'Office & Admin',
  ];

  const posOptions = ['Tất cả từ loại', 'noun', 'verb', 'adjective', 'adverb', 'preposition'];

  const update = (key: keyof FlashcardFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleSpecialModeToggle = (modeKey: string) => {
    if (filters.specialMode === modeKey) {
      onFilterChange({ ...filters, specialMode: '' });
    } else {
      onFilterChange({ ...filters, specialMode: modeKey });
    }
  };

  return (
    <div className="space-y-3.5 bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-xl">
      {/* Top Filter Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Level Filter */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 block">
            Cấp độ ({isZh ? 'HSK' : 'CEFR'})
          </label>
          <select
            value={filters.level}
            onChange={(e) => update('level', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl.startsWith('Tất cả') ? '' : lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Filter */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 block">
            Chủ đề nhà máy / Đời sống
          </label>
          <select
            value={filters.topic}
            onChange={(e) => update('topic', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
          >
            {topics.map((tp) => (
              <option key={tp} value={tp.startsWith('Tất cả') ? '' : tp}>
                {tp}
              </option>
            ))}
          </select>
        </div>

        {/* POS Filter */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 block">
            Từ loại (Part of Speech)
          </label>
          <select
            value={filters.pos}
            onChange={(e) => update('pos', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
          >
            {posOptions.map((pos) => (
              <option key={pos} value={pos.startsWith('Tất cả') ? '' : pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        {/* Recall Status Filter */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 block">
            Trạng thái SRS
          </label>
          <select
            value={filters.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả ({isZh ? '10,000' : '10,000'} thẻ)</option>
            <option value="due">⏰ Đến hạn ôn ({dueCount} thẻ)</option>
            <option value="starred">⭐ Từ yêu thích</option>
            <option value="new">🆕 Từ mới chưa học</option>
            <option value="learned">✅ Đang học / Đã thuộc</option>
          </select>
        </div>
      </div>

      {/* Special Study Sessions Toolbar */}
      <div className="pt-2 border-t border-slate-800/80">
        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-orange-400" /> Chế Độ Ôn Tập Đặc Biệt
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSpecialModeToggle('hard_words')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filters.specialMode === 'hard_words'
                ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Từ Khó
          </button>

          <button
            onClick={() => handleSpecialModeToggle('quick_5min')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filters.specialMode === 'quick_5min'
                ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Ôn Nhanh 5 Phút
          </button>

          <button
            onClick={() => handleSpecialModeToggle('high_error')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filters.specialMode === 'high_error'
                ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-600/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Sai Nhiều
          </button>

          <button
            onClick={() => handleSpecialModeToggle('listen_type')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filters.specialMode === 'listen_type'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-indigo-400" /> Nghe–Nhập
          </button>

          <button
            onClick={() => handleSpecialModeToggle('rewrite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filters.specialMode === 'rewrite'
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Viết Lại Từ
          </button>

          <button
            onClick={() => handleSpecialModeToggle('pre_bedtime')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filters.specialMode === 'pre_bedtime'
                ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-purple-400" /> Ôn Trước Khi Ngủ
          </button>
        </div>
      </div>
    </div>
  );
}


