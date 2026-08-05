'use client';

import React from 'react';
import { Trophy, Award, Target, Flame, TrendingUp, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';

export interface QuizStatsDashboardProps {
  language: 'zh' | 'en';
  historyStats: {
    totalAttempts: number;
    highestScore: number;
    passRate: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswered: number;
  };
}

export function QuizStatsDashboard({ language, historyStats }: QuizStatsDashboardProps) {
  const isZh = language === 'zh';
  const levels = isZh ? ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'] : ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const topics = isZh
    ? [
        { name: 'An toàn lao động (Safety PPE)', progress: 88 },
        { name: 'Quản lý chất lượng (QC)', progress: 75 },
        { name: 'Bảo trì máy móc (Maintenance)', progress: 62 },
        { name: 'Vận hành kho vận (Logistics)', progress: 80 },
        { name: 'Giao tiếp công xưởng', progress: 91 },
      ]
    : [
        { name: 'Workplace Safety & Protocol', progress: 85 },
        { name: 'Quality Control & Inspection', progress: 70 },
        { name: 'Machinery & Equipment', progress: 65 },
        { name: 'Warehouse & Shipping', progress: 82 },
        { name: 'Assembly Line Technical Terms', progress: 90 },
      ];

  return (
    <div className="space-y-6">
      {/* Top Banner Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" /> Tổng Số Phiên Thi
          </span>
          <span className="text-3xl font-black text-white">
            {historyStats.totalAttempts || 12} <span className="text-xs text-slate-500 font-normal">phiên</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" /> Tỷ Lệ Đạt (Pass Yield)
          </span>
          <span className="text-3xl font-black text-emerald-400">
            {historyStats.passRate || 85}%
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-orange-400" /> Điểm Cao Nhất
          </span>
          <span className="text-3xl font-black text-orange-400">
            {historyStats.highestScore || 100} <span className="text-xs text-slate-500 font-normal">XP</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-indigo-400" /> Tổng Số Câu Trả Lời
          </span>
          <span className="text-3xl font-black text-indigo-400">
            {historyStats.totalQuestionsAnswered || 340} <span className="text-xs text-slate-500 font-normal">câu</span>
          </span>
        </div>
      </div>

      {/* Level Progress & Topic Weakness Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Levels Completion Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Tiến độ Cấp độ {isZh ? 'HSK 1–6' : 'CEFR A1–C2'}
          </h3>

          <div className="space-y-3">
            {levels.map((lvl, idx) => {
              const mockPct = Math.min(100, Math.max(25, 100 - idx * 15));
              return (
                <div key={lvl} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-200">{lvl}</span>
                    <span className="text-amber-400">{mockPct}% Hoàn thành (500 câu)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${mockPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Breakdown & Weakness Warning */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Độ Chính Xác Theo Chủ Đề Công Xưởng
            </h3>

            <div className="space-y-3">
              {topics.map((t) => (
                <div key={t.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{t.name}</span>
                    <span className="font-bold text-slate-100">{t.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        t.progress >= 80 ? 'bg-emerald-500' : t.progress >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 mt-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-300 block">Đề xuất cải thiện điểm yếu:</span>
              <p className="text-amber-200/80 leading-relaxed">
                Bạn nên dành 10 phút luyện tập thêm chủ đề {topics.reduce((prev, curr) => (prev.progress < curr.progress ? prev : curr)).name} để nâng tỷ lệ đạt chỉ tiêu an toàn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
