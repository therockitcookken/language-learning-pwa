'use client';

import React from 'react';
import { BookOpen, CheckCircle2, RotateCcw, FolderHeart, Flame } from 'lucide-react';

interface DictionaryStatsProps {
  total: number;
  learnedCount: number;
  reviewCount: number;
  savedCount: number;
  streakDays?: number;
}

export function DictionaryStats({
  total,
  learnedCount,
  reviewCount,
  savedCount,
  streakDays = 5,
}: DictionaryStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="bg-slate-900/50 border border-slate-800/60 p-3.5 rounded-2xl flex items-center gap-3.5 backdrop-blur-2xl shadow-md hover:border-slate-700/80 transition-all group">
        <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 group-hover:scale-105 transition-transform">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng số từ</div>
          <div className="text-base font-black text-white">{total.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/60 p-3.5 rounded-2xl flex items-center gap-3.5 backdrop-blur-2xl shadow-md hover:border-slate-700/80 transition-all group">
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đã thuộc</div>
          <div className="text-base font-black text-emerald-400">{learnedCount.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/60 p-3.5 rounded-2xl flex items-center gap-3.5 backdrop-blur-2xl shadow-md hover:border-slate-700/80 transition-all group">
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 group-hover:scale-105 transition-transform">
          <RotateCcw className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cần ôn hôm nay</div>
          <div className="text-base font-black text-amber-400">{reviewCount.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/60 p-3.5 rounded-2xl flex items-center gap-3.5 backdrop-blur-2xl shadow-md hover:border-slate-700/80 transition-all group">
        <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 group-hover:scale-105 transition-transform">
          <FolderHeart className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đã lưu</div>
          <div className="text-base font-black text-purple-400">{savedCount.toLocaleString()}</div>
        </div>
      </div>

      <div className="col-span-2 sm:col-span-1 bg-slate-900/50 border border-slate-800/60 p-3.5 rounded-2xl flex items-center gap-3.5 backdrop-blur-2xl shadow-md hover:border-slate-700/80 transition-all group">
        <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 group-hover:scale-105 transition-transform">
          <Flame className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chuỗi ngày học</div>
          <div className="text-base font-black text-white">{streakDays} Ngày</div>
        </div>
      </div>
    </div>
  );
}
