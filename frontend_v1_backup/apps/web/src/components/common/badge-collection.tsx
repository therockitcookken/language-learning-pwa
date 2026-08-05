'use client';

import React from 'react';
import { Award, ShieldCheck, Flame, Zap, Trophy, CheckCircle2, Lock } from 'lucide-react';

export function BadgeCollection() {
  const badges = [
    { id: 1, title: 'Chiến sĩ An toàn PCCC', icon: ShieldCheck, unlocked: true, desc: 'Hoàn thành Bài thi An toàn Lao động' },
    { id: 2, title: 'Kỹ thuật viên CNC', icon: Zap, unlocked: true, desc: 'Thuộc 50 thuật ngữ bảo trì cơ khí' },
    { id: 3, title: 'Bậc thầy Pinyin', icon: Flame, unlocked: true, desc: 'Đạt điểm tuyệt đối bài kiểm tra phát âm' },
    { id: 4, title: 'Chuyền trưởng Xuất sắc', icon: Trophy, unlocked: true, desc: 'Duy trì chuỗi Streak 5 ngày liên tiếp' },
    { id: 5, title: 'Quản lý Kho Logistics', icon: Award, unlocked: false, desc: 'Hoàn thành bài thi Kho hàng (Cần 300 XP)' },
  ];

  return (
    <div className="bg-pure-surface border border-whisper-border rounded-[4px] p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-whisper-border pb-3">
        <h3 className="text-lg font-sans font-black text-titanium-white uppercase tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-safety-orange" />
          Achievement Badges
        </h3>
        <span className="text-[10px] font-mono font-bold text-muted-steel bg-canvas-ink px-2 py-1 border border-whisper-border uppercase">
          4/5 Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className={`p-4 rounded-[4px] border text-center space-y-2 transition-all group ${
                b.unlocked
                  ? 'bg-canvas-ink border-whisper-border hover:border-safety-orange'
                  : 'bg-pure-surface border-whisper-border opacity-60 grayscale'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto flex items-center justify-center transition-transform group-hover:-translate-y-[1px] ${
                  b.unlocked
                    ? 'text-safety-orange'
                    : 'text-muted-steel'
                }`}
              >
                {b.unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
              </div>
              <h4 className="text-xs font-sans font-bold text-titanium-white line-clamp-1">{b.title}</h4>
              <p className="text-[10px] font-mono text-muted-steel line-clamp-2">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
