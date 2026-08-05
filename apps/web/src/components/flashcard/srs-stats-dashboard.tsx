'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Brain,
} from 'lucide-react';

interface SRSStatsData {
  language: 'zh' | 'en';
  totalCards: number;
  reviewedCount: number;
  dueCount: number;
  masteredCount: number;
  newCount: number;
  retentionRate: number;
  streakDays: number;
  totalStudyMinutes: number;
  totalXp: number;
  hardestWords: Array<{
    id: string;
    word: string;
    meaning: string;
    pinyinOrIpa: string;
    easeFactor: number;
  }>;
  levelCounts: Record<string, number>;
}

interface StatsDashboardProps {
  lang: 'zh' | 'en';
}

export function SRSStatsDashboard({ lang }: StatsDashboardProps) {
  const [stats, setStats] = useState<SRSStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/flashcards/stats?lang=${lang}`);
      const json = await res.json();
      if (json.data) {
        setStats(json.data);
      }
    } catch {
      // Quiet fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [lang]);

  if (loading || !stats) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3 max-w-xl mx-auto my-8">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-extrabold">Đang tổng hợp dữ liệu thống kê ghi nhớ...</p>
      </div>
    );
  }

  const isZh = lang === 'zh';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            ⏰ Thẻ Đến Hạn Ôn
          </span>
          <p className="text-2xl font-black text-orange-400">{stats.dueCount} thẻ</p>
          <span className="text-[10px] text-slate-400">Cần ôn tập trong ngày</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            🎯 Tỷ Lệ Ghi Nhớ
          </span>
          <p className="text-2xl font-black text-emerald-400">{stats.retentionRate}%</p>
          <span className="text-[10px] text-emerald-400/90 font-medium">Đạt tiêu chuẩn SRS</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            🔥 Chuỗi Ngày Học
          </span>
          <p className="text-2xl font-black text-amber-400">{stats.streakDays} ngày</p>
          <span className="text-[10px] text-slate-400">Duy trì liên tục</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            ⌛ Thời Gian Học
          </span>
          <p className="text-2xl font-black text-indigo-400">{stats.totalStudyMinutes} phút</p>
          <span className="text-[10px] text-slate-400">Tổng thời gian đã ôn</span>
        </div>
      </div>

      {/* Progress Breakdown & Level Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Memory Mastery Status */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <Brain className="w-4 h-4 text-orange-400" /> Phân Phối Trạng Thái Ghi Nhớ ({isZh ? 'Tiếng Trung' : 'Tiếng Anh'})
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span>Đã Thuộc Lòng (Mastered)</span>
                <span className="text-emerald-400">{stats.masteredCount} thẻ</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (stats.masteredCount / stats.totalCards) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span>Đang Trong Vòng Lặp SRS</span>
                <span className="text-blue-400">{stats.reviewedCount} thẻ</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (stats.reviewedCount / stats.totalCards) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span>Từ Mới Chưa Ôn</span>
                <span className="text-orange-400">{stats.newCount} thẻ</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (stats.newCount / stats.totalCards) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Level Distribution Bar Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" /> Phân Phối Cấp Độ ({isZh ? 'HSK 1-6' : 'CEFR A1-C2'})
          </h4>

          <div className="grid grid-cols-2 gap-2.5">
            {Object.entries(stats.levelCounts).map(([lvl, count]) => (
              <div key={lvl} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="font-extrabold text-orange-400">{lvl}</span>
                <span className="font-bold text-slate-200">{count} từ</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hardest Words List Table */}
      {stats.hardestWords.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
          <h4 className="text-sm font-black text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Danh Sách Từ Khó Cần Ôn Tập Lại (High Error Rate)
          </h4>

          <div className="divide-y divide-slate-800 text-xs">
            {stats.hardestWords.map((hw) => (
              <div key={hw.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-100 text-sm">{hw.word}</span>
                  <span className="text-orange-400 ml-2 font-bold">{hw.pinyinOrIpa}</span>
                  <p className="text-slate-400 text-[11px]">{hw.meaning}</p>
                </div>
                <span className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-500/30 rounded-xl font-extrabold text-[10px]">
                  Ease: {hw.easeFactor}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
