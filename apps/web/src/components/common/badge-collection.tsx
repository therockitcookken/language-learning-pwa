'use client';

import React from 'react';
import { Award, ShieldCheck, Flame, Zap, Trophy, Lock } from 'lucide-react';
import { useUserProgress } from '@/lib/contexts/user-progress-context';
import { NumberCounter } from '@/components/common/animations';

export function BadgeCollection() {
  const progress = useUserProgress();

  const badges = [
    { 
      id: 1, 
      title: 'Chiến sĩ An toàn PCCC', 
      icon: ShieldCheck, 
      unlocked: progress.quizzesPassed >= 1, 
      desc: 'Hoàn thành Bài thi An toàn Lao động',
      progress: Math.min(1, progress.quizzesPassed) / 1
    },
    { 
      id: 2, 
      title: 'Kỹ thuật viên CNC', 
      icon: Zap, 
      unlocked: progress.wordsLearned >= 50, 
      desc: 'Thuộc 50 thuật ngữ bảo trì cơ khí',
      progress: Math.min(50, progress.wordsLearned) / 50
    },
    { 
      id: 3, 
      title: 'Bậc thầy Pinyin', 
      icon: Flame, 
      unlocked: progress.level >= 2, 
      desc: 'Đạt Cấp độ 2 (Level 2)',
      progress: Math.min(2, progress.level) / 2
    },
    { 
      id: 4, 
      title: 'Chuyền trưởng Xuất sắc', 
      icon: Trophy, 
      unlocked: progress.streak >= 5, 
      desc: 'Duy trì chuỗi Streak 5 ngày liên tiếp',
      progress: Math.min(5, progress.streak) / 5
    },
    { 
      id: 5, 
      title: 'Quản lý Kho Logistics', 
      icon: Award, 
      unlocked: progress.xp >= 300, 
      desc: 'Đạt 300 Điểm kinh nghiệm (XP)',
      progress: Math.min(300, progress.xp) / 300
    },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="bg-slate-900/75 border-2 border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-xl double-bezel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
        <h3 className="text-lg font-sans font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-500" />
          Achievement Badges
        </h3>
        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 border border-slate-800 rounded-lg uppercase">
          <NumberCounter value={unlockedCount} />/{badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border-2 text-center space-y-2 transition-all group relative overflow-hidden ${
                b.unlocked
                  ? 'bg-slate-950 border-orange-500/40 hover:border-orange-500 shadow-md shadow-orange-500/10'
                  : 'bg-slate-900/50 border-slate-800 opacity-70 grayscale'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto flex items-center justify-center transition-transform group-hover:-translate-y-1 ${
                  b.unlocked
                    ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]'
                    : 'text-slate-500'
                }`}
              >
                {b.unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
              </div>
              <h4 className="text-xs font-sans font-black text-white line-clamp-1">{b.title}</h4>
              <p className="text-[10px] font-mono text-slate-400 line-clamp-2">{b.desc}</p>
              
              {/* Progress bar for locked badges */}
              {!b.unlocked && (
                <div className="absolute bottom-0 left-0 h-1 bg-orange-500/20 w-full">
                  <div className="h-full bg-orange-500" style={{ width: `${b.progress * 100}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
